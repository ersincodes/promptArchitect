import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ImmersiveScrollExperienceProps {
  onStart: () => void;
}

const BLUEPRINT_STEPS = [
  {
    label: "Role definition",
    details: "Align responsibilities + scope.",
  },
  {
    label: "Tools, frameworks, and concepts",
    details: "Technologies, mental models, software, or theories.",
  },
  {
    label: "Behavior and reasoning",
    details: "Checkpoints and recovery strategies.",
  },
  {
    label: "Principles and methodology",
    details: "Workflow, principles, and architectural rules.",
  },
];

const MODULES = [
  {
    title: "🎨 Image Generation",
    copy: "Generate images based on the prompt.",
  },
  { title: "💻 Coding", copy: "Have a collaborative coding session." },
  { title: "💡 Brainstorming", copy: "Brainstorm ideas and solutions." },
];

const OUTPUTS = [
  {
    title: "Persona brief",
    body: "“Act as a growth-strategist with calm optimism.”",
  },
  {
    title: "Json prompts",
    body: "JSON Prompt Models and Techniques will be updated to the latest version.",
  },
  {
    title: "Impressive Results",
    body: "Proved to be effective in any kind of work with any AI tool.",
  },
];

const SCROLL_DEFAULTS = { duration: 0.7, ease: "power2.out" };

const createPinnedTimeline = (section: HTMLElement, endValue = "+=220%") =>
  gsap.timeline({
    defaults: SCROLL_DEFAULTS,
    scrollTrigger: {
      trigger: section,
      start: "center center",
      end: endValue,
      scrub: 1.1,
      anticipatePin: 1,
      pin: true,
    },
  });

export const ImmersiveScrollExperience: React.FC<
  ImmersiveScrollExperienceProps
> = ({ onStart }) => {
  const blueprintRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const blueprintCards = useRef<(HTMLDivElement | null)[]>([]);
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metricRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const blueprint = blueprintRef.current;
    const composer = composerRef.current;
    const output = outputRef.current;

    if (!blueprint || !composer || !output) {
      return;
    }

    const ctx = gsap.context(() => {
      const blueprintTimeline = createPinnedTimeline(blueprint, "+=240%");
      blueprintTimeline
        .fromTo(
          blueprint.querySelector(".blueprint-heading"),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0 }
        )
        .fromTo(
          blueprintCards.current,
          { opacity: 0, y: 50, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.18 },
          "<40%"
        )
        .to(blueprintCards.current, {
          opacity: 0.4,
          y: 10,
          stagger: 0.15,
        });

      const composerTimeline = createPinnedTimeline(composer, "+=260%");
      composerTimeline
        .fromTo(
          composer.querySelector(".composer-canvas"),
          { opacity: 0.45, scale: 0.95 },
          { opacity: 1, scale: 1 }
        )
        .fromTo(
          moduleRefs.current,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, stagger: 0.2 },
          "<35%"
        )
        .fromTo(
          composer.querySelectorAll(".composer-copy"),
          { opacity: 0, x: 32 },
          { opacity: 1, x: 0, stagger: 0.18 },
          "<35%"
        );

      const outputTimeline = createPinnedTimeline(output, "+=220%");
      outputTimeline
        .fromTo(
          output.querySelector(".output-heading"),
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0 }
        )
        .fromTo(
          outputRefs.current,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, stagger: 0.22 },
          "<40%"
        )
        .fromTo(
          metricRef.current,
          { textContent: "00" },
          {
            textContent: "92",
            snap: { textContent: 1 },
            duration: 1.5,
          },
          "<20%"
        );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="mt-24 space-y-32">
      <div
        id="immersive-blueprint"
        ref={blueprintRef}
        className="relative rounded-[36px] border border-white/5 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-900 px-8 py-16 text-white shadow-[0_40px_120px_rgba(2,6,23,0.75)]">
        <div className="blueprint-heading space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">
            Mastering the Prompt
          </p>
          <h2 className="text-4xl font-semibold">
            Unlock the full potential of AI
          </h2>
          <p className="max-w-xl text-slate-300">
            Effective prompts yields accurate, relevant, and high-quality
            results every time.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {BLUEPRINT_STEPS.map((step, index) => (
            <div
              key={step.label}
              ref={(element) => {
                blueprintCards.current[index] = element;
              }}
              className="relative overflow-hidden rounded-3xl border border-indigo-400/15 bg-slate-950/40 p-5 text-left shadow-[0_25px_60px_rgba(2,6,23,0.45)] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_65%)] before:opacity-90 before:content-['']"
              tabIndex={0}
              aria-label={`${step.label} blueprint card`}>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                {step.label}
              </p>
              <p className="mt-2 text-lg text-slate-100">{step.details}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        id="immersive-composer"
        ref={composerRef}
        className="relative rounded-[36px] border border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-8 py-16 text-white shadow-[0_40px_120px_rgba(2,6,23,0.75)]">
        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div
            className="composer-canvas relative rounded-[32px] border border-white/5 bg-white/5 p-8 backdrop-blur-lg"
            role="img"
            tabIndex={0}
            aria-label="Composer canvas mock interface">
            {MODULES.map((module, index) => (
              <div
                key={module.title}
                ref={(element) => {
                  moduleRefs.current[index] = element;
                }}
                className="relative mb-6 overflow-hidden rounded-2xl border border-cyan-400/15 bg-slate-950/40 p-4 text-white/90 shadow-[0_18px_45px_rgba(8,47,73,0.45)] last:mb-0 before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.35),_transparent_70%)] before:opacity-90 before:content-['']">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="uppercase tracking-[0.35em]">
                    {module.title}
                  </span>
                </div>
                <p className="mt-3 text-base text-white">{module.copy}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6 text-slate-300">
            <div className="composer-copy space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                Interactive Collaboration
              </p>
              <h3 className="text-3xl font-semibold text-white">
                Drag your persona next to you while producing or solving
                problems.
              </h3>
            </div>
            <p className="composer-copy">
              After you complete the 5 steps, your persona will be ready to for
              generating images, coding, or brainstorming ideas and all.
            </p>
            <p className="composer-copy">
              You can also take your persona with you to any other tool that
              supports implementing rules.
            </p>
          </div>
        </div>
      </div>

      <div
        id="immersive-output"
        ref={outputRef}
        className="relative rounded-[36px] border border-white/5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-8 py-16 text-white shadow-[0_40px_120px_rgba(2,6,23,0.75)]">
        <div className="output-heading space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300">
            Output lab
          </p>
          <h3 className="text-4xl font-semibold">
            Witness the final brief before you go hands-on.
          </h3>
        </div>
        <div className="mt-12 space-y-6">
          {OUTPUTS.map((output, index) => (
            <div
              key={output.title}
              ref={(element) => {
                outputRefs.current[index] = element;
              }}
              className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-slate-950/50 p-6 shadow-[0_25px_60px_rgba(4,47,46,0.55)] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.3),_transparent_70%)] before:opacity-90 before:content-['']"
              tabIndex={0}
              aria-label={`${output.title} preview`}>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {output.title}
              </p>
              <p className="mt-3 text-lg text-slate-100">{output.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-200">
            <span ref={metricRef}>00</span>% MORE ACCURATE RESULTS
          </span>
          <button
            onClick={onStart}
            className="rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.45)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Jump into the Prompt Architect wizard">
            Build your persona now
          </button>
        </div>
      </div>
    </section>
  );
};
