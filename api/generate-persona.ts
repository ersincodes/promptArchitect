import { GoogleGenAI } from "@google/genai";

type Answers = {
  role: string;
  tools: string;
  behavior: string;
  principles: string;
  style: string;
};

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

const parseBody = (body: unknown): { answers?: Answers } => {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body as { answers?: Answers };
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { answers } = parseBody(req.body);
  if (
    !answers ||
    !answers.role?.trim() ||
    !answers.tools?.trim() ||
    !answers.behavior?.trim() ||
    !answers.principles?.trim() ||
    !answers.style?.trim()
  ) {
    res
      .status(400)
      .json({
        error: "All persona fields are required to generate a persona.",
      });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res
      .status(500)
      .json({ error: "Server misconfigured: missing GEMINI_API_KEY." });
    return;
  }

  try {
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

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      res.status(500).json({ error: "No response text generated." });
      return;
    }

    res.status(200).json({ persona: responseText });
  } catch (error) {
    console.error("Error generating persona:", error);
    res
      .status(500)
      .json({ error: "Failed to generate persona. Please try again." });
  }
}
