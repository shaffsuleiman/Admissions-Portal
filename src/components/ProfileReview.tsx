"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FileText, Plus, ShieldCheck, Sparkles, Trash2, X } from "lucide-react";
import type { TranscriptExtraction } from "@/lib/ai/schemas";
import { DEFAULT_CONVERSION, SUBJECT_AREAS, toItalian110 } from "@/lib/matching/engine";
import { messageOf, type ConfirmedProfileInput, type Student, type StudentDocument } from "@/lib/supabase/workspace-data";

type CourseRow = { key: string; title: string; creditHours: string; grade: string; area: string };

const toNumber = (value: string) => (value.trim() === "" || Number.isNaN(Number(value)) ? null : Number(value));
const text = (value: number | null | undefined) => (value == null ? "" : String(value));
let rowId = 0;
const newKey = () => `row-${++rowId}`;

function readable(document: StudentDocument) {
  return document.mimeType === "application/pdf" || document.mimeType.startsWith("image/");
}

export function ProfileReview({
  student,
  onClose,
  onRead,
  onSave,
  autoRead = false,
}: {
  student: Student;
  onClose: () => void;
  onRead: (documentId: string) => Promise<TranscriptExtraction>;
  onSave: (input: ConfirmedProfileInput) => Promise<void>;
  autoRead?: boolean;
}) {
  const academic = student.academic;
  const [degreeTitle, setDegreeTitle] = useState(academic.degreeTitle);
  const [institution, setInstitution] = useState(academic.institution);
  const [graduationYear, setGraduationYear] = useState(text(academic.graduationYear));
  const [years, setYears] = useState(text(academic.yearsOfEducation ?? 16));
  const [cgpa, setCgpa] = useState(text(academic.cgpa));
  const [scale, setScale] = useState(text(academic.cgpaScale ?? 4));
  const [creditHours, setCreditHours] = useState(text(academic.totalCreditHours));
  const [englishType, setEnglishType] = useState(academic.englishTestType ?? "IELTS");
  const [englishScore, setEnglishScore] = useState(text(academic.englishOverall));
  const [moi, setMoi] = useState(academic.mediumOfInstruction);
  const [courses, setCourses] = useState<CourseRow[]>(() =>
    student.credits.flatMap((credit) =>
      credit.courses.length
        ? credit.courses.map((course) => ({ key: newKey(), title: course.title, creditHours: text(course.creditHours), grade: course.grade, area: credit.area }))
        : [{ key: newKey(), title: `${credit.area} (total)`, creditHours: text(credit.creditHours ?? (credit.ects ? Math.round((credit.ects / DEFAULT_CONVERSION.ectsPerCreditHour) * 10) / 10 : null)), grade: "", area: credit.area }],
    ),
  );
  const [extractions, setExtractions] = useState<Record<string, TranscriptExtraction>>(() =>
    Object.fromEntries(student.documents.filter((document) => document.extraction).map((document) => [document.id, document.extraction!])),
  );
  const [reading, setReading] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [aiFilled, setAiFilled] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const autoReadStarted = useRef(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const read = async (documentId: string) => {
    setReading(documentId);
    setBulkMessage("");
    setError("");
    try {
      const extraction = await onRead(documentId);
      setExtractions((current) => ({ ...current, [documentId]: extraction }));
    } catch (caught) {
      setError(messageOf(caught) ?? "Reading failed.");
    } finally {
      setReading("");
    }
  };

  const applyReadings = useCallback((readings: TranscriptExtraction[]) => {
    const filled = new Set<string>();
    const pick = <K extends keyof TranscriptExtraction>(key: K) => readings.map((reading) => reading[key]).find((value) => value != null && value !== "");
    const set = (key: string, value: unknown, setter: (value: string) => void) => {
      if (value == null || value === "") return;
      setter(String(value));
      filled.add(key);
    };
    set("degreeTitle", pick("degree_title"), setDegreeTitle);
    set("institution", pick("institution"), setInstitution);
    set("graduationYear", pick("graduation_year"), setGraduationYear);
    set("years", pick("degree_years") != null ? 12 + Number(pick("degree_years")) : null, setYears);
    set("cgpa", pick("cgpa"), setCgpa);
    set("scale", pick("cgpa_scale"), setScale);
    set("creditHours", pick("total_credit_hours"), setCreditHours);
    const english = readings.find((reading) => reading.english_overall != null && reading.english_test_type && reading.english_test_type !== "None");
    if (english) {
      set("englishType", english.english_test_type, setEnglishType);
      set("englishScore", english.english_overall, setEnglishScore);
    }
    if (readings.some((reading) => reading.medium_of_instruction_english)) {
      setMoi(true);
      filled.add("moi");
    }
    const uniqueCourses = new Map<string, NonNullable<TranscriptExtraction["courses"]>[number]>();
    for (const course of readings.flatMap((reading) => reading.courses ?? [])) {
      const key = [course.title, course.credit_hours ?? "", course.grade ?? ""]
        .map((value) => String(value).trim().toLowerCase().replace(/\s+/g, " "))
        .join("|");
      if (!uniqueCourses.has(key)) uniqueCourses.set(key, course);
    }
    const extracted = [...uniqueCourses.values()];
    if (extracted.length) {
      setCourses(
        extracted.map((course) => ({
          key: newKey(),
          title: course.title,
          creditHours: text(course.credit_hours),
          grade: course.grade ?? "",
          area: SUBJECT_AREAS.includes(course.subject_area as never) ? course.subject_area : "Other",
        })),
      );
      filled.add("courses");
    }
    setAiFilled(filled);
  }, []);

  // Applies every AI reading to the form. The counsellor still edits and confirms.
  const applyAi = () => applyReadings(Object.values(extractions));

  const readAll = useCallback(async () => {
    const documents = student.documents.filter(readable);
    if (!documents.length) return;
    setBulkMessage("");
    setError("");

    const combined = { ...extractions };
    const unread = documents.filter((document) => !combined[document.id]);
    const failures: string[] = [];
    let newlyRead = 0;

    try {
      // Run one request at a time so a multi-file profile does not exhaust Gemini's
      // per-minute quota. A failed file does not discard the successful readings.
      for (const [index, document] of unread.entries()) {
        setReading(`all:${index + 1}:${unread.length}`);
        try {
          const extraction = await onRead(document.id);
          combined[document.id] = extraction;
          newlyRead += 1;
          setExtractions({ ...combined });
        } catch (caught) {
          failures.push(`${document.name}: ${messageOf(caught) ?? "reading failed"}`);
        }
      }

      const readings = Object.values(combined);
      if (readings.length) {
        setExtractions(combined);
        applyReadings(readings);
        const reused = readings.length - newlyRead;
        setBulkMessage(
          `${readings.length} document${readings.length === 1 ? "" : "s"} combined and filled${reused > 0 ? ` (${reused} already read)` : ""}. Review before confirming.`,
        );
      }
      if (failures.length) setError(failures.join(" "));
    } finally {
      setReading("");
    }
  }, [applyReadings, extractions, onRead, student.documents]);

  useEffect(() => {
    if (!autoRead || autoReadStarted.current || !student.documents.some(readable)) return;
    autoReadStarted.current = true;
    void readAll();
  }, [autoRead, readAll, student.documents]);

  const totals = useMemo(() => {
    const byArea = new Map<string, number>();
    for (const course of courses) {
      const hours = toNumber(course.creditHours) ?? 0;
      if (hours > 0) byArea.set(course.area, (byArea.get(course.area) ?? 0) + hours);
    }
    return [...byArea.entries()].sort((a, b) => b[1] - a[1]);
  }, [courses]);

  const cgpaValue = toNumber(cgpa);
  const scaleValue = toNumber(scale);
  const grade110 = cgpaValue != null && scaleValue ? toItalian110(cgpaValue, scaleValue) : null;
  const notes = Object.values(extractions).map((reading) => reading.notes).filter(Boolean);
  const lowConfidence = Object.values(extractions).some((reading) => (reading.confidence ?? 100) < 70);

  const save = async () => {
    setError("");
    if (cgpaValue != null && scaleValue != null && cgpaValue > scaleValue) return setError("CGPA can’t be higher than its scale.");
    if (!degreeTitle.trim()) return setError("Add the degree title.");
    setSaving(true);
    try {
      await onSave({
        degreeTitle,
        institution,
        graduationYear: toNumber(graduationYear),
        yearsOfEducation: toNumber(years),
        cgpa: cgpaValue,
        cgpaScale: scaleValue,
        totalCreditHours: toNumber(creditHours),
        englishTestType: englishType === "None" ? null : englishType,
        englishOverall: englishType === "None" ? null : toNumber(englishScore),
        mediumOfInstruction: moi,
        credits: totals.map(([area, hours]) => ({
          area,
          creditHours: Math.round(hours * 10) / 10,
          ects: null,
          courses: courses
            .filter((course) => course.area === area)
            .map((course) => ({ title: course.title, creditHours: toNumber(course.creditHours), grade: course.grade })),
        })),
        reviewedDocumentIds: Object.keys(extractions),
      });
    } catch (caught) {
      setError(messageOf(caught) ?? "Could not save the profile.");
      setSaving(false);
    }
  };

  const field = (key: string) => (aiFilled.has(key) ? "ai-filled" : "");
  const updateCourse = (key: string, patch: Partial<CourseRow>) =>
    setCourses((current) => current.map((course) => (course.key === key ? { ...course, ...patch } : course)));

  return (
    <div className="modal-backdrop">
      <div className="wizard review-modal" role="dialog" aria-modal="true" aria-labelledby="profile-review-title">
        <header>
          <div>
            <p className="eyebrow">COUNSELLOR REVIEW</p>
            <h2 id="profile-review-title">Review {student.name.split(" ")[0]}’s academic profile</h2>
          </div>
          <button onClick={onClose} aria-label="Close review">
            <X size={20} />
          </button>
        </header>
        <div className="wizard-body review-body">
          <section className="review-section">
            <div className="review-section-head">
              <h3>1. Read documents</h3>
              <p>AI reads each file and fills the form. Nothing is used for matching until you confirm.</p>
            </div>
            <div className="review-docs">
              <div className="review-docs-actions">
                <button
                  className="outline-button"
                  disabled={!student.documents.some(readable) || Boolean(reading)}
                  onClick={() => void readAll()}
                >
                  {reading.startsWith("all:") ? <span className="spinner dark" /> : <Sparkles size={14} />}
                  {reading.startsWith("all:")
                    ? `Reading ${reading.split(":")[1]} of ${reading.split(":")[2]}…`
                    : "Extract and fill from all documents"}
                </button>
              </div>
              {student.documents.map((document) => (
                <div className="review-doc" key={document.id}>
                  <FileText size={17} />
                  <span>
                    <strong>{document.name}</strong>
                    <small>
                      {extractions[document.id]
                        ? `Read · ${extractions[document.id].confidence ?? "?"}% legible`
                        : document.status === "failed"
                          ? "Reading failed"
                          : readable(document)
                            ? "Not read yet"
                            : "Only PDF, JPG and PNG can be read"}
                    </small>
                  </span>
                  <button
                    className="outline-button"
                    disabled={!readable(document) || Boolean(reading)}
                    onClick={() => void read(document.id)}
                  >
                    {reading === document.id ? <span className="spinner dark" /> : <Sparkles size={14} />}
                    {extractions[document.id] ? "Read again" : "Read with AI"}
                  </button>
                </div>
              ))}
              {!student.documents.length && <p className="review-muted">No documents uploaded. Enter the details below by hand.</p>}
            </div>
            {Object.keys(extractions).length > 0 && (
              <div className="review-ai-bar">
                <Sparkles size={16} />
                <span>
                  {bulkMessage || `${Object.keys(extractions).length} document${Object.keys(extractions).length === 1 ? "" : "s"} read.`}
                  {lowConfidence && " Some pages were hard to read, check every field."}
                </span>
                <button className="primary-button" onClick={applyAi}>
                  Apply AI results
                </button>
              </div>
            )}
            {notes.length > 0 && (
              <ul className="review-notes">
                {notes.map((note) => (
                  <li key={note}>
                    <AlertTriangle size={13} /> {note}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="review-section">
            <div className="review-section-head">
              <h3>2. Confirm academic details</h3>
              {grade110 != null && (
                <p>
                  Italian scale estimate: <b>{grade110} / 110</b> (standard formula; each university’s own rule is applied when matching)
                </p>
              )}
            </div>
            <div className="field-grid review-grid">
              <label className={field("degreeTitle")}>Degree title<input value={degreeTitle} onChange={(e) => setDegreeTitle(e.target.value)} placeholder="BS Computer Science" /></label>
              <label className={field("institution")}>Institution<input value={institution} onChange={(e) => setInstitution(e.target.value)} /></label>
              <label className={field("graduationYear")}>Graduation year<input inputMode="numeric" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} /></label>
              <label className={field("years")}>
                Years of education
                <select value={years} onChange={(e) => setYears(e.target.value)}>
                  {[12, 13, 14, 15, 16, 17, 18].map((value) => (
                    <option key={value} value={value}>{value} years{value === 16 ? " (4-year BS)" : value === 14 ? " (2-year BA/BSc)" : ""}</option>
                  ))}
                </select>
              </label>
              <label className={field("cgpa")}>CGPA<input inputMode="decimal" value={cgpa} onChange={(e) => setCgpa(e.target.value)} /></label>
              <label className={field("scale")}>CGPA scale (maximum)<input inputMode="decimal" value={scale} onChange={(e) => setScale(e.target.value)} /></label>
              <label className={field("creditHours")}>Total credit hours<input inputMode="decimal" value={creditHours} onChange={(e) => setCreditHours(e.target.value)} /></label>
              <label className={field("englishType")}>
                English test
                <select value={englishType} onChange={(e) => setEnglishType(e.target.value)}>
                  {["IELTS", "TOEFL", "PTE", "Duolingo", "None"].map((value) => <option key={value}>{value}</option>)}
                </select>
              </label>
              <label className={field("englishScore")}>English score<input inputMode="decimal" value={englishScore} disabled={englishType === "None"} onChange={(e) => setEnglishScore(e.target.value)} /></label>
              <label className={`review-check ${field("moi")}`}>
                <input type="checkbox" checked={moi} onChange={(e) => setMoi(e.target.checked)} />
                <span>Degree taught in English (medium-of-instruction letter available)</span>
              </label>
            </div>
          </section>

          <section className="review-section">
            <div className="review-section-head">
              <h3>3. Map courses to subject areas</h3>
              <p>Programmes require credits per subject area. Check each course’s area; totals update as you go.</p>
            </div>
            <div className="area-totals">
              {totals.map(([area, hours]) => (
                <span key={area}>
                  <b>{area}</b> {Math.round(hours * 10) / 10} cr ≈ {Math.round(hours * DEFAULT_CONVERSION.ectsPerCreditHour)} ECTS
                </span>
              ))}
              {!totals.length && <span className="review-muted">No credits yet. Read the transcript or add courses.</span>}
            </div>
            <div className={`course-table ${field("courses")}`}>
              <div className="course-row course-head">
                <span>COURSE</span>
                <span>CREDIT HRS</span>
                <span>GRADE</span>
                <span>SUBJECT AREA</span>
                <span />
              </div>
              {courses.map((course) => (
                <div className="course-row" key={course.key}>
                  <input aria-label="Course title" value={course.title} onChange={(e) => updateCourse(course.key, { title: e.target.value })} />
                  <input aria-label="Credit hours" inputMode="decimal" value={course.creditHours} onChange={(e) => updateCourse(course.key, { creditHours: e.target.value })} />
                  <input aria-label="Grade" value={course.grade} onChange={(e) => updateCourse(course.key, { grade: e.target.value })} />
                  <select aria-label="Subject area" value={course.area} onChange={(e) => updateCourse(course.key, { area: e.target.value })}>
                    {SUBJECT_AREAS.map((area) => <option key={area}>{area}</option>)}
                  </select>
                  <button aria-label={`Remove ${course.title || "course"}`} onClick={() => setCourses((current) => current.filter((item) => item.key !== course.key))}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              className="text-button add-course"
              onClick={() => setCourses((current) => [...current, { key: newKey(), title: "", creditHours: "", grade: "", area: "Computer science" }])}
            >
              <Plus size={14} /> Add course
            </button>
          </section>
          {error && <p className="auth-message error" role="alert">{error}</p>}
        </div>
        <footer>
          <span className="review-footnote">
            <ShieldCheck size={15} /> Only confirmed details are used for matching.
          </span>
          <div className="review-actions">
            <button className="secondary-button" onClick={onClose}>Cancel</button>
            <button className="primary-button" disabled={saving} onClick={() => void save()}>
              {saving ? <span className="spinner" /> : <CheckCircle2 size={16} />} Confirm profile
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
