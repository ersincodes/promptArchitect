export interface Answers {
  role: string;
  tools: string;
  behavior: string;
  principles: string;
  style: string;
}

export type LlmProvider = "openai" | "anthropic" | "gemini" | "local";

export interface GenerationConfig {
  provider: LlmProvider;
  apiKey: string;
  localBaseUrl: string;
}

export const INITIAL_GENERATION_CONFIG: GenerationConfig = {
  provider: "gemini",
  apiKey: "",
  localBaseUrl: "",
};

export enum AppState {
  WELCOME = "WELCOME",
  WIZARD = "WIZARD",
  PROVIDER = "PROVIDER",
  GENERATING = "GENERATING",
  RESULT = "RESULT",
  PROMPT = "PROMPT",
  ERROR = "ERROR",
}

export interface WizardStepProps {
  question: string;
  description: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  stepIndex: number;
  totalSteps: number;
}