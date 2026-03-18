interface WaveSeparatorProps {
  className?: string;
  flip?: boolean;
}

export function WaveSeparator({ className = "", flip = false }: WaveSeparatorProps) {
  return (
    <div className={`w-full overflow-hidden pointer-events-none ${className}`} style={flip ? { transform: "scaleY(-1)" } : undefined}>
      <svg
        className="w-[200%] h-[40px] pf-wave-scroll"
        viewBox="0 0 2400 50"
        preserveAspectRatio="none"
      >
        <path
          d="M0,25 C200,50 400,0 600,25 C800,50 1000,0 1200,25 C1400,50 1600,0 1800,25 C2000,50 2200,0 2400,25 L2400,50 L0,50 Z"
          fill="rgba(202,255,51,0.06)"
        />
      </svg>
    </div>
  );
}
