export interface Answers {
  role: string;
  tools: string;
  behavior: string;
  principles: string;
  style: string;
}

export enum AppState {
  WELCOME = "WELCOME",
  WIZARD = "WIZARD",
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