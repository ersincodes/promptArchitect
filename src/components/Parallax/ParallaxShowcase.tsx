import React, { useCallback, useState } from "react";

import {
  CarouselNavigation,
  DecorativeBlurs,
  FeatureCard,
  FloatingChip,
} from "./components";
import {
  CAROUSEL_CONFIG,
  FLOATING_CHIPS,
  INLINE_PARALLAX_LAYER_IDS,
  PARALLAX_LAYERS,
} from "./constants";
import type { ParallaxLayer } from "./types";
import { useCarousel, useKeyboardNavigation, useParallaxEffect } from "./hooks";

export const ParallaxShowcase: React.FC = () => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Inline parallax effect (only active when not in focus mode)
  const { sceneRef, layerRefs, floatingRefs } = useParallaxEffect({
    isActive: !isFocusMode,
  });

  const inlineParallaxLayers = INLINE_PARALLAX_LAYER_IDS.map((layerId) =>
    PARALLAX_LAYERS.find((layer) => layer.id === layerId)
  ).filter(Boolean) as ParallaxLayer[];

  // Carousel state and animations (only active in focus mode)
  const { activeIndex, cardRefs, handlePrev, handleNext, handleGoTo } =
    useCarousel({
      totalItems: PARALLAX_LAYERS.length,
      isActive: isFocusMode,
    });

  const handleCloseFocus = useCallback(() => {
    setIsFocusMode(false);
  }, []);

  // Keyboard navigation for carousel
  useKeyboardNavigation({
    isActive: isFocusMode,
    onClose: handleCloseFocus,
    onPrev: handlePrev,
    onNext: handleNext,
  });

  const handleActivateFocus = () => {
    if (isFocusMode) {
      return;
    }

    setIsFocusMode(true);
  };

  const handleInlineKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleActivateFocus();
  };

  const handleOverlayContentClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
  };

  return (
    <>
      {/* Inline Scene */}
      {!isFocusMode && (
        <div className="relative h-[680px] w-full md:h-[720px]">
          <div
            ref={sceneRef}
            className="relative isolate h-full w-full cursor-pointer overflow-visible rounded-[36px] border border-white/10 bg-slate-900/60 p-6 shadow-[0_40px_120px_rgba(2,6,23,0.65)] backdrop-blur-[20px] transition-transform duration-500 ease-out hover:border-white/20"
            aria-label="Click to explore parallax showcase"
            tabIndex={0}
            role="button"
            onClick={handleActivateFocus}
            onKeyDown={handleInlineKeyDown}>
            <DecorativeBlurs variant="inline" />

            {inlineParallaxLayers.map((layer, index) => (
              <div
                key={layer.id}
                ref={(element) => {
                  layerRefs.current[index] = element;
                }}
                data-depth={layer.depth}
                className={`absolute ${layer.layout}`}>
                <FeatureCard layer={layer} size="compact" />
              </div>
            ))}

            {FLOATING_CHIPS.map((chip, index) => (
              <FloatingChip
                key={chip.id}
                chip={chip}
                onRef={(element) => {
                  floatingRefs.current[index] = element;
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Focus Mode Overlay */}
      {isFocusMode && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Parallax showcase carousel"
          onClick={handleCloseFocus}>
          <DecorativeBlurs variant="overlay" />

          {/* Carousel */}
          <div
            className="relative flex h-[700px] w-full max-w-7xl items-center justify-center"
            style={{ perspective: `${CAROUSEL_CONFIG.perspective}px` }}
            onClick={handleOverlayContentClick}
            role="region"
            aria-label="Feature carousel"
            aria-roledescription="carousel">
            {/* Carousel cards */}
            {PARALLAX_LAYERS.map((layer, index) => (
              <div
                key={layer.id}
                ref={(element) => {
                  cardRefs.current[index] = element;
                }}
                className="absolute left-1/2 top-1/2 w-[640px] -translate-x-1/2 -translate-y-1/2">
                <FeatureCard
                  layer={layer}
                  size="large"
                  index={index}
                  totalItems={PARALLAX_LAYERS.length}
                  isActive={index === activeIndex}
                />
              </div>
            ))}

            <CarouselNavigation
              totalItems={PARALLAX_LAYERS.length}
              activeIndex={activeIndex}
              itemLabels={PARALLAX_LAYERS.map((layer) => layer.title)}
              onPrev={handlePrev}
              onNext={handleNext}
              onGoTo={handleGoTo}
            />
          </div>
        </div>
      )}
    </>
  );
};
