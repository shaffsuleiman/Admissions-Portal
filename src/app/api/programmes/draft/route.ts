import type { NextRequest } from "next/server";
import { AiNotConfiguredError, generateJson, type GeminiInput } from "@/lib/ai/gemini";
import { programmeSchema, programmeSystem, type ProgrammeDraft } from "@/lib/ai/schemas";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_TEXT = 60_000;

function isPublicHttpUrl(value: string) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const host = url.hostname.toLowerCase();
    return !(
      host === "localhost" ||
      host.endsWith(".local") ||
      /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      host.includes(":")
    );
  } catch {
    return false;
  }
}

function htmlToText(html: string) {
  return html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>|<\/(p|div|li|tr|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
    .slice(0, MAX_TEXT);
}

// Drafts a programme's rules from its admissions call for a platform verifier.
// Nothing is saved: the verifier checks every field against the source first.
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
  const input: GeminiInput[] = [];
  if (text?.trim()) {
    input.push({ type: "text", text: `Admissions call text:\n\n${text.trim().slice(0, MAX_TEXT)}` });
  } else if (sourceUrl) {
    if (!isPublicHttpUrl(sourceUrl))
      return Response.json({ error: "Enter a public http(s) link to the admissions call." }, { status: 400 });
    const source = await fetch(sourceUrl, {
      headers: { "User-Agent": "SHAFFMINNAAdmissionsVerifier/1.0" },
      signal: AbortSignal.timeout(20_000),
      redirect: "follow",
    }).catch(() => null);
    if (!source?.ok)
      return Response.json({ error: `Couldn’t open that link${source ? ` (${source.status})` : ""}. Paste the text instead.` }, { status: 502 });
    const type = source.headers.get("content-type") ?? "";
    const bytes = await source.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES)
      return Response.json({ error: "That document is too large (15MB max)." }, { status: 413 });
    if (type.includes("pdf"))
      input.push({ type: "document", data: Buffer.from(bytes).toString("base64"), mime_type: "application/pdf" });
    else input.push({ type: "text", text: `Page ${sourceUrl}:\n\n${htmlToText(new TextDecoder().decode(bytes))}` });
  } else {
    return Response.json({ error: "Add a source link or paste the admissions call text." }, { status: 400 });
  }
  input.push({ type: "text", text: "Extract this programme's admission rules for a non-EU applicant with a Pakistani degree." });

  try {
    const draft = await generateJson<ProgrammeDraft>({ system: programmeSystem, schema: programmeSchema, input });
    return Response.json({ draft });
  } catch (caught) {
    const status = caught instanceof AiNotConfiguredError ? 503 : 502;
    return Response.json({ error: caught instanceof Error ? caught.message : "Drafting failed." }, { status });
  }
}
