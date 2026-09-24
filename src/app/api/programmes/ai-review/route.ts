import type { NextRequest } from "next/server";
import { draftProgrammeFromSource } from "@/lib/ai/programme-source";
import { hasEligibilityRules, serializeRules, type ProgrammeRules } from "@/lib/matching/engine";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

function rulesFromDraft(draft: Awaited<ReturnType<typeof draftProgrammeFromSource>>): ProgrammeRules {
  return {
    minYearsOfEducation: draft.rules?.min_years_of_education ?? null,
    minGrade110: draft.rules?.min_grade_110 ?? null,
    minCgpa4: draft.rules?.min_cgpa_4 ?? null,
    subjectCredits: (draft.rules?.subject_credits ?? []).map((item) => ({ area: item.area, ects: item.ects })),
    english: {
      ielts: draft.rules?.english?.ielts ?? null,
      toefl: draft.rules?.english?.toefl ?? null,
      mediumOfInstructionAccepted: draft.rules?.english?.moi_accepted ?? false,
    },
    extras: draft.rules?.extras ?? [],
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Please sign in again." }, { status: 401 });
  const { data: verifier } = await supabase.from("platform_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!verifier) return Response.json({ error: "Only catalogue admins can run AI review." }, { status: 403 });

  const { programmeId } = (await request.json().catch(() => ({}))) as { programmeId?: string };
  if (!programmeId) return Response.json({ error: "Choose a programme." }, { status: 400 });
  const { data: programme, error: loadError } = await supabase
    .from("programmes")
    .select("id, source_url")
    .eq("id", programmeId)
    .single();
  if (loadError || !programme) return Response.json({ error: "Programme not found." }, { status: 404 });

  try {
    const draft = await draftProgrammeFromSource({ sourceUrl: programme.source_url });
    const rules = rulesFromDraft(draft);
    const confidence = Math.max(0, Math.min(100, Math.round(draft.confidence ?? 0)));
    const evidence = draft.evidence ?? [];
    const accepted = confidence >= 70 && evidence.length > 0 && hasEligibilityRules(rules);
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("programmes")
      .update({
        requirements: serializeRules(rules),
        verification_evidence: evidence,
        verification_notes: draft.notes || (accepted ? "Rules extracted automatically from the linked primary source." : "AI review did not meet the publishing threshold."),
        extraction_draft: draft,
        verification_status: accepted ? "ai_reviewed" : "in_review",
        review_assigned_to: auth.user.id,
        review_started_at: now,
        source_checked_at: now,
        ai_reviewed_at: accepted ? now : null,
        ai_confidence: confidence,
        ai_review_model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        verified_at: null,
        verified_by: null,
      })
      .eq("id", programmeId);
    if (error) throw error;
    return Response.json({ status: accepted ? "ai_reviewed" : "in_review", confidence, evidenceCount: evidence.length });
  } catch (caught) {
    return Response.json({ error: caught instanceof Error ? caught.message : "AI review failed." }, { status: 502 });
  }
}
