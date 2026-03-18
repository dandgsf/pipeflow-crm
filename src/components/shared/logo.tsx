interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

export function Logo({ size = "md", className = "" }: LogoProps) {
  return (
    <span className={`font-display font-extrabold tracking-tight relative inline-block ${sizes[size]} ${className}`}>
      Pipe<span className="text-pf-accent">Flow</span>
      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pf-accent to-transparent rounded-full pf-flow-pulse" />
    </span>
  );
}
