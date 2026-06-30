"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  Scan,
  Layers,
  Target,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { useMemo } from "react";

function generateMockResults(id: string) {
  const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const fabricTypes = ["Cotton", "Denim", "Twill", "Satin", "Linen"];
  const threadDensity = 130 + (hash % 160);
  const warpCount = Math.floor(threadDensity * 0.55) + (hash % 10);
  const weftCount = threadDensity - warpCount;
  const fabricType = fabricTypes[hash % fabricTypes.length];
  const confidence = 85 + (hash % 14) + Math.random();

  return {
    id,
    threadDensity,
    warpCount,
    weftCount,
    fabricType,
    confidence: Math.min(99.9, confidence),
    uniformity: 88 + (hash % 10),
    suggestions: [
      {
        type: "quality" as const,
        text: `Thread density of ${threadDensity}/cm is ${threadDensity > 200 ? "above" : "within"} standard range for ${fabricType.toLowerCase()} fabrics. ${threadDensity > 200 ? "Consider reducing thread count for cost optimization." : "Quality meets production standards."}`,
      },
      {
        type: "improvement" as const,
        text: `Warp-to-weft ratio is ${(warpCount / weftCount).toFixed(2)}:1. For optimal ${fabricType.toLowerCase()} structure, aim for a ratio closer to ${fabricType === "Denim" ? "2:1" : "1:1"}.`,
      },
      {
        type: "info" as const,
        text: `Detected weave pattern is consistent with ${fabricType === "Twill" ? "2/1 twill" : fabricType === "Satin" ? "5-harness satin" : "plain"} weave structure. Analysis confidence is ${confidence.toFixed(1)}%.`,
      },
    ],
    createdAt: new Date().toISOString(),
    fileName: `${fabricType}-Sample-${id.substring(0, 4).toUpperCase()}.jpg`,
  };
}

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const results = useMemo(() => generateMockResults(id), [id]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Report link copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/history">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold font-heading">
                Analysis Results
              </h1>
              <p className="text-sm text-muted-foreground">
                {results.fileName} • Report #{id.substring(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="glass gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button
              className="bg-gradient-to-r from-neon-indigo to-primary text-white gap-2"
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Image Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GlassCard className="p-0 overflow-hidden">
              <div className="relative aspect-square bg-muted flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/5 to-aurora-emerald/5" />
                <div className="text-center">
                  <Scan className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {results.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Analyzed fabric image
                  </p>
                </div>

                {/* Overlay grid showing detected intersections */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={`${(i + 1) * 8}%`}
                        x2="100%"
                        y2={`${(i + 1) * 8}%`}
                        stroke="var(--tc-gradient-start)"
                        strokeWidth="0.5"
                        opacity="0.4"
                      />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={`${(i + 1) * 8}%`}
                        y1="0"
                        x2={`${(i + 1) * 8}%`}
                        y2="100%"
                        stroke="var(--tc-gradient-end)"
                        strokeWidth="0.5"
                        opacity="0.4"
                      />
                    ))}
                    {Array.from({ length: 12 }).map((_, i) =>
                      Array.from({ length: 12 }).map((_, j) => (
                        <circle
                          key={`p-${i}-${j}`}
                          cx={`${(i + 1) * 8}%`}
                          cy={`${(j + 1) * 8}%`}
                          r="2"
                          fill="var(--tc-gradient-start)"
                          opacity="0.5"
                        />
                      ))
                    )}
                  </svg>
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Detected intersections: {results.warpCount * results.weftCount}</span>
                  <Badge variant="secondary" className="text-xs">
                    {results.fabricType}
                  </Badge>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right: Data Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Core Metrics */}
            <GlassCard>
              <h2 className="text-lg font-semibold font-heading mb-4">
                Thread Analysis
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Thread Density
                  </p>
                  <p className="text-2xl font-bold">
                    <GradientText>{results.threadDensity}</GradientText>
                  </p>
                  <p className="text-xs text-muted-foreground">threads/cm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Fabric Type
                  </p>
                  <p className="text-2xl font-bold">{results.fabricType}</p>
                  <Badge variant="outline" className="text-xs">
                    Classified
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Warp Count
                  </p>
                  <p className="text-xl font-bold text-neon-indigo">
                    {results.warpCount}
                  </p>
                  <p className="text-xs text-muted-foreground">threads/cm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Weft Count
                  </p>
                  <p className="text-xl font-bold text-aurora-emerald">
                    {results.weftCount}
                  </p>
                  <p className="text-xs text-muted-foreground">threads/cm</p>
                </div>
              </div>
            </GlassCard>

            {/* Confidence Score */}
            <GlassCard>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Confidence Score</h3>
                <span className="text-2xl font-bold gradient-text">
                  {results.confidence.toFixed(1)}%
                </span>
              </div>
              <Progress value={results.confidence} className="h-3" />
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </GlassCard>

            {/* Uniformity */}
            <GlassCard>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Thread Uniformity</h3>
                <span className="text-lg font-bold">
                  {results.uniformity}%
                </span>
              </div>
              <Progress value={results.uniformity} className="h-2" />
            </GlassCard>
          </motion.div>
        </div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold font-heading">
                AI Suggestions
              </h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              {results.suggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-3">
                  {suggestion.type === "quality" ? (
                    <CheckCircle className="w-5 h-5 text-aurora-emerald flex-shrink-0 mt-0.5" />
                  ) : suggestion.type === "improvement" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Target className="w-5 h-5 text-neon-indigo flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <Badge
                      variant="outline"
                      className="text-xs mb-1 capitalize"
                    >
                      {suggestion.type}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {suggestion.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Warp/Weft Visual Breakdown */}
        <GlassCard>
          <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Warp & Weft Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-indigo to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(results.warpCount / results.threadDensity) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-sm font-medium text-neon-indigo">
                Warp: {((results.warpCount / results.threadDensity) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden mb-2">
                <motion.div
                  className="h-full bg-gradient-to-r from-aurora-emerald to-teal-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(results.weftCount / results.threadDensity) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
              <p className="text-sm font-medium text-aurora-emerald">
                Weft: {((results.weftCount / results.threadDensity) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
