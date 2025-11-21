import { useState } from 'react';
import { Answers } from '../types';

export const INITIAL_ANSWERS: Answers = {
  role: "",
  tools: "",
  behavior: "",
  principles: "",
  style: "",
};

export const QUESTIONS = [
  {
    key: "role",
    question: "What is the core role and expertise level?",
    description:
      "Define the persona. E.g., 'Senior Full-Stack Developer', 'Strategic Business Consultant', 'Sci-Fi Author', or 'Expert Brainstorming Partner'.",
    placeholder:
      "e.g., World-class UX Researcher specialized in accessibility...",
  },
  {
    key: "tools",
    question: "What tools, frameworks, or concepts are used?",
    description:
      "List the technologies, mental models, software, or theories this persona relies on.",
    placeholder:
      "e.g., Next.js & Python, Design Thinking, SWOT Analysis, Narrative Arc, Adobe Suite...",
  },
  {
    key: "behavior",
    question: "How should the AI behave and reason?",
    description:
      "Define interaction rules. Should it be critical? Creative? Think step-by-step? Challenge assumptions?",
    placeholder:
      "e.g., Think step-by-step. Be highly critical. Offer 3 distinct variations. Never apologize...",
  },
  {
    key: "principles",
    question: "What are the core principles or methodology?",
    description:
      "Describe the workflow, decision-making framework, or architectural rules.",
    placeholder:
      "e.g., Mobile-first design. Show don't tell. MECE principle. Scrape then clean data...",
  },
  {
    key: "style",
    question: "What are the output style preferences?",
    description:
      "Format requirements. Code only? Markdown tables? Executive summary? Conversational tone?",
    placeholder:
      "e.g., Strict TypeScript code. Bullet points only. Vivid descriptive language. Professional email format...",
  },
];

export const useWizard = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);

  const updateAnswer = (value: string) => {
    const key = QUESTIONS[stepIndex].key as keyof Answers;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = (onComplete: () => void) => {
    if (stepIndex < QUESTIONS.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = (onReset: () => void) => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    } else {
      onReset();
    }
  };

  const resetWizard = () => {
    setAnswers(INITIAL_ANSWERS);
    setStepIndex(0);
  };

  return {
    stepIndex,
    answers,
    currentQuestion: QUESTIONS[stepIndex],
    isFirst: stepIndex === 0,
    isLast: stepIndex === QUESTIONS.length - 1,
    totalSteps: QUESTIONS.length,
    updateAnswer,
    handleNext,
    handleBack,
    resetWizard,
  };
};

