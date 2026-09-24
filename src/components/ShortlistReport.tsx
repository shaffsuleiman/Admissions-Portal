"use client";

import { useEffect } from "react";
import { AlertTriangle, Check, Download, Printer, X } from "lucide-react";
import { toItalian110 } from "@/lib/matching/engine";
import type { MatchResult, Student, TeamMember, Workspace } from "@/lib/supabase/workspace-data";

const outcomeIcon = { pass: Check, borderline: AlertTriangle, fail: X } as const;

// Printable, consultancy-branded shortlist. Only evidence-backed reviewed rules are included.
export function ShortlistReport({
  workspace,
  counsellor,
  student,
  matches,
  onClose,
  onCsv,
}: {
  workspace: Workspace;
  counsellor: TeamMember;
  student: Student;
  matches: MatchResult[];
  onClose: () => void;
  onCsv: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("report-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("report-open");
    };
  }, [onClose]);

  const reviewed = matches.filter((match) => ["ai_reviewed", "verified"].includes(match.programmeReviewStatus));
  const eligible = reviewed.filter((match) => match.status === "Eligible").sort((a, b) => b.score - a.score);
  const borderline = reviewed.filter((match) => match.status === "Borderline").sort((a, b) => b.score - a.score);
  const excluded = matches.length - reviewed.length;
  const academic = student.academic;
  const grade110 = academic.cgpa != null && academic.cgpaScale ? toItalian110(academic.cgpa, academic.cgpaScale) : null;
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const programme = (match: MatchResult, rank: number) => (
    <article className="report-programme" key={match.id}>
      <div className="report-programme-head">
        <span className="report-rank">{rank}</span>
        <div>
          <h3>{match.programme}</h3>
          <p>
            {match.university} · {match.city}
          </p>
        </div>
        <span className={`report-pill ${match.status === "Eligible" ? "good" : "warn"}`}>{match.status}</span>
      </div>
      <dl className="report-facts">
        <div><dt>Rank score</dt><dd>{match.score}/100</dd></div>
        <div><dt>Tuition / year</dt><dd>{match.fee}</dd></div>
        <div><dt>Application deadline</dt><dd>{match.deadline}</dd></div>
        <div><dt>Rules reviewed</dt><dd>{match.programmeVerified ? "Human verified" : "AI reviewed"} · {match.verified}</dd></div>
      </dl>
      <ul className="report-checks">
        {(match.checks.length ? match.checks : match.reasons.map((detail) => ({ outcome: "pass" as const, detail, label: "", key: "extras" as const }))).map((check, index) => {
          const Icon = outcomeIcon[check.outcome];
          return (
            <li key={index} className={check.outcome}>
              <Icon size={12} /> {check.detail}
            </li>
          );
        })}
      </ul>
      {match.source && <p className="report-source">Source: {match.source}</p>}
    </article>
  );

  return (
    <div className="report-overlay" role="dialog" aria-modal="true" aria-label={`Shortlist report for ${student.name}`}>
      <div className="report-toolbar">
        <strong>Shortlist report</strong>
        <span>{reviewed.length} reviewed programme{reviewed.length === 1 ? "" : "s"}</span>
        <button className="secondary-button" onClick={onCsv}>
          <Download size={15} /> CSV
        </button>
        <button className="primary-button" onClick={() => window.print()}>
          <Printer size={15} /> Save as PDF
        </button>
        <button className="icon-button" aria-label="Close report" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="report-page">
        <header className="report-brand">
          <span className="report-logo">{workspace.name.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{workspace.name}</strong>
            <small>{workspace.tagline}</small>
          </div>
          <address>
            {[workspace.businessEmail, workspace.phone, workspace.city].filter(Boolean).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </header>
        <section className="report-intro">
          <p className="eyebrow">PROGRAMME SHORTLIST · {today.toUpperCase()}</p>
          <h1>{student.name}</h1>
          <dl className="report-facts">
            <div><dt>Degree</dt><dd>{academic.degreeTitle || student.degree}</dd></div>
            <div><dt>CGPA</dt><dd>{academic.cgpa != null ? `${academic.cgpa} / ${academic.cgpaScale}${grade110 ? ` (≈ ${grade110}/110)` : ""}` : "Not recorded"}</dd></div>
            <div><dt>English</dt><dd>{academic.englishOverall != null ? `${academic.englishTestType} ${academic.englishOverall}` : academic.mediumOfInstruction ? "Medium of instruction" : "Not recorded"}</dd></div>
            <div><dt>Target</dt><dd>{student.target}</dd></div>
          </dl>
        </section>

        <h2 className="report-heading">Eligible programmes ({eligible.length})</h2>
        {eligible.map((match, index) => programme(match, index + 1))}
        {!eligible.length && <p className="report-empty">No reviewed programme is fully eligible yet.</p>}

        {borderline.length > 0 && (
          <>
            <h2 className="report-heading">Worth a closer look ({borderline.length})</h2>
            <p className="report-note">These programmes are close on at least one requirement. Your counsellor will confirm before applying.</p>
            {borderline.map((match, index) => programme(match, eligible.length + index + 1))}
          </>
        )}

        <footer className="report-footer">
          <p>
            Prepared by {counsellor.name} on {today}. Eligibility is checked against published rules. AI-reviewed entries are provisional and identified above. This shortlist is advisory: final admission decisions rest with each university.
          </p>
          {excluded > 0 && <p>{excluded} programme{excluded === 1 ? "" : "s"} with unverified rules {excluded === 1 ? "is" : "are"} not included.</p>}
        </footer>
      </div>
    </div>
  );
}
