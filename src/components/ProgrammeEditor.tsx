"use client";

import { useEffect, useState } from "react";
import { Check, CircleAlert, ExternalLink, Plus, Quote, Sparkles, Trash2, X } from "lucide-react";
import type { ProgrammeDraft } from "@/lib/ai/schemas";
import { DEFAULT_CONVERSION, hasEligibilityRules, SUBJECT_AREAS, type Conversion } from "@/lib/matching/engine";
import { messageOf, type Programme, type ProgrammeInput, type University } from "@/lib/supabase/workspace-data";

const toNumber = (value: string) => (value.trim() === "" || Number.isNaN(Number(value)) ? null : Number(value));
const text = (value: number | null | undefined) => (value == null ? "" : String(value));

function findUniversity(universities: University[], name: string, city: string) {
  const needle = name.toLowerCase();
  return (
    universities.find((university) => university.name.toLowerCase() === needle) ??
    universities.find((university) => needle && university.name.toLowerCase().includes(needle)) ??
    universities.find((university) => city && university.name.toLowerCase().includes(city.toLowerCase()))
  );
}

export function ProgrammeEditor({
  programme,
  universities,
  onClose,
  onDraft,
  onSave,
}: {
  programme: Programme | null;
  universities: University[];
  onClose: () => void;
  onDraft: (source: { sourceUrl?: string; text?: string }) => Promise<ProgrammeDraft>;
  onSave: (input: ProgrammeInput, conversion: { universityId: string; conversion: Conversion } | null) => Promise<void>;
}) {
  const rules = programme?.rules;
  const [universityId, setUniversityId] = useState(programme?.universityId ?? "");
  const [universityName, setUniversityName] = useState(programme?.university ?? "");
  const [name, setName] = useState(programme?.programme ?? "");
  const [city, setCity] = useState(programme && programme.city !== "Not set" ? programme.city : "");
  const [degreeLevel, setDegreeLevel] = useState(programme?.degreeLevel?.toLowerCase().startsWith("bach") ? "bachelor" : "master");
  const [language, setLanguage] = useState(programme?.language ?? "English");
  const [fee, setFee] = useState(text(programme?.feeValue));
  const [intake, setIntake] = useState(programme && programme.intake !== "Not set" ? programme.intake : "Fall 2027");
  const [deadline, setDeadline] = useState(programme?.deadlineIso ?? "");
  const [applicationUrl, setApplicationUrl] = useState(programme?.applicationUrl ?? "");
  const [source, setSource] = useState(programme && programme.source !== "#" ? programme.source : "");
  const [academicYear, setAcademicYear] = useState(programme?.academicYear || "2027/28");
  const [minYears, setMinYears] = useState(text(rules?.minYearsOfEducation ?? 16));
  const [min110, setMin110] = useState(text(rules?.minGrade110));
  const [minCgpa, setMinCgpa] = useState(text(rules?.minCgpa4));
  const [credits, setCredits] = useState((rules?.subjectCredits ?? []).map((credit) => ({ area: credit.area, ects: String(credit.ects) })));
  const [ielts, setIelts] = useState(text(rules?.english?.ielts));
  const [toefl, setToefl] = useState(text(rules?.english?.toefl));
  const [moi, setMoi] = useState(Boolean(rules?.english?.mediumOfInstructionAccepted));
  const [extras, setExtras] = useState((rules?.extras ?? []).join(", "));
  const [notes, setNotes] = useState(programme?.notes ?? "");
  const university = universities.find((item) => item.id === universityId);
  const [ects, setEcts] = useState(text(university?.conversion.ectsPerCreditHour ?? DEFAULT_CONVERSION.ectsPerCreditHour));
  const [passRatio, setPassRatio] = useState(text(university?.conversion.passRatio ?? DEFAULT_CONVERSION.passRatio));
  const [pasted, setPasted] = useState("");
  const [draft, setDraft] = useState<ProgrammeDraft | null>(null);
  const [evidence, setEvidence] = useState(programme?.evidence ?? []);
  const [drafting, setDrafting] = useState(false);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const chooseUniversity = (id: string) => {
    setUniversityId(id);
    const chosen = universities.find((item) => item.id === id);
    if (chosen) {
      setUniversityName(chosen.name);
      setEcts(String(chosen.conversion.ectsPerCreditHour));
      setPassRatio(String(chosen.conversion.passRatio));
    }
  };

  const runDraft = async () => {
    setError("");
    setDrafting(true);
    try {
      const result = await onDraft(pasted.trim() ? { text: pasted } : { sourceUrl: source });
      setDraft(result);
      setEvidence(result.evidence ?? []);
      const set = (value: unknown, setter: (value: string) => void) => value != null && value !== "" && setter(String(value));
      set(result.programme_name, setName);
      set(result.city, setCity);
      set(result.degree_level, setDegreeLevel);
      set(result.teaching_language, setLanguage);
      set(result.annual_tuition_eur, setFee);
      set(result.intake, setIntake);
      set(result.application_deadline?.slice(0, 10), setDeadline);
      set(result.application_url, setApplicationUrl);
      set(result.academic_year, setAcademicYear);
      set(result.rules?.min_years_of_education, setMinYears);
      set(result.rules?.min_grade_110, setMin110);
      set(result.rules?.min_cgpa_4, setMinCgpa);
      set(result.rules?.english?.ielts, setIelts);
      set(result.rules?.english?.toefl, setToefl);
      if (result.rules?.english?.moi_accepted != null) setMoi(result.rules.english.moi_accepted);
      if (result.rules?.subject_credits?.length)
        setCredits(result.rules.subject_credits.map((credit) => ({ area: credit.area, ects: String(credit.ects) })));
      if (result.rules?.extras?.length) setExtras(result.rules.extras.join(", "));
      if (result.university_name) {
        const match = findUniversity(universities, result.university_name, result.city ?? "");
        if (match) chooseUniversity(match.id);
        else setUniversityName(result.university_name);
      }
    } catch (caught) {
      setError(messageOf(caught) ?? "Drafting failed.");
    } finally {
      setDrafting(false);
    }
  };

  const currentRules = {
    minYearsOfEducation: toNumber(minYears),
    minGrade110: toNumber(min110),
    minCgpa4: toNumber(minCgpa),
    subjectCredits: credits
      .map((credit) => ({
        area: credit.area,
        ects: toNumber(credit.ects) ?? 0,
      }))
      .filter((credit) => credit.ects > 0),
    english: {
      ielts: toNumber(ielts),
      toefl: toNumber(toefl),
      mediumOfInstructionAccepted: moi,
    },
    extras: extras
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };
  const checklist = [
    { label: "Primary source", complete: Boolean(source.trim()) },
    { label: "Admission rule", complete: hasEligibilityRules(currentRules) },
    { label: "Academic year", complete: Boolean(academicYear.trim()) },
    { label: "Tuition", complete: toNumber(fee) != null },
    { label: "Deadline", complete: Boolean(deadline) },
    { label: "Application link", complete: Boolean(applicationUrl.trim()) },
    { label: "Quoted evidence", complete: evidence.length > 0 },
  ];
  const completedChecks = checklist.filter((item) => item.complete).length;

  const save = async (status: ProgrammeInput["status"]) => {
    setError("");
    if (!universityName.trim() || !name.trim()) return setError("Add the university and programme name.");
    if (!source.trim()) return setError("Add the source link you checked these rules against.");
    setSaving(status);
    try {
      const ectsValue = toNumber(ects);
      const ratioValue = toNumber(passRatio);
      await onSave(
        {
          id: programme?.id,
          universityId: universityId || null,
          university: universityName,
          programme: name,
          city,
          degreeLevel,
          language,
          feeValue: toNumber(fee),
          intake,
          deadlineIso: deadline || null,
          applicationUrl,
          source,
          academicYear,
          notes,
          evidence,
          status,
          aiConfidence: draft?.confidence ?? null,
          rules: currentRules,
        },
        university && ectsValue && ratioValue && (ectsValue !== university.conversion.ectsPerCreditHour || ratioValue !== university.conversion.passRatio)
          ? { universityId, conversion: { ectsPerCreditHour: ectsValue, passRatio: ratioValue } }
          : null,
      );
    } catch (caught) {
      setError(messageOf(caught) ?? "Could not save.");
      setSaving("");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="wizard editor-modal" role="dialog" aria-modal="true" aria-labelledby="programme-editor-title">
        <header>
          <div>
            <p className="eyebrow">AI PROGRAMME REVIEW</p>
            <h2 id="programme-editor-title">{programme ? `Review ${programme.programme}` : "Add a programme"}</h2>
          </div>
          <button onClick={onClose} aria-label="Close editor">
            <X size={20} />
          </button>
        </header>
        <div className="editor-body">
          <aside className="editor-source">
            <h3>Source</h3>
            <label>
              Admissions call link
              <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://… (bando PDF or programme page)" />
            </label>
            {source && (
              <a className="text-button" href={source} target="_blank" rel="noreferrer">
                Open source <ExternalLink size={13} />
              </a>
            )}
            <label>
              Or paste the call text
              <textarea value={pasted} onChange={(e) => setPasted(e.target.value)} rows={5} placeholder="Paste the admission requirements section…" />
            </label>
            <button className="outline-button" disabled={drafting || (!source.trim() && !pasted.trim())} onClick={() => void runDraft()}>
              {drafting ? <span className="spinner dark" /> : <Sparkles size={15} />} {drafting ? "Reading source…" : "Read source with AI"}
            </button>
            {(evidence.length > 0 || draft?.notes) && (
              <div className="evidence">
                <p className="eyebrow">AI EVIDENCE · {draft?.confidence ?? 0}% CONFIDENCE</p>
                {evidence.map((item, index) => (
                  <blockquote key={`${item.field}-${index}`}>
                    <Quote size={12} />
                    <span>
                      <b>{item.field}</b> “{item.quote}”
                    </span>
                  </blockquote>
                ))}
                {!evidence.length && <p className="review-muted">No supporting quotes returned, so this cannot be published for matching.</p>}
                {draft?.notes && <p className="review-muted">{draft.notes}</p>}
              </div>
            )}
            <div className="verification-checklist">
              <div>
                <p className="eyebrow">PUBLISH CHECKLIST</p>
                <strong>{completedChecks} of {checklist.length} fields ready</strong>
              </div>
              <span className="verification-progress">
                <i style={{ width: `${(completedChecks / checklist.length) * 100}%` }} />
              </span>
              <ul>
                {checklist.map((item) => (
                  <li className={item.complete ? "complete" : ""} key={item.label}>
                    {item.complete ? <Check size={13} /> : <CircleAlert size={13} />}
                    {item.label}
                  </li>
                ))}
              </ul>
              <small>Only the source and at least one admission rule are required to publish. Complete every available field where the call provides it.</small>
            </div>
          </aside>
          <div className="editor-fields">
            <h3>Programme</h3>
            <div className="field-grid">
              <label className="wide">
                University
                <select value={universityId} onChange={(e) => chooseUniversity(e.target.value)}>
                  <option value="">Not in the directory: type the name below</option>
                  {universities.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>
              {!universityId && (
                <label className="wide">University name<input value={universityName} onChange={(e) => setUniversityName(e.target.value)} /></label>
              )}
              <label className="wide">Programme name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="MSc Data Science" /></label>
              <label>City<input value={city} onChange={(e) => setCity(e.target.value)} /></label>
              <label>
                Level
                <select value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)}>
                  <option value="master">Master’s</option>
                  <option value="bachelor">Bachelor’s</option>
                </select>
              </label>
              <label>Teaching language<input value={language} onChange={(e) => setLanguage(e.target.value)} /></label>
              <label>Tuition / year (EUR)<input inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value)} /></label>
              <label>Intake<input value={intake} onChange={(e) => setIntake(e.target.value)} /></label>
              <label>Academic year<input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} /></label>
              <label>Application deadline<input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label>
              <label>Application portal<input value={applicationUrl} onChange={(e) => setApplicationUrl(e.target.value)} /></label>
            </div>

            <h3>Entry rules</h3>
            <div className="field-grid">
              <label>Years of education required<input inputMode="numeric" value={minYears} onChange={(e) => setMinYears(e.target.value)} /></label>
              <label>Minimum grade (/110)<input inputMode="decimal" value={min110} onChange={(e) => setMin110(e.target.value)} placeholder="Leave blank if not stated" /></label>
              <label>Minimum CGPA (/4.0)<input inputMode="decimal" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} placeholder="Only if stated on a 4.0 scale" /></label>
              <label>IELTS minimum<input inputMode="decimal" value={ielts} onChange={(e) => setIelts(e.target.value)} /></label>
              <label>TOEFL iBT minimum<input inputMode="numeric" value={toefl} onChange={(e) => setToefl(e.target.value)} /></label>
              <label className="review-check">
                <input type="checkbox" checked={moi} onChange={(e) => setMoi(e.target.checked)} />
                <span>Accepts a medium-of-instruction letter instead of a test</span>
              </label>
              <label className="wide">Extra requirements (comma separated)<input value={extras} onChange={(e) => setExtras(e.target.value)} placeholder="GRE, entrance test, portfolio…" /></label>
            </div>
            <p className="editor-label">Subject-area credits (ECTS / CFU)</p>
            {credits.map((credit, index) => (
              <div className="credit-rule" key={index}>
                <select aria-label="Subject area" value={credit.area} onChange={(e) => setCredits((current) => current.map((item, i) => (i === index ? { ...item, area: e.target.value } : item)))}>
                  {SUBJECT_AREAS.map((area) => <option key={area}>{area}</option>)}
                </select>
                <input aria-label="ECTS required" inputMode="decimal" value={credit.ects} onChange={(e) => setCredits((current) => current.map((item, i) => (i === index ? { ...item, ects: e.target.value } : item)))} />
                <span>ECTS</span>
                <button aria-label="Remove credit rule" onClick={() => setCredits((current) => current.filter((_, i) => i !== index))}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button className="text-button add-course" onClick={() => setCredits((current) => [...current, { area: "Computer science", ects: "" }])}>
              <Plus size={14} /> Add credit requirement
            </button>

            {universityId && (
              <>
                <h3>University conversion</h3>
                <p className="review-muted">Applies to every programme at this university.</p>
                <div className="field-grid">
                  <label>ECTS per Pakistani credit hour<input inputMode="decimal" value={ects} onChange={(e) => setEcts(e.target.value)} /></label>
                  <label>Pass mark as share of scale<input inputMode="decimal" value={passRatio} onChange={(e) => setPassRatio(e.target.value)} /></label>
                </div>
              </>
            )}
            <label className="wide editor-notes">Verifier notes<textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
            {error && <p className="auth-message error" role="alert">{error}</p>}
          </div>
        </div>
        <footer>
          <span className="review-footnote">
            <Sparkles size={15} /> AI-reviewed rules are provisional and stay distinct from human verification.
          </span>
          <div className="review-actions">
            <button className="secondary-button" disabled={Boolean(saving)} onClick={() => void save("in_review")}>
              {saving === "in_review" ? <span className="spinner dark" /> : null} Save draft
            </button>
            <button className="primary-button" disabled={Boolean(saving) || !draft || (draft.confidence ?? 0) < 70 || !evidence.length} onClick={() => void save("ai_reviewed")}>
              {saving === "ai_reviewed" ? <span className="spinner" /> : <Sparkles size={16} />} Publish AI-reviewed
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
