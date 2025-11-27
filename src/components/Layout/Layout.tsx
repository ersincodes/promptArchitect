import React from "react";
import { BrainCircuit, Link } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  onReset?: () => void;
  showReset?: boolean;
  showNavLinks?: boolean;
}

type NavLinkConfig = {
  label: string;
  targetId: string;
  offset?: number;
  offsetRatio?: number;
};

const NAV_LINKS: NavLinkConfig[] = [
  { label: "Product", targetId: "immersive-blueprint", offset: 120 },
  { label: "Solutions", targetId: "immersive-composer", offsetRatio: 1 },
  { label: "Resources", targetId: "immersive-output", offset: 120 },
];

export const Layout: React.FC<LayoutProps> = ({
  children,
  onReset,
  showReset = true,
  showNavLinks = true,
}) => {
  const handleNavClick = ({
    targetId,
    offset = 0,
    offsetRatio = 0,
  }: NavLinkConfig) => {
    if (typeof window === "undefined") {
      return;
    }

    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      return;
    }

    const headerHeight =
      document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const viewportHeight = window.innerHeight;

    const targetPosition =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      headerHeight +
      offset +
      viewportHeight * offsetRatio;
    const clampedPosition = Math.min(
      targetPosition,
      document.documentElement.scrollHeight - window.innerHeight
    );

    window.scrollTo({ top: clampedPosition, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.08),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(120deg,_transparent_0%,_transparent_35%,_rgba(99,102,241,0.3)_50%,_transparent_65%,_transparent_100%)]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-30">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
          <div
            className="flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-sm text-slate-300 shadow-lg shadow-black/40 transition hover:translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
            onClick={showReset ? onReset : undefined}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                showReset && onReset?.();
              }
            }}
            aria-label="Reset flow and go to home">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-secondary">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-md uppercase tracking-[0.3em] text-white">
                Prompty
              </span>
            </div>
          </div>

          {showNavLinks && (
            <nav className="hidden gap-6 text-sm text-slate-400 md:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  className="rounded-full px-3 py-2 text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-indigo-400/70"
                  type="button"
                  onClick={() => handleNavClick(link)}
                  aria-label={`Jump to ${link.label} section`}>
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            {showReset && (
              <button
                onClick={onReset}
                className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/30 hover:text-white md:flex"
                aria-label="Reset flow">
                Reset flow
              </button>
            )}
            <button
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 shadow-[0_15px_45px_rgba(15,23,42,0.45)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              type="button"
              aria-label="Generate Image">
              <a
                href="https://trendy-ai-xi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer">
                Generate Image
              </a>
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </header>

      <main className="relative z-10 flex flex-1 justify-center px-6 pb-16 pt-32">
        <div className="w-full max-w-6xl">{children}</div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://www.ersinbahar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 transition hover:text-white">
              Ersin Bahar
            </a>
            . All rights reserved.
          </p>
          <p className="text-slate-600">
            Crafted for builders of AI-first workflows.
          </p>
        </div>
      </footer>
    </div>
  );
};
