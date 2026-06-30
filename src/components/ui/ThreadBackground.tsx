"use client";

import { useEffect, useState, useRef } from "react";

export function ThreadBackground() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position (-1 to 1) for parallax
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      // Calculate percentages for the mask (0% to 100%)
      const maskX = (clientX / innerWidth) * 100;
      const maskY = (clientY / innerHeight) * 100;

      containerRef.current.style.setProperty("--mouse-x", `${x * 30}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y * 30}px`);
      containerRef.current.style.setProperty("--mask-x", `${maskX}%`);
      containerRef.current.style.setProperty("--mask-y", `${maskY}%`);
    };

    // Set initial values to center
    if (containerRef.current) {
      containerRef.current.style.setProperty("--mouse-x", "0px");
      containerRef.current.style.setProperty("--mouse-y", "0px");
      containerRef.current.style.setProperty("--mask-x", "50%");
      containerRef.current.style.setProperty("--mask-y", "50%");
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background transition-colors duration-500"
    >
      <div 
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15] transition-transform duration-1000 ease-out"
        style={{ transform: "translate(var(--mouse-x, 0px), var(--mouse-y, 0px))" }}
      >
        <svg
          className="absolute w-[200%] h-[200%] -left-[50%] -top-[50%] animate-[spin_120s_linear_infinite]"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="var(--tc-gradient-mid)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {Array.from({ length: 40 }).map((_, i) => (
            <path
              key={`h-${i}`}
              d={`M -500 ${i * 50} Q ${250 + Math.sin(i) * 100} ${i * 50 + Math.cos(i) * 50}, 1500 ${i * 50}`}
              fill="none"
              stroke="url(#threadGradient)"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <path
              key={`v-${i}`}
              d={`M ${i * 50} -500 Q ${i * 50 + Math.cos(i) * 50} ${250 + Math.sin(i) * 100}, ${i * 50} 1500`}
              fill="none"
              stroke="url(#threadGradient)"
              strokeWidth="1.5"
              filter="url(#glow)"
            />
          ))}
        </svg>
      </div>
      
      {/* Interactive radial gradient overlay that follows the mouse */}
      <div 
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{ 
          background: `radial-gradient(circle at var(--mask-x, 50%) var(--mask-y, 50%), transparent 0%, var(--background) 70%)` 
        }} 
      />
    </div>
  );
}
