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
  /** Bachelor's fields the programme accepts, e.g. "Computer science", "Any field of Engineering". */
  acceptedFields?: string[];
};

/** Per-university conversion rules; defaults follow the plan's common practice. */
export type Conversion = {
  ectsPerCreditHour: number;
  /** Minimum passing CGPA as a fraction of the scale maximum (2.0 / 4.0 = 0.5). */
  passRatio: number;
};

export const DEFAULT_CONVERSION: Conversion = { ectsPerCreditHour: 1.8, passRatio: 0.5 };

export type StudentFacts = {
  /** e.g. "BS Computer Science"; compared against a programme's accepted fields. */
  degreeTitle?: string | null;
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
  key: "degree" | "credits" | "grade" | "english" | "extras" | "deadline" | "budget" | "intake";
  label: string;
  outcome: CheckOutcome;
  detail: string;
  /** Preferences affect ranking but never rule-based eligibility. */
  category?: "eligibility" | "preference";
  /** Explainable 0-100 contribution to the ranking score. */
  score?: number;
};

export type Evaluation = {
  result: "eligible" | "borderline" | "not_eligible";
  score: number;
  eligibilityScore: number;
  fitScore: number | null;
  checks: Check[];
};

/** Within 10% of a threshold counts as borderline, as the plan specifies. */
const BORDERLINE_MARGIN = 0.1;

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Linear conversion of a CGPA to the Italian 110 scale: 66 + (G - Gmin) / (Gmax - Gmin) × 44. */
export function toItalian110(cgpa: number, scale: number, passRatio = DEFAULT_CONVERSION.passRatio) {
  const minimum = scale * passRatio;
  if (scale <= 0 || passRatio < 0 || passRatio >= 1 || scale <= minimum) return 0;
  const value = 66 + ((cgpa - minimum) / (scale - minimum)) * 44;
  return Math.max(0, Math.min(110, round1(value)));
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

function thresholdScore(actual: number, required: number) {
  if (required <= 0) return 100;
  const ratio = actual / required;
  if (ratio < 1) return Math.max(0, Math.round(ratio * 85));
  // Meeting a threshold is 85; a 20% margin earns the full 100.
  return Math.min(100, Math.round(85 + ((ratio - 1) / 0.2) * 15));
}

function weightedAverage(checks: Check[]) {
  const weights: Record<Check["key"], number> = {
    degree: 20,
    credits: 30,
    grade: 25,
    english: 20,
    extras: 5,
    deadline: 10,
    budget: 65,
    intake: 35,
  };
  const grouped = new Map<Check["key"], number[]>();
  for (const check of checks) {
    const values = grouped.get(check.key) ?? [];
    values.push(check.score ?? (check.outcome === "pass" ? 85 : check.outcome === "borderline" ? 60 : 20));
    grouped.set(check.key, values);
  }
  let total = 0;
  let weight = 0;
  for (const [key, values] of grouped) {
    const keyWeight = weights[key];
    total += (values.reduce((sum, value) => sum + value, 0) / values.length) * keyWeight;
    weight += keyWeight;
  }
  return weight ? Math.round(total / weight) : 0;
}

function explicitYear(value: string | null | undefined) {
  return value?.match(/\b20\d{2}\b/)?.[0] ?? null;
}

function intakeSeason(value: string) {
  const normalized = value.toLowerCase();
  if (/fall|autumn|sep|oct/.test(normalized)) return "fall";
  if (/spring|jan|feb|mar/.test(normalized)) return "spring";
  return null;
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
      rules.extras?.length ||
      rules.acceptedFields?.length,
  );
}

const FIELD_STOPWORDS = new Set(["and", "or", "of", "the", "in", "field", "fields", "similar", "degree", "degrees", "bachelor", "bachelors", "science", "sciences", "studies"]);
// Includes common Pakistani degree abbreviations (BSCS, BSSE, BBA, B.Com...).
const FIELD_SYNONYMS: Record<string, string[]> = {
  mathematics: ["mathematics", "math", "maths"],
  computer: ["computer", "computing", "software", "information technology", "bscs", "bsse", "bsit", "bs cs", "bs it"],
  information: ["information", "bsit", "bs it"],
  technology: ["technology", "bsit", "bs it"],
  ict: ["ict", "information", "communication", "telecommunication"],
  economics: ["economics", "economic"],
  management: ["management", "business", "bba", "mba"],
  business: ["business", "bba", "mba", "commerce", "b.com", "bcom"],
  accounting: ["accounting", "accountancy", "commerce", "b.com", "bcom"],
  finance: ["finance", "financial", "banking"],
};
const ENGINEERING_DEGREE = /engineer|\bb\.?e\b|\bbsc eng/;

/** True when a degree title plausibly belongs to one of the programme's accepted fields. */
export function degreeMatchesField(degreeTitle: string, field: string) {
  const degree = degreeTitle.toLowerCase();
  const wanted = field.toLowerCase().replace(/[*()]/g, " ");
  if (/\bany (field of )?engineering\b/.test(wanted)) return ENGINEERING_DEGREE.test(degree);
  const tokens = wanted.split(/[^a-z]+/).filter((token) => token.length > 2 && !FIELD_STOPWORDS.has(token));
  if (!tokens.length) return false;
  return tokens.every((token) => (FIELD_SYNONYMS[token] ?? [token]).some((variant) => degree.includes(variant)));
}

export function evaluate(
  student: StudentFacts,
  rules: ProgrammeRules,
  options: {
    conversion?: Conversion;
    deadline?: string | null;
    today?: Date;
    requireDeadline?: boolean;
    annualTuitionEur?: number | null;
    annualBudgetEur?: number | null;
    programmeIntake?: string | null;
    targetIntake?: string | null;
    dataConfidence?: number | null;
  } = {},
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
      score: 0,
    });

  // 0. Field of the previous degree. A degree outside the accepted backgrounds is not
  // eligible; only a missing degree title stays uncertain.
  if (rules.acceptedFields?.length) {
    const degree = student.degreeTitle?.trim();
    const fits = degree ? rules.acceptedFields.some((field) => degreeMatchesField(degree, field)) : false;
    checks.push({
      key: "degree",
      label: "Degree field",
      outcome: fits ? "pass" : degree ? "fail" : "borderline",
      detail: !degree
        ? `Degree title not recorded (accepted backgrounds: ${rules.acceptedFields.join(", ")})`
        : fits
          ? `${degree} fits the accepted backgrounds`
          : `${degree} is not an accepted background (needs ${rules.acceptedFields.join(", ")})`,
      score: fits ? 95 : degree ? 0 : 40,
    });
  }

  // 1. Degree level and duration
  const minYears = rules.minYearsOfEducation ?? null;
  if (minYears) {
    if (student.yearsOfEducation == null)
      checks.push({ key: "degree", label: "Degree duration", outcome: "borderline", detail: `Years of education not recorded (needs ${minYears})`, score: 45 });
    else
      checks.push({
        key: "degree",
        label: "Degree duration",
        outcome: student.yearsOfEducation >= minYears ? "pass" : "fail",
        detail: `${student.yearsOfEducation} years of education, needs ${minYears}`,
        score: thresholdScore(student.yearsOfEducation, minYears),
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
      score: thresholdScore(actual, requirement.ects),
    });
  }

  // 3. Grade minimum on the programme's scale
  if (rules.minGrade110 || rules.minCgpa4) {
    if (student.cgpa == null || !student.cgpaScale)
      checks.push({ key: "grade", label: "Grade", outcome: "borderline", detail: "CGPA not recorded", score: 45 });
    else if (student.cgpa < 0 || student.cgpa > student.cgpaScale)
      checks.push({ key: "grade", label: "Grade", outcome: "borderline", detail: `CGPA ${student.cgpa} is invalid for a ${student.cgpaScale} scale`, score: 0 });
    else if (rules.minGrade110) {
      const grade = toItalian110(student.cgpa, student.cgpaScale, conversion.passRatio);
      checks.push({
        key: "grade",
        label: "Grade",
        outcome: compare(grade, rules.minGrade110),
        detail: `CGPA ${student.cgpa} / ${student.cgpaScale} converts to ${grade} / 110, needs ${rules.minGrade110}`,
        score: thresholdScore(grade, rules.minGrade110),
      });
    } else if (rules.minCgpa4) {
      const cgpa4 = Math.round((student.cgpa / student.cgpaScale) * 4 * 100) / 100;
      checks.push({
        key: "grade",
        label: "Grade",
        outcome: compare(cgpa4, rules.minCgpa4),
        detail: `CGPA ${cgpa4.toFixed(2)} / 4.00, needs ${rules.minCgpa4.toFixed(2)}`,
        score: thresholdScore(cgpa4, rules.minCgpa4),
      });
    }
  }

  // 4. English requirement (test score, or medium of instruction where accepted)
  const english = rules.english;
  if (english && (english.ielts || english.toefl)) {
    const moi = english.mediumOfInstructionAccepted && student.mediumOfInstruction;
    const test = student.englishTest;
    const testType = test?.type.trim().toUpperCase() ?? "";
    const isIelts = testType.startsWith("IELTS");
    const isToefl = testType.startsWith("TOEFL");
    const required = isToefl ? english.toefl : isIelts ? english.ielts : null;
    if (moi)
      checks.push({ key: "english", label: "English", outcome: "pass", detail: "Medium-of-instruction letter accepted", score: 90 });
    else if (!test)
      checks.push({
        key: "english",
        label: "English",
        outcome: "borderline",
        detail: english.ielts ? `No accepted English result recorded (needs IELTS ${english.ielts})` : `No accepted English result recorded (needs TOEFL ${english.toefl})`,
        score: 40,
      });
    else if (!required)
      checks.push({
        key: "english",
        label: "English",
        outcome: "borderline",
        detail: `${test.type} is recorded, but this programme only states ${[english.ielts && `IELTS ${english.ielts}`, english.toefl && `TOEFL ${english.toefl}`].filter(Boolean).join(" or ")}`,
        score: 50,
      });
    else
      checks.push({
        key: "english",
        label: "English",
        // IELTS is borderline within half a band; other tests use the usual 10% margin.
        outcome:
          isIelts
            ? test.score >= required ? "pass" : test.score >= required - 0.5 ? "borderline" : "fail"
            : compare(test.score, required),
        detail: `${test.type} ${test.score}, needs ${required}`,
        score: thresholdScore(test.score, required),
      });
  }

  // 5. Extras the counsellor must confirm manually
  if (rules.extras?.length)
    checks.push({ key: "extras", label: "Extra requirements", outcome: "borderline", detail: `Additional requirement needs confirmation: ${rules.extras.join(", ")}`, score: 55 });

  // Italian calls for the next intake publish Nov–Feb, so the catalogue often holds the
  // previous cycle's rules. Those are a useful guide, but their deadline says nothing
  // about the student's target intake and must not reject them.
  const targetYear = explicitYear(options.targetIntake);
  const programmeYear = explicitYear(options.programmeIntake);
  const previousCycle = Boolean(targetYear && programmeYear && Number(programmeYear) < Number(targetYear));

  // 6. Deadline still open
  if (options.deadline && previousCycle) {
    checks.push({
      key: "deadline",
      label: "Deadline",
      outcome: "borderline",
      detail: `The ${options.targetIntake} deadline isn’t published yet (last cycle closed ${options.deadline.slice(0, 10)}); rules are from the ${options.programmeIntake} call`,
      score: 50,
    });
  } else if (options.deadline) {
    const due = new Date(`${options.deadline.slice(0, 10)}T23:59:59Z`);
    const days = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
    checks.push({
      key: "deadline",
      label: "Deadline",
      outcome: days < 0 ? "fail" : days <= 14 ? "borderline" : "pass",
      detail: days < 0 ? `Deadline passed on ${options.deadline.slice(0, 10)}` : `${days} day${days === 1 ? "" : "s"} left to apply`,
      score: days < 0 ? 0 : days <= 14 ? 55 : Math.min(100, 80 + Math.round(days / 12)),
    });
  } else if (options.requireDeadline) {
    checks.push({ key: "deadline", label: "Deadline", outcome: "borderline", detail: "Application deadline is not recorded", score: 35 });
  }

  // Preferences improve ordering, but can never turn an academically eligible programme into a rejection.
  if (options.annualBudgetEur && options.annualTuitionEur != null) {
    const ratio = options.annualTuitionEur / options.annualBudgetEur;
    checks.push({
      key: "budget",
      label: "Budget fit",
      category: "preference",
      outcome: ratio <= 1 ? "pass" : ratio <= 1.1 ? "borderline" : "fail",
      detail: ratio <= 1
        ? `Tuition €${options.annualTuitionEur.toLocaleString()} is within the €${options.annualBudgetEur.toLocaleString()} budget`
        : `Tuition is €${Math.round(options.annualTuitionEur - options.annualBudgetEur).toLocaleString()} above the annual budget`,
      score: ratio <= 1 ? Math.min(100, Math.round(85 + (1 - ratio) * 30)) : Math.max(0, Math.round(85 - (ratio - 1) * 100)),
    });
  }

  if (previousCycle) {
    checks.push({
      key: "intake",
      label: "Intake fit",
      category: "preference",
      outcome: "borderline",
      detail: `Rules are from the ${options.programmeIntake} cycle; confirm the ${options.targetIntake} call once it is published`,
      score: 60,
    });
  } else if (targetYear && programmeYear) {
    const targetSeason = intakeSeason(options.targetIntake ?? "");
    const programmeSeason = intakeSeason(options.programmeIntake ?? "");
    const same = targetYear === programmeYear && (!targetSeason || !programmeSeason || targetSeason === programmeSeason);
    checks.push({
      key: "intake",
      label: "Intake fit",
      category: "preference",
      outcome: same ? "pass" : "fail",
      detail: same ? `Matches target intake ${options.targetIntake}` : `Programme intake ${options.programmeIntake} does not match target ${options.targetIntake}`,
      score: same ? 100 : 0,
    });
  }

  const eligibilityChecks = checks.filter((check) => check.category !== "preference");
  const preferenceChecks = checks.filter((check) => check.category === "preference");
  const fails = eligibilityChecks.filter((check) => check.outcome === "fail").length;
  const borderlines = eligibilityChecks.filter((check) => check.outcome === "borderline").length;
  const result = fails ? "not_eligible" : borderlines ? "borderline" : "eligible";
  const eligibilityScore = weightedAverage(eligibilityChecks);
  const fitScore = preferenceChecks.length ? weightedAverage(preferenceChecks) : null;
  const confidence = options.dataConfidence == null ? null : Math.max(0, Math.min(100, options.dataConfidence));
  const components = [{ value: eligibilityScore, weight: fitScore == null && confidence == null ? 1 : 0.75 }];
  if (fitScore != null) components.push({ value: fitScore, weight: 0.15 });
  if (confidence != null) components.push({ value: confidence, weight: 0.1 });
  const componentWeight = components.reduce((sum, item) => sum + item.weight, 0);
  const rawScore = components.reduce((sum, item) => sum + item.value * item.weight, 0) / componentWeight;
  // Preserve a strict ordering between the three rule outcomes. A failed programme
  // must never outrank an eligible one merely because it has strong preference fit.
  const score = result === "eligible"
    ? Math.max(70, Math.round(rawScore))
    : result === "borderline"
      ? Math.max(40, Math.min(69, Math.round(rawScore)))
      : Math.min(39, Math.round(rawScore));
  return { result, score, eligibilityScore, fitScore, checks };
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
    acceptedFields: Array.isArray(value.accepted_fields) ? value.accepted_fields.map(String).filter(Boolean) : [],
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
    accepted_fields: rules.acceptedFields ?? [],
  };
}
