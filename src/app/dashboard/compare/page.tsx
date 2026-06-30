"use client";

import { motion } from "framer-motion";
import { GitCompare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";

const compareSamples = [
  { id: "a1b2c3d4", name: "Cotton-Blend-Sample-A.jpg", type: "Cotton", density: 186, warp: 102, weft: 84, confidence: 97.2 },
  { id: "e5f6g7h8", name: "Denim-Production-Batch-12.png", type: "Denim", density: 234, warp: 140, weft: 94, confidence: 95.8 },
];

export default function ComparePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeading
          title="Fabric Comparison"
          description="Compare thread analysis results side by side to identify differences and quality variations."
          align="left"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {compareSamples.map((sample, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <GlassCard className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    Sample {i + 1}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-neon-indigo to-primary text-white text-xs">
                    {sample.type}
                  </Badge>
                </div>

                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/5 to-aurora-emerald/5" />
                  <GitCompare className="w-10 h-10 text-muted-foreground/30" />
                </div>

                <p className="text-sm font-medium mb-3 truncate">{sample.name}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Density</p>
                    <p className="text-xl font-bold"><GradientText>{sample.density}</GradientText></p>
                    <p className="text-xs text-muted-foreground">threads/cm</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Confidence</p>
                    <p className="text-xl font-bold">{sample.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Warp</p>
                    <p className="text-lg font-bold text-neon-indigo">{sample.warp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Weft</p>
                    <p className="text-lg font-bold text-aurora-emerald">{sample.weft}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Difference Summary */}
        <GlassCard glow="indigo">
          <h2 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Comparison Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Density Δ</p>
              <p className="text-xl font-bold text-amber-500">
                +{Math.abs(compareSamples[0].density - compareSamples[1].density)}
              </p>
              <p className="text-xs text-muted-foreground">threads/cm</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Warp Δ</p>
              <p className="text-xl font-bold text-neon-indigo">
                +{Math.abs(compareSamples[0].warp - compareSamples[1].warp)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weft Δ</p>
              <p className="text-xl font-bold text-aurora-emerald">
                +{Math.abs(compareSamples[0].weft - compareSamples[1].weft)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confidence Δ</p>
              <p className="text-xl font-bold">
                {Math.abs(compareSamples[0].confidence - compareSamples[1].confidence).toFixed(1)}%
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
