import { SUBJECT_AREAS } from "@/lib/matching/engine";

// JSON schemas for Gemini structured output, and the matching TypeScript shapes.

export type TranscriptExtraction = {
  document_kind?: "transcript" | "degree" | "english_test" | "other";
  student_name?: string;
  institution?: string;
  degree_title?: string;
  degree_years?: number;
  graduation_year?: number;
  cgpa?: number;
  cgpa_scale?: number;
  total_credit_hours?: number;
  english_test_type?: string;
  english_overall?: number;
  medium_of_instruction_english?: boolean;
  courses?: { title: string; credit_hours?: number; grade?: string; subject_area: string }[];
  confidence?: number;
  notes?: string;
};

export const transcriptSchema = {
  type: "object",
  properties: {
    document_kind: { type: "string", enum: ["transcript", "degree", "english_test", "other"] },
    student_name: { type: "string" },
    institution: { type: "string", description: "Awarding university or college" },
    degree_title: { type: "string", description: "e.g. BS Computer Science" },
    degree_years: { type: "integer", description: "Length of the degree programme in years, e.g. 4" },
    graduation_year: { type: "integer" },
    cgpa: { type: "number", description: "Final cumulative GPA exactly as printed" },
    cgpa_scale: { type: "number", description: "Maximum of the CGPA scale, e.g. 4 or 5" },
    total_credit_hours: { type: "number" },
    english_test_type: { type: "string", enum: ["IELTS", "TOEFL", "PTE", "Duolingo", "None"] },
    english_overall: { type: "number", description: "Overall band or score of the English test" },
    medium_of_instruction_english: { type: "boolean", description: "True only if the document states instruction was in English" },
    courses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          credit_hours: { type: "number" },
          grade: { type: "string" },
          subject_area: { type: "string", enum: [...SUBJECT_AREAS] },
        },
        required: ["title", "subject_area"],
      },
    },
    confidence: { type: "integer", description: "0-100: how legible and complete the document was" },
    notes: { type: "string", description: "Anything unclear that a counsellor should double-check" },
  },
  required: ["document_kind", "confidence"],
};

export const transcriptSystem = `You read academic documents for an admissions counsellor in Pakistan.
Extract only what is printed. Never guess or invent values: omit any field you cannot read.
For transcripts, list every course with its credit hours and grade, and assign each course to the
closest subject area from the allowed list (programming, algorithms, databases → Computer science;
calculus, linear algebra, discrete maths → Mathematics; probability, statistics → Statistics).
Record anything ambiguous in notes. A counsellor reviews everything before it is used.`;

export type ProgrammeDraft = {
  university_name?: string;
  programme_name?: string;
  city?: string;
  degree_level?: "bachelor" | "master";
  teaching_language?: string;
  annual_tuition_eur?: number;
  intake?: string;
  application_deadline?: string;
  application_url?: string;
  academic_year?: string;
  rules?: {
    min_years_of_education?: number;
    min_grade_110?: number;
    min_cgpa_4?: number;
    subject_credits?: { area: string; ects: number }[];
    english?: { ielts?: number; toefl?: number; moi_accepted?: boolean };
    extras?: string[];
  };
  evidence?: { field: string; quote: string }[];
  notes?: string;
};

export const programmeSchema = {
  type: "object",
  properties: {
    university_name: { type: "string" },
    programme_name: { type: "string" },
    city: { type: "string" },
    degree_level: { type: "string", enum: ["bachelor", "master"] },
    teaching_language: { type: "string" },
    annual_tuition_eur: { type: "number", description: "Maximum annual tuition for non-EU students in EUR" },
    intake: { type: "string", description: "e.g. Fall 2027" },
    application_deadline: { type: "string", description: "Earliest application deadline for non-EU applicants, YYYY-MM-DD" },
    application_url: { type: "string" },
    academic_year: { type: "string", description: "e.g. 2027/28" },
    rules: {
      type: "object",
      properties: {
        min_years_of_education: { type: "integer" },
        min_grade_110: { type: "number", description: "Minimum graduation grade on the Italian 110 scale" },
        min_cgpa_4: { type: "number", description: "Minimum GPA on a 4.0 scale if stated that way" },
        subject_credits: {
          type: "array",
          items: {
            type: "object",
            properties: {
              area: { type: "string", enum: [...SUBJECT_AREAS] },
              ects: { type: "number" },
            },
            required: ["area", "ects"],
          },
        },
        english: {
          type: "object",
          properties: {
            ielts: { type: "number" },
            toefl: { type: "number" },
            moi_accepted: { type: "boolean", description: "True only if a medium-of-instruction letter is explicitly accepted" },
          },
        },
        extras: { type: "array", items: { type: "string" }, description: "GRE, GMAT, entrance test, portfolio, interview, work experience" },
      },
    },
    evidence: {
      type: "array",
      description: "For each rule you filled in, a short verbatim quote from the source that supports it",
      items: {
        type: "object",
        properties: { field: { type: "string" }, quote: { type: "string" } },
        required: ["field", "quote"],
      },
    },
    notes: { type: "string" },
  },
};

export const programmeSystem = `You extract admission rules from an Italian university's admissions call
(bando) or programme page, in Italian or English, for a human verifier.
Only record rules the source states. Omit anything not stated; never estimate.
Map subject requirements (often expressed as SSD codes such as INF/01, ING-INF/05, MAT/05) to the
allowed subject areas and give the ECTS/CFU required. Quote the supporting text for every rule in
evidence so the verifier can check it against the source.`;
