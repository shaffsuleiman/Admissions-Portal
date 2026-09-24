// Deterministic eligibility engine. AI never decides eligibility: it only reads
// documents and drafts rules. Every result here is reproducible from its inputs.

export const SUBJECT_AREAS = [
  "Computer science",
  "Mathematics",
  "Statistics",
  "Physics",
  "Electrical engineering",
  "Mechanical engineering",
  "Civil engineering",
  "Data science",
  "Economics",
  "Business and management",
  "Chemistry",
  "Biology",
  "Social sciences",
  "Humanities",
  "Other",
] as const;

export type SubjectArea = (typeof SUBJECT_AREAS)[number];

export type ProgrammeRules = {
  /** Years of prior education required (16 for a master's after a 4-year BS). */
  minYearsOfEducation?: number | null;
  /** Minimum final grade on the Italian 110 scale. */
  minGrade110?: number | null;
  /** Minimum CGPA expressed on a 4.0 scale (used when no 110 rule is published). */
  minCgpa4?: number | null;
  subjectCredits?: { area: string; ects: number }[];
  english?: {
    ielts?: number | null;
    toefl?: number | null;
    mediumOfInstructionAccepted?: boolean;
  };
  /** Requirements the counsellor must check by hand (GRE, entrance test, portfolio...). */
  extras?: string[];
};

/** Per-university conversion rules; defaults follow the plan's common practice. */
export type Conversion = {
  ectsPerCreditHour: number;
  /** Minimum passing CGPA as a fraction of the scale maximum (2.0 / 4.0 = 0.5). */
  passRatio: number;
};

export const DEFAULT_CONVERSION: Conversion = { ectsPerCreditHour: 1.8, passRatio: 0.5 };

export type StudentFacts = {
  yearsOfEducation: number | null;
  cgpa: number | null;
  cgpaScale: number | null;
  englishTest: { type: "IELTS" | "TOEFL" | string; score: number } | null;
  mediumOfInstruction: boolean;
  /** Confirmed credits per subject area. creditHours are converted per university. */
  credits: { area: string; creditHours: number | null; ects: number | null }[];
};

export type CheckOutcome = "pass" | "borderline" | "fail";

export type Check = {
  key: "degree" | "credits" | "grade" | "english" | "extras" | "deadline";
  label: string;
  outcome: CheckOutcome;
  detail: string;
};

export type Evaluation = {
  result: "eligible" | "borderline" | "not_eligible";
  score: number;
  checks: Check[];
};

/** Within 10% of a threshold counts as borderline, as the plan specifies. */
const BORDERLINE_MARGIN = 0.1;

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Linear conversion of a CGPA to the Italian 110 scale: 66 + (G - Gmin) / (Gmax - Gmin) × 44. */
export function toItalian110(cgpa: number, scale: number, passRatio = DEFAULT_CONVERSION.passRatio) {
  const minimum = scale * passRatio;
  if (scale <= minimum) return 66;
  const value = 66 + ((cgpa - minimum) / (scale - minimum)) * 44;
  return Math.max(66, Math.min(110, round1(value)));
}

export function studentEcts(credit: StudentFacts["credits"][number], conversion: Conversion) {
  if (credit.creditHours != null && credit.creditHours > 0)
    return round1(credit.creditHours * conversion.ectsPerCreditHour);
  return credit.ects ?? 0;
}

function compare(actual: number, required: number): CheckOutcome {
  if (actual >= required) return "pass";
  return actual >= required * (1 - BORDERLINE_MARGIN) ? "borderline" : "fail";
}

/** A matchable programme must contain at least one actual admissions rule. */
export function hasEligibilityRules(rules: ProgrammeRules) {
  return Boolean(
    rules.minYearsOfEducation ||
      rules.minGrade110 ||
      rules.minCgpa4 ||
      rules.subjectCredits?.some((requirement) => requirement.ects > 0) ||
      rules.english?.ielts ||
      rules.english?.toefl ||
      rules.extras?.length,
  );
}

export function evaluate(
  student: StudentFacts,
  rules: ProgrammeRules,
  options: { conversion?: Conversion; deadline?: string | null; today?: Date } = {},
): Evaluation {
  const conversion = options.conversion ?? DEFAULT_CONVERSION;
  const today = options.today ?? new Date();
  const checks: Check[] = [];

  // Never silently return 100% when a catalogue record has no admissions rules.
  if (!hasEligibilityRules(rules))
    checks.push({
      key: "extras",
      label: "Eligibility rules",
      outcome: "borderline",
      detail: "Eligibility rules have not been recorded; manual verification is required",
    });

  // 1. Degree level and duration
  const minYears = rules.minYearsOfEducation ?? null;
  if (minYears) {
    if (student.yearsOfEducation == null)
      checks.push({ key: "degree", label: "Degree duration", outcome: "borderline", detail: `Years of education not recorded (needs ${minYears})` });
    else
      checks.push({
        key: "degree",
        label: "Degree duration",
        outcome: student.yearsOfEducation >= minYears ? "pass" : "fail",
        detail: `${student.yearsOfEducation} years of education, needs ${minYears}`,
      });
  }

  // 2. Subject-area credits, converted with this university's ratio
  for (const requirement of rules.subjectCredits ?? []) {
    if (!requirement.ects) continue;
    const actual = round1(
      student.credits
        .filter((credit) => credit.area.toLowerCase() === requirement.area.toLowerCase())
        .reduce((sum, credit) => sum + studentEcts(credit, conversion), 0),
    );
    const outcome = compare(actual, requirement.ects);
    const shortBy = round1(requirement.ects - actual);
    checks.push({
      key: "credits",
      label: `${requirement.area} credits`,
      outcome,
      detail:
        outcome === "pass"
          ? `${requirement.area}: ${actual} / ${requirement.ects} ECTS`
          : `Short by ${shortBy} ECTS in ${requirement.area.toLowerCase()} (${actual} / ${requirement.ects})`,
    });
  }

  // 3. Grade minimum on the programme's scale
  if (rules.minGrade110 || rules.minCgpa4) {
    if (student.cgpa == null || !student.cgpaScale)
      checks.push({ key: "grade", label: "Grade", outcome: "borderline", detail: "CGPA not recorded" });
    else if (rules.minGrade110) {
      const grade = toItalian110(student.cgpa, student.cgpaScale, conversion.passRatio);
      checks.push({
        key: "grade",
        label: "Grade",
        outcome: compare(grade, rules.minGrade110),
        detail: `CGPA ${student.cgpa} / ${student.cgpaScale} converts to ${grade} / 110, needs ${rules.minGrade110}`,
      });
    } else if (rules.minCgpa4) {
      const cgpa4 = Math.round((student.cgpa / student.cgpaScale) * 4 * 100) / 100;
      checks.push({
        key: "grade",
        label: "Grade",
        outcome: compare(cgpa4, rules.minCgpa4),
        detail: `CGPA ${cgpa4.toFixed(2)} / 4.00, needs ${rules.minCgpa4.toFixed(2)}`,
      });
    }
  }

  // 4. English requirement (test score, or medium of instruction where accepted)
  const english = rules.english;
  if (english && (english.ielts || english.toefl)) {
    const moi = english.mediumOfInstructionAccepted && student.mediumOfInstruction;
    const test = student.englishTest;
    const required = test?.type === "TOEFL" ? english.toefl : english.ielts;
    if (moi)
      checks.push({ key: "english", label: "English", outcome: "pass", detail: "Medium-of-instruction letter accepted" });
    else if (!test || !required)
      checks.push({
        key: "english",
        label: "English",
        outcome: "borderline",
        detail: english.ielts ? `No accepted English result recorded (needs IELTS ${english.ielts})` : `No accepted English result recorded (needs TOEFL ${english.toefl})`,
      });
    else
      checks.push({
        key: "english",
        label: "English",
        // IELTS is borderline within half a band; other tests use the usual 10% margin.
        outcome:
          test.type === "IELTS"
            ? test.score >= required ? "pass" : test.score >= required - 0.5 ? "borderline" : "fail"
            : compare(test.score, required),
        detail: `${test.type} ${test.score}, needs ${required}`,
      });
  }

  // 5. Extras the counsellor must confirm manually
  if (rules.extras?.length)
    checks.push({ key: "extras", label: "Extra requirements", outcome: "borderline", detail: `Check manually: ${rules.extras.join(", ")}` });

  // 6. Deadline still open
  if (options.deadline) {
    const due = new Date(`${options.deadline.slice(0, 10)}T23:59:59`);
    const days = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
    checks.push({
      key: "deadline",
      label: "Deadline",
      outcome: days < 0 ? "fail" : days <= 14 ? "borderline" : "pass",
      detail: days < 0 ? `Deadline passed on ${options.deadline.slice(0, 10)}` : `${days} day${days === 1 ? "" : "s"} left to apply`,
    });
  }

  const fails = checks.filter((check) => check.outcome === "fail").length;
  const borderlines = checks.filter((check) => check.outcome === "borderline").length;
  const result = fails ? "not_eligible" : borderlines ? "borderline" : "eligible";
  const score = Math.max(0, Math.min(100, 100 - fails * 30 - borderlines * 8));
  return { result, score, checks };
}

/** Accepts the current rules shape and the legacy starter keys (minimum_cgpa, math_ects...). */
export function normalizeRules(raw: unknown): ProgrammeRules {
  const value = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const num = (input: unknown) => (typeof input === "number" && Number.isFinite(input) ? input : input != null && input !== "" && !Number.isNaN(Number(input)) ? Number(input) : null);
  const english = (value.english && typeof value.english === "object" ? value.english : {}) as Record<string, unknown>;
  const subjectCredits = Array.isArray(value.subject_credits)
    ? value.subject_credits
        .map((item) => item as Record<string, unknown>)
        .map((item) => ({ area: String(item.area ?? ""), ects: num(item.ects) ?? 0 }))
        .filter((item) => item.area && item.ects > 0)
    : [];
  if (num(value.math_ects)) subjectCredits.push({ area: "Mathematics", ects: num(value.math_ects)! });
  if (num(value.cs_ects)) subjectCredits.push({ area: "Computer science", ects: num(value.cs_ects)! });
  return {
    minYearsOfEducation: num(value.min_years_of_education),
    minGrade110: num(value.min_grade_110),
    minCgpa4: num(value.min_cgpa_4) ?? num(value.minimum_cgpa),
    subjectCredits,
    english: {
      ielts: num(english.ielts) ?? num(value.english_ielts),
      toefl: num(english.toefl),
      mediumOfInstructionAccepted: Boolean(english.moi_accepted),
    },
    extras: Array.isArray(value.extras) ? value.extras.map(String).filter(Boolean) : [],
  };
}

/** Serialises rules for storage in programmes.requirements. */
export function serializeRules(rules: ProgrammeRules) {
  return {
    min_years_of_education: rules.minYearsOfEducation ?? null,
    min_grade_110: rules.minGrade110 ?? null,
    min_cgpa_4: rules.minCgpa4 ?? null,
    subject_credits: (rules.subjectCredits ?? []).filter((item) => item.area && item.ects > 0),
    english: {
      ielts: rules.english?.ielts ?? null,
      toefl: rules.english?.toefl ?? null,
      moi_accepted: Boolean(rules.english?.mediumOfInstructionAccepted),
    },
    extras: rules.extras ?? [],
  };
}
