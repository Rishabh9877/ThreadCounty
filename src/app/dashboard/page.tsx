"use client";

import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  BarChart3,
  Database,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Skeleton } from "@/components/ui/skeleton";

const metrics = [
  {
    title: "Total Uploads",
    value: "24",
    change: "+3 this week",
    icon: Upload,
    color: "text-neon-indigo",
    bgColor: "bg-neon-indigo/10",
  },
  {
    title: "Report Accuracy",
    value: "98.4%",
    change: "+1.2% improvement",
    icon: TrendingUp,
    color: "text-aurora-emerald",
    bgColor: "bg-aurora-emerald/10",
  },
  {
    title: "Storage Used",
    value: "1.2 GB",
    change: "of 5 GB (24%)",
    icon: Database,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "API Quota",
    value: "847",
    change: "of 1000 requests",
    icon: BarChart3,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const recentActivity = [
  {
    action: "Fabric analysis completed",
    detail: "Cotton-Blend-Sample-A.jpg",
    time: "2 minutes ago",
    type: "success" as const,
  },
  {
    action: "PDF report generated",
    detail: "Report #2847 — Twill Weave",
    time: "15 minutes ago",
    type: "info" as const,
  },
  {
    action: "New image uploaded",
    detail: "Denim-Production-Batch-12.png",
    time: "1 hour ago",
    type: "default" as const,
  },
  {
    action: "Analysis completed",
    detail: "Satin-Weave-QC-Check.jpg",
    time: "3 hours ago",
    type: "success" as const,
  },
  {
    action: "Account plan upgraded",
    detail: "Free → Student Plan",
    time: "Yesterday",
    type: "info" as const,
  },
];

const quickActions = [
  {
    label: "Upload New Fabric",
    href: "/dashboard/upload",
    icon: Upload,
    gradient: "from-neon-indigo to-primary",
  },
  {
    label: "View History",
    href: "/dashboard/history",
    icon: Clock,
    gradient: "from-aurora-emerald to-teal-accent",
  },
  {
    label: "Compare Fabrics",
    href: "/dashboard/compare",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function DashboardPage() {
  const { user, loading } = useSupabase();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <div className="bg-background">
      {/* Dashboard Main Content */}
      <DashboardLayout>
        <div className="space-y-8 relative z-10 bg-background pt-8 border-t border-border/50">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="relative overflow-hidden" glow="indigo">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-neon-indigo/20 to-transparent rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-heading">
                    Welcome back,{" "}
                    <GradientText>
                      {user?.user_metadata?.name ||
                        user?.email?.split("@")[0] ||
                        "User"}
                    </GradientText>
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Here&apos;s an overview of your textile analysis activity.
                  </p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Free Plan
                </Badge>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold font-heading mt-1">
                      {metric.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.change}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center`}
                  >
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
                {metric.title === "Storage Used" && (
                  <Progress value={24} className="mt-3 h-1.5" />
                )}
                {metric.title === "API Quota" && (
                  <Progress value={84.7} className="mt-3 h-1.5" />
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Timeline */}
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold font-heading">
                  Recent Activity
                </h2>
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    View All <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        item.type === "success"
                          ? "bg-aurora-emerald"
                          : item.type === "info"
                          ? "bg-neon-indigo"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.detail}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.time}
                    </span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Quick Actions */}
          <div>
            <GlassCard>
              <h2 className="text-lg font-semibold font-heading mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, i) => (
                  <Link key={i} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-12 glass-hover mb-2"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0`}
                      >
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                      <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground" />
                    </Button>
                  </Link>
                ))}
              </div>
            </GlassCard>

            {/* Tip Card */}
            <GlassCard className="mt-6" glow="emerald">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-aurora-emerald/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-aurora-emerald" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pro Tip</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Upload high-resolution images (300+ DPI) for the most
                    accurate thread density measurements and weave
                    classification.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
