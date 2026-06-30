import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "indigo" | "emerald" | "none";
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = "none",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6",
        hover && "glass-hover",
        glow === "indigo" && "glow-indigo",
        glow === "emerald" && "glow-emerald",
        className
      )}
    >
      {children}
    </div>
  );
}
