import type { NextRequest } from "next/server";
import {
  OpenAiNotConfiguredError,
} from "@/lib/ai/openai-web";
import { researchLiveMatches } from "@/lib/ai/live-match";
import {
  DEFAULT_CONVERSION,
  type Conversion,
  type StudentFacts,
} from "@/lib/matching/engine";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 120;

const numberOrNull = (value: unknown) =>
  value == null || value === "" || Number.isNaN(Number(value))
    ? null
    : Number(value);

const normalizedName = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user)
    return Response.json({ error: "Please sign in again." }, { status: 401 });

  const { studentId } = (await request.json().catch(() => ({}))) as {
    studentId?: string;
  };
  if (!studentId)
    return Response.json({ error: "Choose a student." }, { status: 400 });

  const [studentResult, academicResult, creditsResult, universitiesResult] =
    await Promise.all([
      supabase
        .from("students")
        .select("id, workspace_id, target_intake, annual_budget_eur")
        .eq("id", studentId)
        .single(),
      supabase
        .from("academic_profiles")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle(),
      supabase
        .from("subject_credits")
        .select("subject_area, ects, local_credits, confirmed")
        .eq("student_id", studentId),
      supabase
        .from("universities")
        .select("name, ects_per_credit_hour, grade_pass_ratio"),
    ]);

  if (studentResult.error)
    return Response.json({ error: "Student not found." }, { status: 404 });
  if (academicResult.error)
    return Response.json({ error: academicResult.error.message }, { status: 502 });
  if (creditsResult.error)
    return Response.json({ error: creditsResult.error.message }, { status: 502 });
  const academic = academicResult.data;
  if (!academic)
    return Response.json(
      { error: "Add the student’s academic profile before researching matches." },
      { status: 400 },
    );
  if (!academic.confirmed_at)
    return Response.json(
      { error: "Review and confirm the academic profile before researching matches." },
      { status: 400 },
    );

  const facts: StudentFacts = {
    degreeTitle: String(academic.degree_title ?? ""),
    yearsOfEducation: numberOrNull(academic.years_of_education),
    cgpa: numberOrNull(academic.cgpa),
    cgpaScale: numberOrNull(academic.cgpa_scale),
    englishTest:
      academic.english_overall != null &&
      academic.english_test_type &&
      academic.english_test_type !== "None"
        ? {
            type: String(academic.english_test_type),
            score: Number(academic.english_overall),
          }
        : null,
    mediumOfInstruction: Boolean(academic.medium_of_instruction),
    credits: (creditsResult.data ?? [])
      .filter((credit) => credit.confirmed)
      .map((credit) => ({
        area: String(credit.subject_area),
        creditHours: numberOrNull(credit.local_credits),
        ects: numberOrNull(credit.ects),
      })),
  };
  const conversions = new Map<string, Conversion>(
    (universitiesResult.error ? [] : universitiesResult.data ?? []).map(
      (university) => [
        normalizedName(String(university.name)),
        {
          ectsPerCreditHour:
            numberOrNull(university.ects_per_credit_hour) ??
            DEFAULT_CONVERSION.ectsPerCreditHour,
          passRatio:
            numberOrNull(university.grade_pass_ratio) ??
            DEFAULT_CONVERSION.passRatio,
        },
      ],
    ),
  );

  try {
    const result = await researchLiveMatches({
      facts,
      targetIntake: String(studentResult.data.target_intake ?? ""),
      annualBudgetEur: numberOrNull(studentResult.data.annual_budget_eur),
      conversionForUniversity: (university) =>
        conversions.get(normalizedName(university)),
    });
    await supabase.from("activity_logs").insert({
      workspace_id: studentResult.data.workspace_id,
      actor_id: auth.user.id,
      action: "matches.live_research",
      entity_type: "student",
      entity_id: studentId,
      metadata: {
        accepted_candidates: result.matches.length,
        discarded_candidates: result.discarded,
        model: process.env.OPENAI_MATCH_MODEL || "gpt-5.5",
      },
    });
    return Response.json(result);
  } catch (caught) {
    const status = caught instanceof OpenAiNotConfiguredError ? 503 : 502;
    return Response.json(
      {
        error:
          caught instanceof Error ? caught.message : "Live research failed.",
      },
      { status },
    );
  }
}
