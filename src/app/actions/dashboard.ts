"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure user exists in our DB
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    },
  });

  // Calculate metrics
  const totalUploads = await prisma.upload.count({
    where: { userId: dbUser.id },
  });

  const uploads = await prisma.upload.findMany({
    where: { userId: dbUser.id },
    include: { report: true },
    orderBy: { createdAt: "desc" },
  });

  let totalSize = 0;
  let totalConfidence = 0;
  let reportsCount = 0;

  uploads.forEach((u) => {
    totalSize += u.fileSize;
    if (u.report?.confidence) {
      totalConfidence += u.report.confidence;
      reportsCount++;
    }
  });

  const avgAccuracy = reportsCount > 0 ? (totalConfidence / reportsCount) * 100 : 0;
  const storageUsed = totalSize / (1024 * 1024); // in MB
  
  const metrics = [
    {
      title: "Total Uploads",
      value: totalUploads.toString(),
      change: "Lifetime count",
    },
    {
      title: "Report Accuracy",
      value: `${avgAccuracy.toFixed(1)}%`,
      change: "Average confidence",
    },
    {
      title: "Storage Used",
      value: `${storageUsed.toFixed(2)} MB`,
      change: "of 5 GB limit",
      rawStorageUsed: storageUsed,
    },
    {
      title: "API Quota",
      value: totalUploads.toString(),
      change: "of 1000 requests",
      rawQuotaUsed: totalUploads,
    },
  ];

  // Recent Activity (combine uploads and security logs)
  const securityLogs = await prisma.securityLog.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentActivity: { action: string; detail: string; time: Date; type: string }[] = [];

  uploads.slice(0, 5).forEach((u) => {
    recentActivity.push({
      action: "New image uploaded",
      detail: u.fileName,
      time: u.createdAt,
      type: "default",
    });
    if (u.report) {
      recentActivity.push({
        action: "Fabric analysis completed",
        detail: `Report for ${u.fileName}`,
        time: u.report.createdAt,
        type: "success",
      });
    }
  });

  securityLogs.forEach((s) => {
    recentActivity.push({
      action: "Security Event",
      detail: s.action,
      time: s.createdAt,
      type: "info",
    });
  });

  // Sort combined activity by time descending and take top 5
  recentActivity.sort((a, b) => b.time.getTime() - a.time.getTime());

  const formattedActivity = recentActivity.slice(0, 5).map((a) => {
    // Basic relative time
    const diffMins = Math.floor((new Date().getTime() - a.time.getTime()) / 60000);
    let timeStr = `${diffMins} mins ago`;
    if (diffMins > 60 * 24) {
      timeStr = `${Math.floor(diffMins / (60 * 24))} days ago`;
    } else if (diffMins > 60) {
      timeStr = `${Math.floor(diffMins / 60)} hours ago`;
    } else if (diffMins === 0) {
      timeStr = "Just now";
    }

    return {
      ...a,
      time: timeStr,
    };
  });

  return { metrics, recentActivity: formattedActivity };
}
