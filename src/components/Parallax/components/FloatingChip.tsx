import React from "react";
import type { FloatingChip as FloatingChipType } from "../types";

type FloatingChipProps = {
  chip: FloatingChipType;
  onRef?: (element: HTMLDivElement | null) => void;
};

export const FloatingChip: React.FC<FloatingChipProps> = ({ chip, onRef }) => {
  return (
    <div
      ref={onRef}
      className={`absolute ${chip.position} inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100 shadow-lg`}
      aria-label={chip.label}>
      <span className="h-2 w-2 rounded-full bg-emerald-300" />
      {chip.label}
    </div>
  );
};

