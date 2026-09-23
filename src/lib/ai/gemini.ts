// Server-side Gemini client. Only import this from route handlers: the API key must
// never reach the browser. Uses generateContent, whose JSON-schema output is honoured
// by every current model.

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
// Newest free-tier Flash model: best at messy scans. Override with GEMINI_MODEL
// (gemini-2.5-flash-lite is faster and lighter if quota becomes a problem).
const DEFAULT_MODEL = "gemini-3.8-flash";
const FALLBACK_MODEL = "gemini-2.5-flash-lite";
const RETRY_DELAYS_MS = [2_000, 5_000];

export type GeminiInput =
  | { type: "text"; text: string }
  | { type: "document" | "image"; data: string; mime_type: string };

export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI reading isn’t set up yet. Add GEMINI_API_KEY to the server environment.");
  }
}

export const aiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

const toPart = (input: GeminiInput) =>
  input.type === "text" ? { text: input.text } : { inlineData: { mimeType: input.mime_type, data: input.data } };

type GeminiBody = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

export async function generateJson<T>(options: {
  input: GeminiInput[];
  schema: Record<string, unknown>;
  system: string;
}): Promise<T> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiNotConfiguredError();
  // Try the main model first; if it is overloaded, fall back to the lighter model.
  const models = [...new Set([process.env.GEMINI_MODEL || DEFAULT_MODEL, process.env.GEMINI_FALLBACK_MODEL || FALLBACK_MODEL])];
  const request = JSON.stringify({
    systemInstruction: { parts: [{ text: options.system }] },
    contents: [{ role: "user", parts: options.input.map(toPart) }],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      responseJsonSchema: options.schema,
    },
  });

  // Retry briefly when Google reports high demand (429/503); other errors fail fast.
  let response: Response | null = null;
  let body: GeminiBody | null = null;
  const busy = (res: Response | null) => Boolean(res && [429, 503].includes(res.status));
  for (const model of models) {
    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      response = await fetch(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: request,
        signal: AbortSignal.timeout(45_000),
      });
      const raw = await response.json().catch(() => null);
      body = (Array.isArray(raw) ? raw[0] : raw) as GeminiBody | null;
      if (!busy(response) || attempt === RETRY_DELAYS_MS.length) break;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
    if (!busy(response)) break;
  }

  if (!response?.ok) {
    const message = body?.error?.message;
    if (response && [429, 503].includes(response.status))
      throw new Error("The AI service is busy right now. Please try again in a minute.");
    throw new Error(message ? `AI request failed: ${message}` : `AI request failed (${response?.status})`);
  }
  if (body?.promptFeedback?.blockReason)
    throw new Error(`The AI declined to read this document (${body.promptFeedback.blockReason}).`);

  const text = (body?.candidates?.[0]?.content?.parts ?? [])
    .filter((part) => !part.thought && typeof part.text === "string")
    .map((part) => part.text)
    .join("")
    .trim()
    .replace(/^```(?:json)?\s*|\s*```$/g, "");
  if (!text) throw new Error("The AI returned an empty response. Try again.");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("The AI response wasn’t valid JSON. Try again.");
  }
}

export function inputForFile(bytes: ArrayBuffer, mimeType: string): GeminiInput {
  const data = Buffer.from(bytes).toString("base64");
  if (mimeType === "application/pdf") return { type: "document", data, mime_type: mimeType };
  if (mimeType.startsWith("image/")) return { type: "image", data, mime_type: mimeType };
  throw new Error("Only PDF, JPG and PNG files can be read.");
}
