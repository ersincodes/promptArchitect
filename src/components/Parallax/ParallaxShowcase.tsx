import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ParallaxLayer = {
  id: string;
  title: string;
  description: string;
  badge: string;
  depth: number;
  layout: string;
  accent: string;
};

type FloatingChip = {
  id: string;
  label: string;
  position: string;
};

const PARALLAX_LAYERS: ParallaxLayer[] = [
  {
    id: "core-persona",
    title: "Core Persona",
    description: "System strategist blueprint with tone + rituals.",
    badge: "Live context",
    depth: 0.12,
    layout: "top-6 left-4 w-64 md:w-72",
    accent: "from-indigo-500/40 to-purple-500/10",
  },
  {
    id: "workflow-thread",
    title: "Workflow Thread",
    description: "Edge-case handling sequence with fallback logic.",
    badge: "4 touchpoints",
    depth: 0.22,
    layout: "top-32 right-4 w-60 md:w-72",
    accent: "from-emerald-500/40 to-cyan-500/10",
  },
  {
    id: "persona-metrics",
    title: "Persona Metrics",
    description: "Reduction in rewrites after deployment.",
    badge: "92% uplift",
    depth: 0.35,
    layout: "bottom-4 left-6 w-72 md:w-80",
    accent: "from-orange-500/40 to-rose-500/10",
  },
];

const FLOATING_CHIPS: FloatingChip[] = [
  {
    id: "status-chip",
    label: "High fidelity brief",
    position: "top-10 right-12",
  },
  {
    id: "sync-chip",
    label: "Multimodal ready",
    position: "bottom-20 right-4",
  },
];

export const ParallaxShowcase: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    const context = gsap.context(() => {
      layerRefs.current.forEach((layer) => {
        if (!layer) {
          return;
        }

        const depth = Number(layer.dataset.depth ?? 0.2);

        gsap.fromTo(
          layer,
          {
            yPercent: depth * -20,
            opacity: 0.4,
          },
          {
            yPercent: depth * 30,
            xPercent: depth * -8,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scene,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      floatingRefs.current.forEach((chip, index) => {
        if (!chip) {
          return;
        }

        gsap.to(chip, {
          y: index % 2 === 0 ? 12 : -14,
          x: index % 2 === 0 ? -6 : 8,
          rotation: index % 2 === 0 ? 4 : -4,
          duration: 3.5 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, scene);

    const handlePointerMove = (event: PointerEvent) => {
      if (!sceneRef.current) {
        return;
      }

      const bounds = sceneRef.current.getBoundingClientRect();
      const xDelta = (event.clientX - bounds.left) / bounds.width - 0.5;
      const yDelta = (event.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(sceneRef.current, {
        rotationY: xDelta * -8,
        rotationX: yDelta * 8,
        transformPerspective: 1200,
        duration: 0.8,
        ease: "power3.out",
      });

      layerRefs.current.forEach((layer) => {
        if (!layer) {
          return;
        }

        const depth = Number(layer.dataset.depth ?? 0.2);
        gsap.to(layer, {
          xPercent: depth * xDelta * 25,
          duration: 0.7,
          ease: "expo.out",
        });
      });
    };

    scene.addEventListener("pointermove", handlePointerMove);

    return () => {
      scene.removeEventListener("pointermove", handlePointerMove);
      context.revert();
    };
  }, []);

  return (
    <div className="relative h-[520px] w-full md:h-[560px]">
      <div
        ref={sceneRef}
        className="relative isolate h-full w-full overflow-visible rounded-[36px] border border-white/10 bg-slate-900/50 p-6 shadow-[0_40px_120px_rgba(2,6,23,0.65)] backdrop-blur-[20px]"
        aria-label="Interactive parallax showcase"
        tabIndex={0}
        role="img">
        <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-b from-white/5 via-transparent to-white/0" />
        <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-gradient-to-r from-indigo-500/30 to-cyan-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 right-4 h-40 w-40 rounded-full bg-gradient-to-r from-rose-500/30 to-orange-400/30 blur-[120px]" />

        {PARALLAX_LAYERS.map((layer, index) => (
          <article
            key={layer.id}
            ref={(element) => {
              layerRefs.current[index] = element;
            }}
            data-depth={layer.depth}
            tabIndex={0}
            aria-label={`${layer.title} card placeholder`}
            className={`absolute ${layer.layout} rounded-3xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_30px_80px_rgba(15,23,42,0.55)]`}>
            <div
              className={`mb-4 flex h-32 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${layer.accent} text-sm text-white/70`}>
              Mock cover image slot
            </div>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-200">
                {layer.badge}
              </span>
              <h3 className="text-xl font-semibold">{layer.title}</h3>
              <p className="text-sm text-slate-300">{layer.description}</p>
            </div>
          </article>
        ))}

        {FLOATING_CHIPS.map((chip, index) => (
          <div
            key={chip.id}
            ref={(element) => {
              floatingRefs.current[index] = element;
            }}
            className={`absolute ${chip.position} inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 shadow-lg`}
            aria-label={chip.label}>
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            {chip.label}
          </div>
        ))}
      </div>
    </div>
  );
};


