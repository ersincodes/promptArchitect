import React from "react";
import type { CardSize, ParallaxLayer } from "../types";

type FeatureCardProps = {
  layer: ParallaxLayer;
  size?: CardSize;
  index?: number;
  totalItems?: number;
  isActive?: boolean;
  onRef?: (element: HTMLDivElement | null) => void;
};

const CARD_STYLES: Record<CardSize, {
  container: string;
  figure: string;
  imageContainer: string;
  contentSpacing: string;
  badge: string;
  title: string;
  description: string;
}> = {
  compact: {
    container: "rounded-3xl border border-white/15 bg-white/5 p-4 text-white shadow-[0_30px_80px_rgba(15,23,42,0.55)] transition-transform duration-500",
    figure: "mb-4",
    imageContainer: "h-36",
    contentSpacing: "space-y-1",
    badge: "px-3 py-1 text-xs",
    title: "text-xl",
    description: "text-sm",
  },
  large: {
    container: "rounded-[40px] border border-white/20 bg-slate-900/90 p-8 text-white shadow-[0_60px_140px_rgba(2,6,23,0.75)] backdrop-blur-xl",
    figure: "mb-6",
    imageContainer: "h-80 rounded-3xl",
    contentSpacing: "space-y-3",
    badge: "px-4 py-2 text-sm",
    title: "text-3xl",
    description: "text-base leading-relaxed",
  },
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  layer,
  size = "compact",
  index,
  totalItems,
  isActive,
  onRef,
}) => {
  const styles = CARD_STYLES[size];

  const ariaLabel =
    index !== undefined && totalItems !== undefined
      ? `${layer.title} - ${index + 1} of ${totalItems}`
      : `${layer.title} interactive card`;

  return (
    <article
      ref={onRef}
      data-depth={layer.depth}
      tabIndex={0}
      aria-label={ariaLabel}
      aria-hidden={isActive !== undefined ? !isActive : undefined}
      className={styles.container}
      style={size === "large" ? { transformStyle: "preserve-3d" } : undefined}>
      <figure className={styles.figure}>
        <div
          className={`relative w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${layer.accent} shadow-[0_10px_40px_rgba(15,23,42,0.45)] ${styles.imageContainer}`}>
          <img
            src={layer.imageSrc}
            alt={layer.imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
        </div>
      </figure>
      <div className={styles.contentSpacing}>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 uppercase tracking-[0.25em] text-slate-200 ${styles.badge}`}>
          {layer.badge}
        </span>
        <h3 className={`font-semibold ${styles.title}`}>{layer.title}</h3>
        <p className={`text-slate-300 ${styles.description}`}>
          {layer.description}
        </p>
      </div>
    </article>
  );
};

