"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimateOnScroll({
  children,
  delay = 0,
  className = "",
}: AnimateOnScrollProps) {
  // Default visible=true so SSR and pre-hydration never hide content
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight - 32 && rect.bottom > 0;

    if (alreadyVisible) {
      // In viewport on load — keep visible, skip animation
      setReady(true);
      return;
    }

    // Below the fold — reset to hidden then animate in on scroll
    setVisible(false);
    setReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        ready
          ? {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
