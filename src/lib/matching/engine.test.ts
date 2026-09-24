import assert from "node:assert/strict";
import { test } from "node:test";
import { degreeMatchesField, evaluate, normalizeRules, serializeRules, toItalian110, type StudentFacts } from "./engine.ts";

const student = (overrides: Partial<StudentFacts> = {}): StudentFacts => ({
  yearsOfEducation: 16,
  cgpa: 3.2,
  cgpaScale: 4,
  englishTest: { type: "IELTS", score: 7 },
  mediumOfInstruction: false,
  credits: [
    { area: "Computer science", creditHours: 30, ects: null },
    { area: "Mathematics", creditHours: 10, ects: null },
  ],
  ...overrides,
});

const today = new Date("2026-09-23T12:00:00");

test("converts CGPA to the Italian 110 scale (plan example: 3.2 / 4.0 → 92.4)", () => {
  assert.equal(toItalian110(3.2, 4), 92.4);
  assert.equal(toItalian110(4, 4), 110);
  assert.equal(toItalian110(1.5, 4), 55);
});

test("credit hours convert per university and report the exact shortfall", () => {
  const rules = { subjectCredits: [{ area: "Mathematics", ects: 24 }] };
  const standard = evaluate(student(), rules, { today });
  assert.equal(standard.checks[0].detail, "Short by 6 ECTS in mathematics (18 / 24)");
  assert.equal(standard.result, "not_eligible");
  const generous = evaluate(student(), rules, { today, conversion: { ectsPerCreditHour: 2.4, passRatio: 0.5 } });
  assert.equal(generous.result, "eligible");
});

test("within 10% of a threshold is borderline, not a rejection", () => {
  const result = evaluate(student(), { subjectCredits: [{ area: "Mathematics", ects: 19 }] }, { today });
  assert.equal(result.checks[0].outcome, "borderline");
  assert.equal(result.result, "borderline");
});

test("grade, degree length and English checks", () => {
  const result = evaluate(student(), { minGrade110: 90, minYearsOfEducation: 16, english: { ielts: 6.5 } }, { today });
  assert.deepEqual(result.checks.map((check) => check.outcome), ["pass", "pass", "pass"]);
  const shortDegree = evaluate(student({ yearsOfEducation: 14 }), { minYearsOfEducation: 16 }, { today });
  assert.equal(shortDegree.result, "not_eligible");
});

test("medium-of-instruction letter satisfies English only where accepted", () => {
  const noTest = student({ englishTest: null, mediumOfInstruction: true });
  assert.equal(evaluate(noTest, { english: { ielts: 6.5, mediumOfInstructionAccepted: true } }, { today }).result, "eligible");
  assert.equal(evaluate(noTest, { english: { ielts: 6.5 } }, { today }).result, "borderline");
});

test("closed deadlines fail and near deadlines are flagged", () => {
  const rules = { minYearsOfEducation: 16 };
  assert.equal(evaluate(student(), rules, { today, deadline: "2026-09-01" }).result, "not_eligible");
  assert.equal(evaluate(student(), rules, { today, deadline: "2026-09-30" }).result, "borderline");
  assert.equal(evaluate(student(), rules, { today, deadline: "2027-01-11" }).result, "eligible");
});

test("a programme with no admissions rules is never silently eligible", () => {
  const result = evaluate(student(), {}, { today });
  assert.equal(result.result, "borderline");
  assert.equal(result.score, 40);
  assert.match(result.checks[0].detail, /manual verification/i);
});

test("unsupported English tests are never compared against the IELTS scale", () => {
  const result = evaluate(
    student({ englishTest: { type: "PTE", score: 70 } }),
    { english: { ielts: 6.5, toefl: 90 } },
    { today },
  );
  assert.equal(result.result, "borderline");
  assert.match(result.checks[0].detail, /only states IELTS 6.5 or TOEFL 90/);
});

test("ranking rewards margin above requirements", () => {
  const rules = { minGrade110: 90, subjectCredits: [{ area: "Mathematics", ects: 18 }] };
  const justMeets = evaluate(student({ cgpa: 3.1 }), rules, { today });
  const stronger = evaluate(student({ cgpa: 3.8, credits: [{ area: "Mathematics", creditHours: 15, ects: null }] }), rules, { today });
  assert.equal(justMeets.result, "eligible");
  assert.equal(stronger.result, "eligible");
  assert.ok(stronger.score > justMeets.score);
});

test("budget and intake rank fit without changing academic eligibility", () => {
  const rules = { minYearsOfEducation: 16 };
  const goodFit = evaluate(student(), rules, {
    today,
    annualTuitionEur: 3_000,
    annualBudgetEur: 8_000,
    programmeIntake: "Fall 2027",
    targetIntake: "September 2027",
  });
  const poorFit = evaluate(student(), rules, {
    today,
    annualTuitionEur: 12_000,
    annualBudgetEur: 8_000,
    programmeIntake: "Spring 2028",
    targetIntake: "September 2027",
  });
  assert.equal(poorFit.result, "eligible");
  assert.ok(goodFit.score > poorFit.score);
  assert.equal(poorFit.checks.find((check) => check.key === "budget")?.category, "preference");
});

test("production matching treats an unknown deadline as uncertain", () => {
  const result = evaluate(student(), { minYearsOfEducation: 16 }, { today, requireDeadline: true });
  assert.equal(result.result, "borderline");
  assert.match(result.checks.find((check) => check.key === "deadline")?.detail ?? "", /not recorded/);
});

test("invalid CGPA values cannot produce an eligible result", () => {
  const result = evaluate(student({ cgpa: 4.5, cgpaScale: 4 }), { minGrade110: 90 }, { today });
  assert.equal(result.result, "borderline");
  assert.match(result.checks[0].detail, /invalid/);
});

test("eligible results always rank above borderline and failed results", () => {
  const eligible = evaluate(student(), { minYearsOfEducation: 16 }, { today });
  const borderline = evaluate(student({ yearsOfEducation: null }), { minYearsOfEducation: 16 }, { today });
  const failed = evaluate(student({ yearsOfEducation: 12 }), { minYearsOfEducation: 16 }, { today });
  assert.ok(eligible.score >= 70);
  assert.ok(borderline.score >= 40 && borderline.score < 70);
  assert.ok(failed.score < 40);
});

test("missing data is borderline so a counsellor looks, never silently eligible", () => {
  const result = evaluate(student({ cgpa: null, yearsOfEducation: null }), { minGrade110: 90, minYearsOfEducation: 16 }, { today });
  assert.equal(result.result, "borderline");
});

test("extras are always surfaced for manual checking", () => {
  const result = evaluate(student(), { extras: ["GRE"] }, { today });
  assert.equal(result.result, "borderline");
  assert.match(result.checks[0].detail, /GRE/);
});

test("legacy starter rules and the current shape round-trip", () => {
  const legacy = normalizeRules({ minimum_cgpa: 3, math_ects: 18, cs_ects: 30, english_ielts: 6.5 });
  assert.equal(legacy.minCgpa4, 3);
  assert.deepEqual(legacy.subjectCredits, [
    { area: "Mathematics", ects: 18 },
    { area: "Computer science", ects: 30 },
  ]);
  assert.deepEqual(normalizeRules(serializeRules(legacy)), legacy);
});

test("last cycle's rules guide matching without rejecting on last cycle's deadline", () => {
  const rules = { minYearsOfEducation: 16, english: { ielts: 5.5 } };
  const result = evaluate(student(), rules, {
    today,
    deadline: "2026-04-09",
    requireDeadline: true,
    programmeIntake: "Fall 2026",
    targetIntake: "Fall 2027",
  });
  assert.equal(result.result, "borderline");
  assert.match(result.checks.find((check) => check.key === "deadline")?.detail ?? "", /Fall 2027 deadline isn’t published yet/);
  assert.equal(result.checks.find((check) => check.key === "intake")?.outcome, "borderline");
});

test("a passed deadline in the student's own cycle still fails", () => {
  const result = evaluate(student(), { minYearsOfEducation: 16 }, {
    today,
    deadline: "2026-04-09",
    programmeIntake: "Fall 2026",
    targetIntake: "Fall 2026",
  });
  assert.equal(result.result, "not_eligible");
});

test("degree field: matching backgrounds pass, others are ranked low but not rejected", () => {
  const rules = { acceptedFields: ["Any field of Engineering", "Computer science"] };
  const cs = evaluate(student({ degreeTitle: "BS Computer Science" }), rules, { today });
  const se = evaluate(student({ degreeTitle: "BS Software Engineering" }), rules, { today });
  const arch = evaluate(student({ degreeTitle: "Bachelor of Architecture" }), rules, { today });
  assert.equal(cs.checks[0].outcome, "pass");
  assert.equal(se.checks[0].outcome, "pass");
  assert.equal(arch.checks[0].outcome, "borderline");
  assert.ok(cs.score > arch.score);
  assert.equal(degreeMatchesField("BSc Mathematics", "Mathematics"), true);
  assert.equal(degreeMatchesField("BS Electrical Engineering", "Mechanical engineering"), false);
});
