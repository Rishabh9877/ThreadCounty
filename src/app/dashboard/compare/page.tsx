"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { getCompareData } from "@/app/actions/compare";
import { toast } from "sonner";
import Link from "next/link";

export default function ComparePage() {
  const [loading, setLoading] = useState(true);
  const [compareSamples, setCompareSamples] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getCompareData();
        if (result.success) {
          setCompareSamples(result.samples!);
        } else {
          setError(result.error!);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load comparison data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || compareSamples.length < 2) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <GitCompare className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold font-heading">Not Enough Data</h2>
          <p className="text-muted-foreground max-w-md">
            {error || "You need to analyze at least two images to use the comparison feature."}
          </p>
          <Link href="/dashboard/upload">
            <Button className="mt-4 bg-gradient-to-r from-neon-indigo to-primary text-white">
              Upload New Image
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeading
          title="Fabric Comparison"
          description="Compare your two most recent analysis results side by side."
          align="left"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {compareSamples.map((sample, i) => (
            <motion.div
              key={sample.id}
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
                {Math.abs(compareSamples[0].density - compareSamples[1].density)}
              </p>
              <p className="text-xs text-muted-foreground">threads/cm</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Warp Δ</p>
              <p className="text-xl font-bold text-neon-indigo">
                {Math.abs(compareSamples[0].warp - compareSamples[1].warp)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weft Δ</p>
              <p className="text-xl font-bold text-aurora-emerald">
                {Math.abs(compareSamples[0].weft - compareSamples[1].weft)}
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
