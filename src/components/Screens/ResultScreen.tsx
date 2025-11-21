import React, { useState } from "react";
import { Copy, Check, ArrowLeft, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

interface ResultProps {
  persona: string;
  onReset: () => void;
}

const ResultScreen: React.FC<ResultProps> = ({ persona, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(persona);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            Your Architected Persona
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Ready to copy into your favorite AI coding assistant.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onReset}
            className="flex-1 md:flex-none items-center justify-center px-4 py-2 text-sm font-medium text-slate-400 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 flex">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Create New
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center px-6 py-2 text-sm font-bold rounded-lg transition-all shadow-lg",
              copied
                ? "bg-green-500 text-white shadow-green-500/20"
                : "bg-white text-slate-900 hover:bg-slate-100 shadow-white/10"
            )}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative group rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-8 bg-[#1e1e1e] flex items-center px-4 border-b border-slate-700 z-10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <div className="mx-auto text-xs text-slate-500 font-mono">
            system_persona.md
          </div>
        </div>

        <div className="bg-[#0d1117] p-6 pt-12 overflow-x-auto max-h-[70vh] overflow-y-auto custom-scrollbar">
          <pre className="text-sm md:text-base font-mono text-slate-300 whitespace-pre-wrap leading-relaxed selection:bg-primary/30 selection:text-white">
            {persona}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
