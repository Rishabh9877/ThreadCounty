import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function GradientText({
  children,
  className,
  animated = false,
  as: Tag = "span",
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        animated ? "gradient-text-animated" : "gradient-text",
        className
      )}
    >
      {children}
    </Tag>
  );
}
