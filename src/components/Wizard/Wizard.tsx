import React, { useEffect, useRef } from "react";
import { WizardStepProps } from "../../types";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

const Wizard: React.FC<WizardStepProps> = ({
  question,
  description,
  value,
  placeholder,
  onChange,
  onNext,
  onBack,
  isFirst,
  isLast,
  stepIndex,
  totalSteps,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [question]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      onNext();
    }
  };

  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const isNextDisabled = value.trim().length === 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in-up">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
          <span>
            STEP {stepIndex + 1} OF {totalSteps}
          </span>
          <span>{Math.round(progress)}% COMPLETED</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-8 shadow-2xl border-t border-white/10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          {question}
        </h2>
        <p className="text-slate-400 mb-6 text-sm md:text-base leading-relaxed">
          {description}
        </p>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="relative w-full h-48 bg-slate-900 text-slate-100 p-4 rounded-lg outline-none border border-slate-700 focus:border-transparent resize-none font-mono text-sm leading-relaxed placeholder:text-slate-600"
            aria-label={question}
          />
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onBack}
            disabled={isFirst}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              isFirst
                ? "text-slate-600 cursor-not-allowed"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            )}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs text-slate-500 font-mono">
              CMD + ENTER to continue
            </span>
            <button
              onClick={onNext}
              disabled={isNextDisabled}
              className={cn(
                "group relative inline-flex items-center px-6 py-3 text-sm font-bold text-white rounded-full transition-all duration-300",
                isNextDisabled
                  ? "bg-slate-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-indigo-500/30"
              )}
            >
              {isLast ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Generate Persona
                </>
              ) : (
                <>
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
