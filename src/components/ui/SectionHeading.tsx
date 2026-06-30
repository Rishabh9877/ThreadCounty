import { cn } from "@/lib/utils";
import { GradientText } from "./GradientText";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  gradientTitle?: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  badge,
  title,
  gradientTitle,
  description,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase glass text-primary">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-balance">
        {title}{" "}
        {gradientTitle && (
          <GradientText animated>{gradientTitle}</GradientText>
        )}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
