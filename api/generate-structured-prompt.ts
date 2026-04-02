import {
  completeText,
  type LlmProviderId,
} from "./lib/completeText";

const MAX_PROMPT_CHARACTERS = 3000;

type StructuredPromptBody = {
  persona?: string;
  userPrompt?: string;
  provider?: string;
  apiKey?: string;
  localBaseUrl?: string;
};

const sanitizeModelJson = (raw: string) => {
  if (!raw) {
    throw new Error("Model returned empty prompt text.");
  }

  const trimmed = raw.trim();
  const noFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return noFence;
};

const parseBody = (body: unknown): StructuredPromptBody => {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body as StructuredPromptBody;
};

const normalizeProvider = (raw?: string): LlmProviderId => {
  if (
    raw === "openai" ||
    raw === "anthropic" ||
    raw === "gemini" ||
    raw === "local"
  ) {
    return raw;
  }
  return "gemini";
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const {
    persona,
    userPrompt,
    provider: rawProvider,
    apiKey,
    localBaseUrl,
  } = parseBody(req.body);

  if (!persona?.trim()) {
    res
      .status(400)
      .json({ error: "Persona is missing. Please generate a persona first." });
    return;
  }

  if (!userPrompt?.trim()) {
    res.status(400).json({
      error:
        "Please describe what you want to build before generating the JSON prompt.",
    });
    return;
  }

  const provider = normalizeProvider(rawProvider);

  if (provider === "openai" || provider === "anthropic") {
    if (!apiKey?.trim()) {
      res.status(400).json({
        error: "API key is required for the selected provider.",
      });
      return;
    }
  }

  if (provider === "local" && !localBaseUrl?.trim()) {
    res.status(400).json({
      error: "Local base URL is required for Local AI.",
    });
    return;
  }

  const prompt = `
You are an elite Prompt Architect. Given the following system persona and user objective, craft a compact JSON prompt (<= ${MAX_PROMPT_CHARACTERS} characters) that maximizes downstream model performance.

SYSTEM PERSONA:
${persona}

USER OBJECTIVE / RAW PROMPT:
${userPrompt}

REQUIREMENTS:
- Output VALID JSON only, no markdown fences.
- Use keys: promptDetails.description, promptDetails.styleTags (array), negativePrompt (string), generationHints.aspectRatio, generationHints.detailLevel, generationHints.stylization, generationHints.camera.angle, generationHints.camera.lens, generationHints.lighting, generationHints.background.
- Use concise but vivid language. Always reference the persona perspective.
- Never exceed ${MAX_PROMPT_CHARACTERS} characters.
- Use this sample as inspiration for structure (do NOT copy values): {"promptDetails":{"description":"Ultra-detailed exploded technical infographic of {OBJECT_NAME}, shown in a 3/4 front isometric view...","styleTags":["Exploded View","Technical Infographic","Photoreal 3D CAD Render"]},"negativePrompt":"no people, no messy layout, no extra components","generationHints":{"aspectRatio":"2:3","detailLevel":"ultra","stylization":"low-medium","camera":{"angle":"3/4 front isometric","lens":"product render perspective"},"lighting":"soft even studio lighting","background":"smooth dark gray seamless backdrop"}}`;

  try {
    const responseText = await completeText({
      provider,
      userText: prompt,
      apiKey,
      localBaseUrl,
    });

    const sanitized = sanitizeModelJson(responseText || "");

    let parsed: unknown;
    try {
      parsed = JSON.parse(sanitized);
    } catch (error) {
      console.error("Prompt JSON parse error:", error);
      res
        .status(500)
        .json({ error: "Received invalid JSON prompt. Please try again." });
      return;
    }

    const pretty = JSON.stringify(parsed, null, 2);
    if (pretty.length <= MAX_PROMPT_CHARACTERS) {
      res.status(200).json({ prompt: pretty });
      return;
    }

    const compact = JSON.stringify(parsed);
    if (compact.length <= MAX_PROMPT_CHARACTERS) {
      res.status(200).json({ prompt: compact });
      return;
    }

    res.status(500).json({
      error: `Generated prompt exceeded the ${MAX_PROMPT_CHARACTERS} character limit. Please refine your input.`,
    });
  } catch (error: any) {
    const message = error?.message || "Failed to generate structured prompt.";
    const isValidation =
      typeof message === "string" &&
      (message.includes("required") ||
        message.includes("Invalid") ||
        message.includes("Unknown provider") ||
        message.includes("must use"));

    console.error("Error generating structured prompt:", message);
    res.status(isValidation ? 400 : 500).json({ error: message });
  }
}
