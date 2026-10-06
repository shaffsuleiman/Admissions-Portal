import assert from "node:assert/strict";
import test from "node:test";
import { latestProgrammeEditions } from "./catalogue.ts";

const row = (id: string, programme_name: string, academic_year: string, extra = {}) => ({
  id,
  university_id: "padua",
  programme_name,
  degree_level: "Master",
  academic_year,
  verification_status: "ai_reviewed",
  ...extra,
});

test("keeps the newest edition when a course appears for two cycles under different names", () => {
  const result = latestProgrammeEditions([row("old", "Data Science", "2026/27"), row("new", "MSc Data Science", "2027/28")]);
  assert.deepEqual(result.map((programme) => programme.id), ["new"]);
});

test("prefers verified rules within the same academic year", () => {
  const result = latestProgrammeEditions([
    row("ai", "Physics", "2027/28"),
    row("verified", "Physics", "2027/28", { verification_status: "verified" }),
  ]);
  assert.deepEqual(result.map((programme) => programme.id), ["verified"]);
});

test("keeps different courses, levels and universities apart", () => {
  const result = latestProgrammeEditions([
    row("a", "Data Science", "2027/28"),
    row("b", "Data Science", "2027/28", { degree_level: "Bachelor" }),
    row("c", "Data Science", "2027/28", { university_id: "pisa" }),
    row("d", "Computer Science", "2027/28"),
  ]);
  assert.equal(result.length, 4);
});
