import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluate, normalizeRules, serializeRules, toItalian110, type StudentFacts } from "./engine.ts";

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
  assert.equal(toItalian110(1.5, 4), 66);
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
  assert.equal(evaluate(student(), {}, { today, deadline: "2026-09-01" }).result, "not_eligible");
  assert.equal(evaluate(student(), {}, { today, deadline: "2026-09-30" }).result, "borderline");
  assert.equal(evaluate(student(), {}, { today, deadline: "2027-01-11" }).result, "eligible");
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
