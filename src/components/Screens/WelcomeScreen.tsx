import React from "react";
import { BrainCircuit, Play } from "lucide-react";
import { cn } from "../../lib/utils";

interface WelcomeScreenProps {
  onStart: () => void;
}

const BADGES = ["Coding", "Brainstorming", "Writing", "Strategy"];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-3xl mb-8 border border-white/5 shadow-2xl shadow-indigo-500/10">
        <BrainCircuit className="w-16 h-16 text-indigo-400" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-6 tracking-tight">
        Persona Architect
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
        Stop writing generic personas. Build{" "}
        <span className="text-indigo-400 font-semibold">expert-level</span>{" "}
        system instructions tailored to your exact role, workflow, and creative
        needs.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {BADGES.map((badge) => (
          <div
            key={badge}
            className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 text-sm">
            {badge}
          </div>
        ))}
      </div>
      <button
        onClick={onStart}
        className={cn(
          "mt-10 group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg",
          "hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/25",
          "flex items-center"
        )}
        aria-label="Start Architecting">
        Start Architecting
        <Play className="w-5 h-5 ml-2 fill-current group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
