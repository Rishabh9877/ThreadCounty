"use client";

import { useState, useEffect, useRef } from "react";

interface ScrollState {
  progress: number;
  velocity: number;
  direction: number;
  scrollY: number;
}

export function useScrollState(): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    velocity: 0,
    direction: 0,
    scrollY: 0,
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    lastTime.current = Date.now();
    function handleScroll() {
      const now = Date.now();
      const dt = Math.max(now - lastTime.current, 1);
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;
      const rawVelocity = (currentScrollY - lastScrollY.current) / dt;
      const velocity = Math.min(Math.abs(rawVelocity) * 10, 5);
      const direction = rawVelocity > 0 ? 1 : rawVelocity < 0 ? -1 : 0;

      setScrollState({ progress, velocity, direction, scrollY: currentScrollY });
      lastScrollY.current = currentScrollY;
      lastTime.current = now;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollState;
}
