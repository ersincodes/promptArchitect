import React from "react";

type DecorativeBlursProps = {
  variant?: "inline" | "overlay";
};

export const DecorativeBlurs: React.FC<DecorativeBlursProps> = ({
  variant = "inline",
}) => {
  if (variant === "overlay") {
    return (
      <>
        <div className="pointer-events-none absolute left-10 top-20 h-64 w-64 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-20 right-10 h-56 w-56 rounded-full bg-gradient-to-r from-rose-500/20 to-orange-400/20 blur-[100px]" />
      </>
    );
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[36px] bg-gradient-to-b from-white/5 via-transparent to-white/0" />
      <div className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full bg-gradient-to-r from-indigo-500/30 to-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 right-4 h-40 w-40 rounded-full bg-gradient-to-r from-rose-500/30 to-orange-400/30 blur-[120px]" />
    </>
  );
};

