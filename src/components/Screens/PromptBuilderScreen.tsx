import React, { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Loader2,
  SplitSquareHorizontal,
  Undo2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { generateStructuredPrompt } from "../../services/geminiService";

interface PromptBuilderScreenProps {
  persona: string;
  onBack: () => void;
  onReset: () => void;
}

const MAX_PROMPT_CHARACTERS = 3000;

const PromptBuilderScreen: React.FC<PromptBuilderScreenProps> = ({
  persona,
  onBack,
  onReset,
}) => {
  const [promptIdea, setPromptIdea] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPromptIdea(event.target.value);
  };

  const handleBuildPrompt = async () => {
    if (!promptIdea.trim()) {
      setError("Please describe what you want to generate first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateStructuredPrompt(persona, promptIdea);
      setGeneratedPrompt(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the prompt.";
      setError(message);
      setGeneratedPrompt("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const generatedLength = generatedPrompt.length;

  const handleOpenGenerator = () => {
    if (!generatedPrompt) {
      return;
    }

    window.open(
      "https://trendy-ai-xi.vercel.app/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-semibold uppercase tracking-wide">
            <SplitSquareHorizontal className="w-4 h-4" />
            Prompt Builder
          </div>
          <h2 className="text-3xl font-bold text-white mt-2">
            Generate a JSON prompt from the persona
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-3 max-w-2xl">
            Describe the desired output on the left. The persona will generate a
            JSON prompt capped at {MAX_PROMPT_CHARACTERS} characters so you can
            drop it straight into your favorite generative model.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
            aria-label="Back to persona">
            <ArrowLeft className="w-4 h-4" />
            Back to Persona
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors"
            aria-label="Create new persona">
            <Undo2 className="w-4 h-4" />
            Start Over
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass-panel rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
            <div className="text-xs font-mono text-slate-500 mb-2">
              Persona context
            </div>
            <div className="max-h-48 overflow-y-auto text-sm text-slate-300 whitespace-pre-wrap custom-scrollbar">
              {persona}
            </div>
          </div>

          <div>
            <label
              htmlFor="prompt-input"
              className="text-sm font-semibold text-slate-200 flex items-center justify-between">
              Describe the scene or task
              <span className="text-xs font-mono text-slate-500">
                {promptIdea.length} chars
              </span>
            </label>
            <textarea
              id="prompt-input"
              value={promptIdea}
              onChange={handlePromptChange}
              placeholder="E.g., Create an ultra detailed prompt for..."
              className="mt-2 w-full min-h-[220px] rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-0 text-slate-100 p-4 text-sm leading-relaxed resize-none outline-none"
              aria-label="Describe the prompt you need"
              tabIndex={0}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  handleBuildPrompt();
                }
              }}
            />
          </div>

          <button
            onClick={handleBuildPrompt}
            disabled={isGenerating}
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all",
              isGenerating
                ? "bg-slate-700 cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-indigo-500/30"
            )}
            aria-label="Generate structured prompt">
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              "Generate JSON Prompt"
            )}
          </button>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 text-sm p-4">
              {error}
            </div>
          )}
        </section>

        <section className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">JSON Prompt</h3>
              <p className="text-xs font-mono text-slate-500">
                {generatedLength}/{MAX_PROMPT_CHARACTERS} characters
              </p>
            </div>

            <button
              onClick={handleCopyPrompt}
              disabled={!generatedPrompt}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors",
                generatedPrompt
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-900 text-slate-500 cursor-not-allowed"
              )}
              aria-label="Copy JSON prompt">
              <Copy className="w-4 h-4" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="flex-1 bg-[#0d1117] rounded-xl border border-slate-800 overflow-hidden">
            <div className="h-10 bg-[#1e1e1e] border-b border-slate-800 flex items-center px-4 text-xs text-slate-500 font-mono">
              prompt_blueprint.json
            </div>

            <div className="p-4 overflow-y-auto text-sm font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[420px] custom-scrollbar">
              {isGenerating && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sculpting prompt with persona intelligence…
                </div>
              )}

              {!isGenerating && !generatedPrompt && (
                <p className="text-slate-500">
                  The generated JSON prompt will appear here. Keep it concise so
                  downstream models stay inside context limits.
                </p>
              )}

              {!isGenerating && generatedPrompt && generatedPrompt}
            </div>
          </div>

          <button
            onClick={handleOpenGenerator}
            disabled={!generatedPrompt}
            className={cn(
              "mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all text-center",
              generatedPrompt
                ? "bg-gradient-to-r from-emerald-400 to-green-500 hover:shadow-lg hover:shadow-emerald-500/30"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
            aria-label="Open Trendy AI to generate an image">
            Generate an image NOW!
          </button>
        </section>
      </div>
    </div>
  );
};

export default PromptBuilderScreen;
