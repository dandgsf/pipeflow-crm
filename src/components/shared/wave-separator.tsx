interface WaveSeparatorProps {
  flip?: boolean;
}

export function WaveSeparator({ flip = false }: WaveSeparatorProps) {
  return (
    <div
      className="w-full overflow-hidden leading-none"
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
    >
      {/* Double-wide SVG that scrolls infinitely */}
      <div className="pf-wave-scroll flex" style={{ width: "200%" }}>
        <svg
          viewBox="0 0 1440 40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "50%", height: "40px", display: "block" }}
        >
          <path
            d="M0,20 C120,40 240,0 360,20 C480,40 600,0 720,20 C840,40 960,0 1080,20 C1200,40 1320,0 1440,20 L1440,40 L0,40 Z"
            fill="rgba(42,42,46,0.5)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "50%", height: "40px", display: "block" }}
        >
          <path
            d="M0,20 C120,40 240,0 360,20 C480,40 600,0 720,20 C840,40 960,0 1080,20 C1200,40 1320,0 1440,20 L1440,40 L0,40 Z"
            fill="rgba(42,42,46,0.5)"
          />
        </svg>
      </div>
    </div>
  );
}
