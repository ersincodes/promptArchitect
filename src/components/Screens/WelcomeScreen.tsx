import React from "react";
import { Play, ArrowUpRight } from "lucide-react";
import { ParallaxShowcase } from "../Parallax/ParallaxShowcase";
import { ImmersiveScrollExperience } from "../Experience/ImmersiveScrollExperience";

interface WelcomeScreenProps {
  onStart: () => void;
}

const BADGES = [
  "Coding",
  "Brainstorming",
  "Writing",
  "Strategy",
  "Design",
  "Marketing",
];
const METRICS = [
  { label: "Workflow steps", value: "4 curated prompts" },
  { label: "Avg. build time", value: "2 mins end-to-end" },
  { label: "AI assistants", value: "All major copilots" },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <>
      <section className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-lg  bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            AI Prompt Architect
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl leading-tight text-white md:text-6xl md:leading-tight">
              Design elite system Personas and Prompts in minutes
            </h1>
            <p className="text-lg text-slate-400 md:text-xl">
              Feed your copilots with tailored system instructions. Define role,
              tone, rituals, and edge-cases through one guided interview.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onStart}
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_15px_45px_rgba(15,23,42,0.45)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label="Start architecting workflow">
              Start architecting
              <Play className="ml-2 h-4 w-4 fill-current" />
            </button>
            <button
              className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-base font-semibold text-white transition hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              type="button"
              aria-label="View example persona placeholder"
              aria-disabled="true">
              View example
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="px-4 py-1 text-sm bg-white/5 rounded-lg text-slate-400">
                {badge} ops ready
              </span>
            ))}
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400 md:grid-cols-3">
            {METRICS.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <p className="uppercase tracking-[0.35em] text-xs text-slate-600">
                  {metric.label}
                </p>
                <p className="text-base text-slate-100">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <ParallaxShowcase />
      </section>

      <ImmersiveScrollExperience onStart={onStart} />
    </>
  );
};
