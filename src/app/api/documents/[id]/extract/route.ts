import type { NextRequest } from "next/server";
import { AiNotConfiguredError, generateJson, inputForFile } from "@/lib/ai/gemini";
import { transcriptSchema, transcriptSystem, type TranscriptExtraction } from "@/lib/ai/schemas";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const MAX_BYTES = 15 * 1024 * 1024;

// Reads one uploaded student document with AI. Row-level security limits the
// lookup and download to documents in the signed-in counsellor's workspace.
export async function POST(_request: NextRequest, ctx: RouteContext<"/api/documents/[id]/extract">) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Please sign in again." }, { status: 401 });

  const { data: document, error } = await supabase
    .from("documents")
    .select("id, storage_path, mime_type, file_name, size_bytes")
    .eq("id", id)
    .maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!document) return Response.json({ error: "Document not found." }, { status: 404 });
  if ((document.size_bytes ?? 0) > MAX_BYTES)
    return Response.json({ error: "This file is too large to read (15MB max)." }, { status: 413 });

  const { data: file, error: downloadError } = await supabase.storage
    .from("student-documents")
    .download(document.storage_path);
  if (downloadError || !file)
    return Response.json({ error: downloadError?.message ?? "Could not open the file." }, { status: 500 });

  try {
    const mimeType = document.mime_type || file.type;
    const extraction = await generateJson<TranscriptExtraction>({
      system: transcriptSystem,
      schema: transcriptSchema,
      input: [
        inputForFile(await file.arrayBuffer(), mimeType),
        { type: "text", text: `Extract the academic record from "${document.file_name}".` },
      ],
    });
    await supabase
      .from("documents")
      .update({
        extracted_data: extraction,
        extraction_confidence: typeof extraction.confidence === "number" ? extraction.confidence : null,
        extraction_status: "review",
      })
      .eq("id", id);
    return Response.json({ extraction });
  } catch (caught) {
    if (caught instanceof AiNotConfiguredError)
      return Response.json({ error: caught.message }, { status: 503 });
    await supabase.from("documents").update({ extraction_status: "failed" }).eq("id", id);
    return Response.json({ error: caught instanceof Error ? caught.message : "Reading failed." }, { status: 502 });
  }
}
