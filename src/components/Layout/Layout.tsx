import React from "react";
import { BrainCircuit, Sparkles } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  onReset?: () => void;
  showReset?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  onReset,
  showReset = true,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl"></div>
      </div>

      <header className="relative z-10 p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div
          className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
          onClick={showReset ? onReset : undefined}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              showReset && onReset?.();
            }
          }}
          aria-label="Reset and go to home">
          <div className="bg-gradient-to-tr from-primary to-secondary w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg hidden sm:block">
            AI Architect
          </span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto py-8 md:py-16 flex-grow flex flex-col justify-center">
        {children}
      </main>

      <footer className="relative z-10 text-center py-8 text-slate-600 text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://www.ersinbahar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 transition-colors">
            Ersin Bahar
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
};
