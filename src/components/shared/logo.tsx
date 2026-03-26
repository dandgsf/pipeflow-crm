interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { mark: "w-5 h-5 text-[10px]", text: "text-sm", gap: "gap-2" },
    md: { mark: "w-7 h-7 text-[13px]", text: "text-base", gap: "gap-2.5" },
    lg: { mark: "w-9 h-9 text-[16px]", text: "text-xl", gap: "gap-3" },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      {/* Mark — quadrado com "P" */}
      <div
        className={`${s.mark} rounded-md bg-pf-accent flex items-center justify-center font-display font-extrabold text-pf-bg shrink-0`}
      >
        P
      </div>
      {/* Wordmark */}
      <span className={`font-display font-bold ${s.text} text-pf-text tracking-tight`}>
        PipeFlow
        <span
          className="inline-block w-5 h-[2px] ml-1.5 bg-pf-accent rounded-full pf-flow-pulse align-middle"
          style={{ verticalAlign: "middle" }}
        />
      </span>
    </div>
  );
}
