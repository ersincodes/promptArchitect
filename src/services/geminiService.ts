import { Answers } from "../types";

type PersonaResponse = { persona?: string; error?: string };
type StructuredPromptResponse = { prompt?: string; error?: string };

const postJson = async <T>(
  url: string,
  body: Record<string, unknown>
): Promise<T> => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(json?.error || "Request failed. Please try again.");
  }

  return json as T;
};

export const generateSystemPersona = async (
  answers: Answers
): Promise<string> => {
  const json = await postJson<PersonaResponse>("/api/generate-persona", {
    answers,
  });

  if (!json.persona) {
    throw new Error("No response text generated.");
  }

  return json.persona;
};

export const generateStructuredPrompt = async (
  persona: string,
  userPrompt: string
): Promise<string> => {
  const json = await postJson<StructuredPromptResponse>(
    "/api/generate-structured-prompt",
    { persona, userPrompt }
  );

  if (!json.prompt) {
    throw new Error("No prompt generated. Please try again.");
  }

  return json.prompt;
};
