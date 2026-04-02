/**
 * Shared LLM text completion for API routes.
 * BYOK: never log apiKey or full request bodies.
 */

export type LlmProviderId = "openai" | "anthropic" | "gemini" | "local";

const OPENAI_MODEL = "gpt-4o-mini";
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const GEMINI_MODEL = "gemini-3-flash-preview";
const LOCAL_DEFAULT_MODEL = "gpt-3.5-turbo";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const ALLOWED_LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
]);

export type CompleteTextParams = {
  provider: LlmProviderId;
  userText: string;
  apiKey?: string;
  localBaseUrl?: string;
};

export const assertSafeLocalBaseUrl = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Local base URL is required.");
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error("Invalid local base URL.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Local base URL must use http or https.");
  }

  const host = url.hostname.toLowerCase();
  if (!ALLOWED_LOCAL_HOSTS.has(host)) {
    throw new Error(
      "Local AI base URL must use localhost, 127.0.0.1, or ::1 (SSRF protection)."
    );
  }

  // Typical vite dev: API runs on same machine as the local LLM server.
  const base =
    trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
  const completionsUrl = `${base}/v1/chat/completions`;
  try {
    return new URL(completionsUrl).toString();
  } catch {
    throw new Error("Could not build local chat completions URL.");
  }
};

const extractOpenAiStyleContent = (json: unknown): string => {
  const root = json as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };
  const text = root?.choices?.[0]?.message?.content;
  if (typeof text === "string" && text.trim()) {
    return text;
  }
  const err = root?.error?.message;
  throw new Error(err || "No text in OpenAI-compatible response.");
};

const completeOpenAI = async (apiKey: string, userText: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: userText }],
    }),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (json as { error?: { message?: string } })?.error?.message ||
      `OpenAI error: ${response.status}`;
    throw new Error(message);
  }
  return extractOpenAiStyleContent(json);
};

const completeAnthropic = async (apiKey: string, userText: string) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: userText }],
    }),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (json as { error?: { message?: string } })?.error?.message ||
      `Anthropic error: ${response.status}`;
    throw new Error(message);
  }

  const content = (json as { content?: Array<{ type?: string; text?: string }> })
    ?.content?.[0]?.text;
  if (typeof content === "string" && content.trim()) {
    return content;
  }
  throw new Error("No text in Anthropic response.");
};

const completeGemini = async (apiKey: string, userText: string) => {
  const url = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userText }] }],
    }),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (json as { error?: { message?: string } })?.error?.message ||
      `Gemini error: ${response.status}`;
    throw new Error(message);
  }

  const text =
    (json as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })
      ?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text === "string" && text.trim()) {
    return text;
  }
  throw new Error("No text in Gemini response.");
};

const completeLocalOpenAI = async (
  completionsUrl: string,
  userText: string
) => {
  const response = await fetch(completionsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LOCAL_DEFAULT_MODEL,
      messages: [{ role: "user", content: userText }],
    }),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (json as { error?: { message?: string } })?.error?.message ||
      `Local AI error: ${response.status}`;
    throw new Error(message);
  }
  return extractOpenAiStyleContent(json);
};

export const completeText = async (
  params: CompleteTextParams
): Promise<string> => {
  const { provider, userText } = params;
  if (!userText?.trim()) {
    throw new Error("Prompt text is empty.");
  }

  if (provider === "openai" || provider === "anthropic") {
    const key = params.apiKey?.trim();
    if (!key) {
      throw new Error("API key is required for this provider.");
    }
    if (provider === "openai") {
      return completeOpenAI(key, userText);
    }
    return completeAnthropic(key, userText);
  }

  if (provider === "gemini") {
    const fromBody = params.apiKey?.trim();
    const fromEnv = process.env.GEMINI_API_KEY?.trim();
    const key = fromBody || fromEnv;
    if (!key) {
      throw new Error(
        "Gemini API key is required (or set GEMINI_API_KEY on the server)."
      );
    }
    return completeGemini(key, userText);
  }

  if (provider === "local") {
    const raw = params.localBaseUrl?.trim();
    if (!raw) {
      throw new Error("Local base URL is required.");
    }
    const completionsUrl = assertSafeLocalBaseUrl(raw);
    return completeLocalOpenAI(completionsUrl, userText);
  }

  throw new Error("Unknown provider.");
};
