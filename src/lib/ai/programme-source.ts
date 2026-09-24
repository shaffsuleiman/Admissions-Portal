import "server-only";

import { generateJson, type GeminiInput } from "@/lib/ai/gemini";
import { programmeSchema, programmeSystem, type ProgrammeDraft } from "@/lib/ai/schemas";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_TEXT = 60_000;

export function isPublicHttpUrl(value: string) {
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

export async function draftProgrammeFromSource(source: { sourceUrl?: string; text?: string }) {
  const input: GeminiInput[] = [];
  if (source.text?.trim()) {
    input.push({ type: "text", text: `Admissions call text:\n\n${source.text.trim().slice(0, MAX_TEXT)}` });
  } else if (source.sourceUrl) {
    if (!isPublicHttpUrl(source.sourceUrl)) throw new Error("Enter a public http(s) link to the admissions call.");
    const response = await fetch(source.sourceUrl, {
      headers: { "User-Agent": "SHAFFMINNAAdmissionsVerifier/1.0" },
      signal: AbortSignal.timeout(20_000),
      redirect: "follow",
    }).catch(() => null);
    if (!response?.ok) throw new Error(`Couldn’t open that link${response ? ` (${response.status})` : ""}.`);
    const type = response.headers.get("content-type") ?? "";
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES) throw new Error("That document is too large (15MB max).");
    if (type.includes("pdf"))
      input.push({ type: "document", data: Buffer.from(bytes).toString("base64"), mime_type: "application/pdf" });
    else input.push({ type: "text", text: `Page ${source.sourceUrl}:\n\n${htmlToText(new TextDecoder().decode(bytes))}` });
  } else {
    throw new Error("Add a source link or paste the admissions call text.");
  }
  input.push({ type: "text", text: "Extract this programme's admission rules for a non-EU applicant with a Pakistani degree." });
  return generateJson<ProgrammeDraft>({ system: programmeSystem, schema: programmeSchema, input });
}
