import React from "react";

type CarouselNavigationProps = {
  totalItems: number;
  activeIndex: number;
  itemLabels: string[];
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
};

const ChevronLeftIcon: React.FC = () => (
  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  totalItems,
  activeIndex,
  itemLabels,
  onPrev,
  onNext,
  onGoTo,
}) => {
  return (
    <>
      {/* Navigation arrows */}
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-8 top-1/2 z-40 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/20"
        aria-label="Previous card">
        <ChevronLeftIcon />
      </button>

      <button
        type="button"
        onClick={onNext}
        className="absolute right-8 top-1/2 z-40 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/20"
        aria-label="Next card">
        <ChevronRightIcon />
      </button>

      {/* Dot indicators */}
      <div className="absolute -bottom-16 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={itemLabels[index]}
            type="button"
            onClick={() => onGoTo(index)}
            className={`h-3 w-3 rounded-full border transition-all duration-300 ${
              index === activeIndex
                ? "w-10 border-emerald-400/60 bg-emerald-400"
                : "border-white/30 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to ${itemLabels[index]}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="absolute -bottom-28 left-1/2 z-40 flex -translate-x-1/2 items-center gap-5 text-sm text-white/40">
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-mono">
            ←
          </kbd>
          <kbd className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-mono">
            →
          </kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded border border-white/20 bg-white/5 px-2 py-0.5 font-mono">
            Esc
          </kbd>
          Close
        </span>
      </div>
    </>
  );
};

