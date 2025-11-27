import type { FloatingChip, ParallaxLayer } from "./types";

export const PARALLAX_LAYERS: ParallaxLayer[] = [
  {
    id: "workflow-thread",
    title: "Start with a clear role",
    description: "Define the core role and expertise level.",
    badge: "Step 1",
    depth: 0.22,
    layout: "top-32 right-4 w-60 md:w-72",
    accent: "from-emerald-500/40 to-cyan-500/10",
    imageSrc: "/assets/images/step1.png",
    imageAlt: "Workflow stepper detailing first automation pass",
  },
  {
    id: "core-persona",
    title: "Define the output style",
    description:
      "Forward all the information and define the output style preferences.",
    badge: "Step 1-5",
    depth: 0.12,
    layout: "top-6 left-4 w-64 md:w-72",
    accent: "from-indigo-500/40 to-purple-500/10",
    imageSrc: "/assets/images/step5.png",
    imageAlt: "Persona output preview showing structured tone guidance",
  },
  {
    id: "persona-ready",
    title: "Ready to use",
    description: "The persona is ready to use in your AI assistant.",
    badge: "Persona Ready",
    depth: 0.12,
    layout: "top-6 left-4 w-64 md:w-72",
    accent: "from-indigo-500/40 to-purple-500/10",
    imageSrc: "/assets/images/persona-output.png",
    imageAlt: "Persona output preview showing structured tone guidance",
  },
  {
    id: "persona-metrics",
    title: "A Prompt from the Persona",
    description: "Generate a prompt from the persona.",
    badge: "Generate a prompt",
    depth: 0.35,
    layout: "bottom-4 left-6 w-72 md:w-80",
    accent: "from-cyan-900/60 to-emerald-900/10",
    imageSrc: "/assets/images/generate-prompt.png",
    imageAlt: "Prompt generation dashboard with analytic overlays",
  },
];

export const INLINE_PARALLAX_LAYER_IDS: ParallaxLayer["id"][] = [
  "workflow-thread",
  "core-persona",
  "persona-metrics",
];

export const FLOATING_CHIPS: FloatingChip[] = [
  {
    id: "status-chip",
    label: "Click here",
    position: "top-10 right-12",
  },
  {
    id: "sync-chip",
    label: "Click here",
    position: "bottom-20 right-4",
  },
];

export const CAROUSEL_CONFIG = {
  offsetPrev: -720,
  offsetNext: 720,
  offsetHidden: 900,
  scaleInactive: 0.7,
  opacityAdjacent: 0.35,
  rotationAngle: 20,
  animationDuration: 0.6,
  perspective: 1600,
} as const;

export const PARALLAX_CONFIG = {
  perspective: 1200,
  rotationMultiplier: 8,
  depthMultiplier: 25,
  scrollDepthStart: -20,
  scrollDepthEnd: 30,
  scrollXOffset: -8,
} as const;
