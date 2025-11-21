import React from "react";
import { Cpu } from "lucide-react";

export const GeneratingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 animate-pulse">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full"></div>
        <Cpu className="relative w-20 h-20 text-indigo-400 animate-spin-slow" />
      </div>
      <h2 className="text-2xl font-bold text-white mt-8 mb-2">
        Synthesizing Persona
      </h2>
      <p className="text-slate-400">
        Aligning neural pathways with your requirements...
      </p>
    </div>
  );
};
