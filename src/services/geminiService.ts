import { GoogleGenAI } from "@google/genai";
import { Answers } from "../types";

const EXAMPLE_FORMAT = `
You are a Senior Full-Stack Developer and an expert in ReactJS, NextJS, JavaScript, TypeScript, HTML, CSS, TailwindCSS, Shadcn UI, Radix, Python, FastAPI, Playwright, ETL pipelines, MongoDB, PostgreSQL, and modern full-stack architectures. You are thoughtful, give nuanced answers, and are brilliant at reasoning. You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

You build real estate investment platforms using a hybrid architecture: MongoDB Atlas for raw scraped data and PostgreSQL for cleaned, normalized analytics data, using FastAPI + Python for backend APIs, scrapers, and ETL pipelines.

⭐ GENERAL BEHAVIOR RULES
Follow the user’s requirements carefully & to the letter.
First think step-by-step — describe your plan in very detailed pseudocode.
Confirm, then write code.
Always write correct, best-practice, DRY, bug-free, fully functional and complete code.
Focus on readability over performance.
Leave NO TODOs, placeholders, or blank sections.
Include all required imports.
Use accurate naming for components, functions, schemas, models, handlers, etc.
Be concise — minimize non-essential prose.
If you don’t know something, say so instead of guessing.
If there is no correct answer, state that clearly.

⭐ TECH STACK / TOOLS (Example Section)
Frontend (Next.js 15 + TypeScript)
React, Next.js App Router
TypeScript
TailwindCSS

Backend (Python)
FastAPI
SQLModel or SQLAlchemy ORM

Database
MongoDB Atlas → Raw data
PostgreSQL → Cleaned data

⭐ ARCHITECTURE PRINCIPLES / METHODOLOGY
Scrapers ALWAYS save raw data into MongoDB.
ETL pipelines ALWAYS read from MongoDB, clean + validate, and then insert structured data into PostgreSQL.
Never overwrite or mutate raw MongoDB data.
Clean data must be normalized, deduplicated, validated by Pydantic.

⭐ OUTPUT GUIDELINES / STYLE
Follow these strict rules:
Use TypeScript everywhere.
Use early returns for clarity.
Use Tailwind classes for all styling.
Use class: instead of ternaries in class attributes whenever possible.
Use descriptive variable/function names.
Event handlers must start with handle:
handleClick, handleKeyDown, handleSubmit, etc.
Use const instead of function.
`;

const SAMPLE_JSON_PROMPT = `{
  "promptDetails": {
    "description": "Ultra-detailed exploded technical infographic of {OBJECT_NAME}, shown in a 3/4 front isometric view...",
    "styleTags": [
      "Exploded View",
      "Technical Infographic",
      "Photoreal 3D CAD Render"
    ]
  },
  "negativePrompt": "no people, no messy layout, no extra components",
  "generationHints": {
    "aspectRatio": "2:3",
    "detailLevel": "ultra",
    "stylization": "low-medium",
    "camera": {
      "angle": "3/4 front isometric",
      "lens": "product render perspective"
    },
    "lighting": "soft even studio lighting",
    "background": "smooth dark gray seamless backdrop"
  }
}`;

const MAX_PROMPT_CHARACTERS = 2000;

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

export const generateSystemPersona = async (
  answers: Answers
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "API Key is missing. Please check your environment configuration."
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    You are an expert Persona Engineer. Your task is to generate a highly effective, professional, and strict System Persona for an AI assistant. 
    This assistant might be for Coding, Brainstorming, Creative Writing, Business Strategy, or any other expert role.

    The user has provided the following requirements for the persona:
    1. **Core Role & Expertise:** ${answers.role}
    2. **Tools / Tech Stack / Concepts:** ${answers.tools}
    3. **Behavioral Rules:** ${answers.behavior}
    4. **Principles / Methodology / Architecture:** ${answers.principles}
    5. **Output Style / Format:** ${answers.style}

    **Instructions:**
    - Synthesize these requirements into a cohesive, authoritative system persona.
    - **Structure:** Use the visual style of the EXAMPLE below (using headers with ⭐ icons).
    - **Adaptability:** 
      - If the role is **coding-related**, keep sections like "TECH STACK", "ARCHITECTURE PRINCIPLES", "WHEN WRITING CODE".
      - If the role is **non-technical** (e.g., a Writer, PM, or Consultant), rename the sections to fit the context (e.g., "CORE CONCEPTS & TOOLS", "METHODOLOGY & FRAMEWORKS", "OUTPUT STYLE GUIDELINES").
    - Maintain the stern, high-performance, and expert tone of the example.
    - Ensure all sections are populated based on the user's input.
    - If the user input for a section is vague, infer standard best practices for that specific role to fill the gaps intelligently.

    **Reference Format (Structure to follow):**
    ${EXAMPLE_FORMAT}

    **Output:**
    Generate ONLY the final system persona text. Do not add any conversational filler before or after.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    // Extract text from the response structure
    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("No response text generated.");
    }
    return responseText;
  } catch (error) {
    console.error("Error generating persona:", error);
    throw error;
  }
};

export const generateStructuredPrompt = async (
  persona: string,
  userPrompt: string
): Promise<string> => {
  if (!persona.trim()) {
    throw new Error("Persona is missing. Please generate a persona first.");
  }

  if (!userPrompt.trim()) {
    throw new Error(
      "Please describe what you want to build before generating the JSON prompt."
    );
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "API Key is missing. Please check your environment configuration."
    );
  }

  const ai = new GoogleGenAI({ apiKey });

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
- Use this sample as inspiration for structure (do NOT copy values): ${SAMPLE_JSON_PROMPT}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  });

  const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
  const sanitized = sanitizeModelJson(responseText || "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(sanitized);
  } catch (error) {
    console.error("Prompt JSON parse error:", error);
    throw new Error("Received invalid JSON prompt. Please try again.");
  }

  const pretty = JSON.stringify(parsed, null, 2);
  if (pretty.length <= MAX_PROMPT_CHARACTERS) {
    return pretty;
  }

  const compact = JSON.stringify(parsed);
  if (compact.length <= MAX_PROMPT_CHARACTERS) {
    return compact;
  }

  throw new Error(
    "Generated prompt exceeded the 2000 character limit. Please refine your input."
  );
};
