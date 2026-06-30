"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GradientText } from "./GradientText";
import { ScanFace, Microchip, Infinity } from "lucide-react";

export function DashboardStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scene 1: The Fiber (0 to 0.33)
  const fiberScale = useTransform(scrollYProgress, [0, 0.2], [40, 1]);
  const fiberOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const fiberY = useTransform(scrollYProgress, [0, 0.2], ["0%", "0%"]);

  // Scene 2: The Weave (0.25 to 0.6)
  const weaveOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.6], [0, 1, 1, 0]);
  const weaveScale = useTransform(scrollYProgress, [0.2, 0.6], [2, 1]);
  const weaveRotateX = useTransform(scrollYProgress, [0.2, 0.6], [45, 0]);

  // Scene 3: The Intelligence (0.5 to 0.8)
  const intelOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.8, 0.9], [0, 1, 1, 0]);
  const intelScale = useTransform(scrollYProgress, [0.5, 0.8], [0.8, 1]);
  
  // Transition text opacities
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="h-[400vh] relative w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-background">
        
        {/* SCENE 1: THE FIBER */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: fiberOpacity, scale: fiberScale, y: fiberY }}
        >
          {/* Abstract Fiber Representation */}
          <div className="relative w-2 h-[200vh] bg-gradient-to-b from-primary via-accent to-primary rounded-full blur-[2px] opacity-80 rotate-[15deg]">
            <div className="absolute inset-0 bg-white/20 blur-[1px] animate-pulse" />
          </div>
        </motion.div>

        {/* SCENE 2: THE WEAVE */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: weaveOpacity, 
            scale: weaveScale,
            rotateX: weaveRotateX,
            perspective: "1000px" 
          }}
        >
          {/* Abstract Fabric Grid */}
          <div className="w-[150vw] h-[150vh] relative">
            {/* Horizontal Threads */}
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={`h-${i}`} 
                className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                style={{ top: `${(i / 40) * 100}%` }}
              />
            ))}
            {/* Vertical Threads */}
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={`v-${i}`} 
                className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-accent/40 to-transparent"
                style={{ left: `${(i / 40) * 100}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* SCENE 3: THE INTELLIGENCE */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: intelOpacity, scale: intelScale }}
        >
          <div className="relative w-96 h-96 border border-primary/30 rounded-3xl bg-primary/5 backdrop-blur-sm flex items-center justify-center overflow-hidden">
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-indigo shadow-[0_0_20px_#6366f1] animate-[scan_3s_ease-in-out_infinite]" />
            <Microchip className="w-32 h-32 text-primary opacity-50" />
            
            {/* Scanning data points */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-4 p-8">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-full h-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-accent/50 rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* STORY TEXT OVERLAYS */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          
          <motion.div 
            className="absolute text-center px-4 max-w-2xl"
            style={{ opacity: text1Opacity }}
          >
            <Infinity className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-balance">
              It all starts with a single <GradientText>fiber</GradientText>.
            </h2>
            <p className="text-lg text-muted-foreground">
              The fundamental building block of every textile, holding the DNA of its strength and quality.
            </p>
          </motion.div>

          <motion.div 
            className="absolute text-center px-4 max-w-2xl"
            style={{ opacity: text2Opacity }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-balance">
              Woven into <GradientText>complexity</GradientText>.
            </h2>
            <p className="text-lg text-muted-foreground">
              As thousands of threads interlock, the patterns become impossible for the human eye to measure with absolute precision.
            </p>
          </motion.div>

          <motion.div 
            className="absolute text-center px-4 max-w-2xl"
            style={{ opacity: text3Opacity }}
          >
            <ScanFace className="w-12 h-12 text-neon-indigo mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-balance">
              Until <GradientText>now</GradientText>.
            </h2>
            <p className="text-lg text-muted-foreground">
              Our computer vision models instantly map the entire matrix, analyzing thread density, weave patterns, and microscopic defects.
            </p>
          </motion.div>
          
        </div>

      </div>
    </div>
  );
}
