import "server-only";

const RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.5";

export type WebResearchSource = {
  title: string;
  url: string;
};

type ResponseItem = {
  type?: string;
  action?: {
    sources?: { title?: string; url?: string }[];
  };
  content?: {
    type?: string;
    text?: string;
    annotations?: {
      type?: string;
      title?: string;
      url?: string;
      url_citation?: { title?: string; url?: string };
    }[];
  }[];
};

type ResponsesBody = {
  error?: { message?: string };
  output?: ResponseItem[];
  status?: string;
};

export class OpenAiNotConfiguredError extends Error {
  constructor() {
    super(
      "Live AI research isn’t configured yet. Add OPENAI_API_KEY to the server environment.",
    );
  }
}

function publicHttpUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function runOpenAiWebResearch<T>(options: {
  input: string;
  instructions: string;
  name: string;
  schema: Record<string, unknown>;
}): Promise<{ data: T; sources: WebResearchSource[] }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new OpenAiNotConfiguredError();

  const response = await fetch(RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MATCH_MODEL || DEFAULT_MODEL,
      store: false,
      reasoning: { effort: "medium" },
      instructions: options.instructions,
      input: options.input,
      tools: [
        {
          type: "web_search",
          filters: {
            blocked_domains: [
              "mastersportal.com",
              "studyportals.com",
              "educations.com",
              "wikipedia.org",
              "reddit.com",
              "quora.com",
            ],
          },
        },
      ],
      tool_choice: "required",
      include: ["web_search_call.action.sources"],
      text: {
        format: {
          type: "json_schema",
          name: options.name,
          strict: true,
          schema: options.schema,
        },
      },
      max_output_tokens: 10_000,
    }),
    signal: AbortSignal.timeout(110_000),
  });
  const body = (await response.json().catch(() => null)) as ResponsesBody | null;
  if (!response.ok) {
    throw new Error(
      body?.error?.message
        ? `Live research failed: ${body.error.message}`
        : `Live research failed (${response.status}).`,
    );
  }

  const output = body?.output ?? [];
  const text = output
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" && content.text)
    .map((content) => content.text)
    .join("")
    .trim();
  if (!text) throw new Error("Live research returned no structured result.");

  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error("Live research returned invalid structured data.");
  }

  const sourceMap = new Map<string, WebResearchSource>();
  const addSource = (urlValue?: string, titleValue?: string) => {
    const url = publicHttpUrl(urlValue);
    if (!url) return;
    sourceMap.set(url, { title: titleValue?.trim() || new URL(url).hostname, url });
  };
  for (const item of output) {
    for (const source of item.action?.sources ?? [])
      addSource(source.url, source.title);
    for (const content of item.content ?? []) {
      for (const annotation of content.annotations ?? []) {
        addSource(
          annotation.url_citation?.url ?? annotation.url,
          annotation.url_citation?.title ?? annotation.title,
        );
      }
    }
  }

  return { data, sources: [...sourceMap.values()] };
}
