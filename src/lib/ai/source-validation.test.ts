import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canonicalResearchSource,
  isPermittedResearchSource,
  validateResearchEvidence,
} from "./source-validation.ts";

test("canonical source comparison ignores tracking queries and fragments", () => {
  assert.equal(
    canonicalResearchSource("https://www.unibo.it/programmes/data/?utm_source=test#rules"),
    "www.unibo.it/programmes/data",
  );
});

test("research sources must be secure and cannot be known aggregators", () => {
  assert.equal(isPermittedResearchSource("https://www.unibo.it/programmes/data"), true);
  assert.equal(isPermittedResearchSource("http://www.unibo.it/programmes/data"), false);
  assert.equal(isPermittedResearchSource("https://www.mastersportal.com/course/1"), false);
});

test("evidence must cite a returned source and cover every populated rule", () => {
  const valid = validateResearchEvidence({
    evidence: [
      {
        field: "accepted_fields",
        quote: "A bachelor's degree in computer science is required.",
        url: "https://www.unibo.it/programmes/data?lang=en",
      },
      {
        field: "english",
        quote: "English language proficiency at B2 level.",
        url: "https://www.unibo.it/programmes/data#language",
      },
    ],
    requiredFields: ["accepted_fields", "english"],
    returnedSourceUrls: ["https://www.unibo.it/programmes/data"],
  });
  assert.equal(valid.complete, true);

  const fabricated = validateResearchEvidence({
    evidence: [
      {
        field: "english",
        quote: "IELTS 6.5",
        url: "https://example.com/invented-rule",
      },
    ],
    requiredFields: ["english"],
    returnedSourceUrls: ["https://www.unibo.it/programmes/data"],
  });
  assert.equal(fabricated.complete, false);
  assert.deepEqual(fabricated.evidence, []);
});
