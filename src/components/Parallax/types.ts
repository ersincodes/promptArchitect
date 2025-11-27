export type ParallaxLayer = {
  id: string;
  title: string;
  description: string;
  badge: string;
  depth: number;
  layout: string;
  accent: string;
  imageSrc: string;
  imageAlt: string;
};

export type FloatingChip = {
  id: string;
  label: string;
  position: string;
};

export type CardSize = "compact" | "large";
