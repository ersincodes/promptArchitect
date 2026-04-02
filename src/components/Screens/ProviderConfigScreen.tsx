import React, { useMemo, useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  GenerationConfig,
  INITIAL_GENERATION_CONFIG,
  LlmProvider,
} from "../../types";

const MIN_API_KEY_LENGTH = 8;

const ALLOWED_LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
]);

const PROVIDER_OPTIONS: { value: LlmProvider; label: string; hint: string }[] =
  [
    {
      value: "openai",
      label: "OpenAI",
      hint: "Uses your OpenAI API key and account balance.",
    },
    {
      value: "anthropic",
      label: "Anthropic",
      hint: "Uses your Anthropic API key and account balance.",
    },
    {
      value: "gemini",
      label: "Google Gemini",
      hint: "Uses your Gemini API key, or server GEMINI_API_KEY if left empty.",
    },
    {
      value: "local",
      label: "Local AI",
      hint: "OpenAI-compatible server on this machine (e.g. LM Studio).",
    },
  ];

const validateLocalBaseUrl = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "Enter the base URL of your local server.";
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return "Enter a valid URL (e.g. http://127.0.0.1:1234).";
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "URL must start with http:// or https://.";
  }

  const host = url.hostname.toLowerCase();
  if (!ALLOWED_LOCAL_HOSTS.has(host)) {
    return "Use localhost, 127.0.0.1, or ::1 only.";
  }

  return null;
};

const isApiKeySufficient = (provider: LlmProvider, apiKey: string) => {
  const trimmed = apiKey.trim();
  if (provider === "gemini") {
    return trimmed.length === 0 || trimmed.length >= MIN_API_KEY_LENGTH;
  }
  return trimmed.length >= MIN_API_KEY_LENGTH;
};

export interface ProviderConfigScreenProps {
  generationConfig: GenerationConfig;
  onGenerationConfigChange: (config: GenerationConfig) => void;
  onGeneratePersona: () => Promise<void>;
  onBackToWizard: () => void;
}

const ProviderConfigScreen: React.FC<ProviderConfigScreenProps> = ({
  generationConfig,
  onGenerationConfigChange,
  onGeneratePersona,
  onBackToWizard,
}) => {
  const [touched, setTouched] = useState(false);

  const localError = useMemo(() => {
    if (generationConfig.provider !== "local") {
      return null;
    }
    return validateLocalBaseUrl(generationConfig.localBaseUrl);
  }, [generationConfig.provider, generationConfig.localBaseUrl]);

  const apiKeyError = useMemo(() => {
    const { provider, apiKey } = generationConfig;
    if (provider === "local") {
      return null;
    }
    if (provider === "gemini" && apiKey.trim().length === 0) {
      return null;
    }
    if (!isApiKeySufficient(provider, apiKey)) {
      return `API key must be at least ${MIN_API_KEY_LENGTH} characters.`;
    }
    return null;
  }, [generationConfig]);

  const canSubmit = useMemo(() => {
    if (generationConfig.provider === "local") {
      return localError === null && generationConfig.localBaseUrl.trim() !== "";
    }
    return apiKeyError === null && isApiKeySufficient(
      generationConfig.provider,
      generationConfig.apiKey
    );
  }, [generationConfig, localError, apiKeyError]);

  const showApiKeyError = touched && apiKeyError;
  const showLocalError = touched && localError;

  const handleProviderChange = (value: LlmProvider) => {
    onGenerationConfigChange({
      ...INITIAL_GENERATION_CONFIG,
      provider: value,
    });
    setTouched(false);
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onGenerationConfigChange({
      ...generationConfig,
      apiKey: event.target.value,
    });
  };

  const handleLocalUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onGenerationConfigChange({
      ...generationConfig,
      localBaseUrl: event.target.value,
    });
  };

  const handleSubmit = async () => {
    setTouched(true);
    if (!canSubmit) {
      return;
    }
    await onGeneratePersona();
  };

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 animate-fade-in-up">
      <div className="mb-8">
        <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
          <span>MODEL &amp; CREDENTIALS</span>
          <span>READY TO GENERATE</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out" />
        </div>
      </div>

      <form
        className="glass-panel rounded-2xl p-8 shadow-2xl border-t border-white/10 space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        onKeyDown={handleFormKeyDown}>
        <header>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            Choose how to run the architect
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Pick a frontier API and enter your key, or point to a local
            OpenAI-compatible endpoint. This choice is reused in Prompt Builder.
          </p>
        </header>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-200 mb-2">
            Provider
          </legend>
          <div
            className="space-y-3"
            role="radiogroup"
            aria-label="LLM provider">
            {PROVIDER_OPTIONS.map((opt) => {
              const selected = generationConfig.provider === opt.value;
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
                    selected
                      ? "border-indigo-500/60 bg-indigo-500/10"
                      : "border-slate-700 bg-slate-900/50 hover:border-slate-600"
                  )}>
                  <input
                    type="radio"
                    name="llm-provider"
                    value={opt.value}
                    checked={selected}
                    onChange={() => handleProviderChange(opt.value)}
                    className="mt-1 h-4 w-4 accent-indigo-500"
                    aria-describedby={`hint-${opt.value}`}
                  />
                  <span className="flex-1">
                    <span className="block text-white font-semibold">
                      {opt.label}
                    </span>
                    <span
                      id={`hint-${opt.value}`}
                      className="block text-xs text-slate-500 mt-1">
                      {opt.hint}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {generationConfig.provider === "local" ? (
          <div>
            <label
              htmlFor="local-base-url"
              className="text-sm font-semibold text-slate-200">
              Local server base URL
            </label>
            <input
              id="local-base-url"
              type="url"
              value={generationConfig.localBaseUrl}
              onChange={handleLocalUrlChange}
              placeholder="http://127.0.0.1:1234"
              autoComplete="off"
              aria-invalid={Boolean(showLocalError)}
              aria-describedby={
                showLocalError ? "local-url-error" : "local-url-help"
              }
              className={cn(
                "mt-2 w-full rounded-lg bg-slate-900 text-slate-100 px-4 py-3 border outline-none font-mono text-sm",
                showLocalError
                  ? "border-red-500/60 focus:border-red-400"
                  : "border-slate-700 focus:border-indigo-500"
              )}
            />
            <p id="local-url-help" className="mt-2 text-xs text-slate-500">
              We call{" "}
              <span className="font-mono text-slate-400">
                /v1/chat/completions
              </span>{" "}
              on this host. Use localhost or 127.0.0.1 only.
            </p>
            {showLocalError && (
              <p
                id="local-url-error"
                role="alert"
                className="mt-2 text-sm text-red-300">
                {localError}
              </p>
            )}
          </div>
        ) : (
          <div>
            <label
              htmlFor="api-key"
              className="text-sm font-semibold text-slate-200">
              API key
              {generationConfig.provider === "gemini" && (
                <span className="text-slate-500 font-normal">
                  {" "}
                  (optional if server has GEMINI_API_KEY)
                </span>
              )}
            </label>
            <input
              id="api-key"
              type="password"
              value={generationConfig.apiKey}
              onChange={handleApiKeyChange}
              placeholder={
                generationConfig.provider === "gemini"
                  ? "AIza… or leave empty for server default"
                  : "Your API key"
              }
              autoComplete="off"
              aria-invalid={Boolean(showApiKeyError)}
              aria-describedby={
                showApiKeyError ? "api-key-error" : undefined
              }
              className={cn(
                "mt-2 w-full rounded-lg bg-slate-900 text-slate-100 px-4 py-3 border outline-none font-mono text-sm",
                showApiKeyError
                  ? "border-red-500/60 focus:border-red-400"
                  : "border-slate-700 focus:border-indigo-500"
              )}
            />
            {showApiKeyError && (
              <p
                id="api-key-error"
                role="alert"
                className="mt-2 text-sm text-red-300">
                {apiKeyError}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={onBackToWizard}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors text-slate-300 hover:text-white hover:bg-white/5"
            aria-label="Back to wizard questions">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to questions
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs text-slate-500 font-mono">
              CMD + ENTER to generate
            </span>
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "group relative inline-flex items-center px-6 py-3 text-sm font-bold text-white rounded-full transition-all duration-300",
                !canSubmit
                  ? "bg-slate-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-indigo-500/30"
              )}
              aria-label="Generate persona with selected provider">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Generate persona
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProviderConfigScreen;
