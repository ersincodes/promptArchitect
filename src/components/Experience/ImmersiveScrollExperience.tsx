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
    label: "Tone palette",
    details: "Voice, guardrails, fallbacks.",
  },
  {
    label: "Rituals",
    details: "Cadence + daily checkpoints.",
  },
  {
    label: "Edge cases",
    details: "What not to do and how to recover.",
  },
];

const MODULES = [
  { title: "Voice layer", copy: "Swap between advisor and analyst modes." },
  { title: "Guardrails", copy: "Auto inject constraints per channel." },
  { title: "Escalations", copy: "Route unknowns to human partner." },
];

const OUTPUTS = [
  {
    title: "Persona brief",
    body: "“Act as a growth-strategist with calm optimism.”",
  },
  {
    title: "Handoff spec",
    body: "Deliver markdown briefs with KPI tables + risks.",
  },
  {
    title: "Launch ritual",
    body: "Daily sync at 9am, include latest win + blocker.",
  },
];

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
      gsap
        .timeline({
          scrollTrigger: {
            trigger: blueprint,
            start: "center center",
            end: "+=220%",
            scrub: true,
            pin: true,
          },
        })
        .fromTo(
          blueprint.querySelector(".blueprint-heading"),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(
          blueprintCards.current,
          { opacity: 0, y: 65 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.4 },
          "<50%"
        )
        .to(blueprintCards.current, {
          opacity: 0.3,
          duration: 0.4,
          stagger: 0.2,
        });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: composer,
            start: "center center",
            end: "+=240%",
            scrub: true,
            pin: true,
          },
        })
        .fromTo(
          composer.querySelector(".composer-canvas"),
          { opacity: 0.4, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.6 }
        )
        .fromTo(
          moduleRefs.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 },
          "<30%"
        )
        .fromTo(
          composer.querySelectorAll(".composer-copy"),
          { opacity: 0, x: 35 },
          { opacity: 1, x: 0, stagger: 0.2, duration: 0.4 },
          "<40%"
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: output,
            start: "center center",
            end: "+=200%",
            scrub: true,
            pin: true,
          },
        })
        .fromTo(
          output.querySelector(".output-heading"),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
        .fromTo(
          outputRefs.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, stagger: 0.25, duration: 0.4 },
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
        ref={blueprintRef}
        className="relative rounded-[36px] border border-white/5 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-900 px-8 py-16 text-white shadow-[0_40px_120px_rgba(2,6,23,0.75)]">
        <div className="blueprint-heading space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">
            Blueprint reel
          </p>
          <h2 className="text-4xl font-semibold">
            Scroll to watch the persona blueprint assemble.
          </h2>
          <p className="max-w-xl text-slate-300">
            Each swipe locks a new panel into place. Hover to feel the depth,
            scroll to advance through the flow.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {BLUEPRINT_STEPS.map((step, index) => (
            <div
              key={step.label}
              ref={(element) => {
                blueprintCards.current[index] = element;
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left"
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
                className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 last:mb-0">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="uppercase tracking-[0.35em]">
                    {module.title}
                  </span>
                  <span className="text-xs text-slate-500">Slot</span>
                </div>
                <p className="mt-3 text-base text-white">{module.copy}</p>
              </div>
            ))}
          </div>
          <div className="space-y-6 text-slate-300">
            <div className="composer-copy space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                Interactive composer
              </p>
              <h3 className="text-3xl font-semibold text-white">
                Drag modules into place while guardrails snap into context.
              </h3>
            </div>
            <p className="composer-copy">
              Scroll to drop voice, guardrail, and escalation layers into the
              canvas. Each panel reacts with micro-parallax so it feels alive.
            </p>
            <p className="composer-copy">
              Finish the scroll to prime your runbook before launching the real
              Prompt Architect flow.
            </p>
          </div>
        </div>
      </div>

      <div
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
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
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
            <span ref={metricRef}>00</span>% fewer rewrites
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
