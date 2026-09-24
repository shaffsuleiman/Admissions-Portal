import type { NextRequest } from "next/server";
import { AiNotConfiguredError } from "@/lib/ai/gemini";
import { draftProgrammeFromSource } from "@/lib/ai/programme-source";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

// Drafts rules for inspection or editing. Automated publishing uses /ai-review.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Please sign in again." }, { status: 401 });
  const { data: verifier } = await supabase
    .from("platform_admins")
    .select("user_id")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (!verifier) return Response.json({ error: "Only programme verifiers can draft rules." }, { status: 403 });

  const { sourceUrl, text } = (await request.json().catch(() => ({}))) as { sourceUrl?: string; text?: string };
  try {
    const draft = await draftProgrammeFromSource({ sourceUrl, text });
    return Response.json({ draft });
  } catch (caught) {
    const status = caught instanceof AiNotConfiguredError ? 503 : 502;
    return Response.json({ error: caught instanceof Error ? caught.message : "Drafting failed." }, { status });
  }
}
