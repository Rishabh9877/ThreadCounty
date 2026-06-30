"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Check if user is admin
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || dbUser.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }

  return dbUser;
}

export async function getAdminMetrics() {
  await requireAdmin();

  const [totalUsers, totalUploads, activeSubscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.upload.count(),
    prisma.subscription.count({ where: { status: "active" } }),
  ]);

  return {
    totalUsers,
    totalUploads,
    activeSubscriptions,
    systemHealth: "99.9%", // Mocked for demo
  };
}

export async function getAdminUsers() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    include: {
      subscriptions: {
        where: { status: "active" },
        take: 1,
      },
      _count: {
        select: { uploads: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return users.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name || "Unknown User",
    plan: user.subscriptions[0]?.planId || "Free",
    uploads: user._count.uploads,
    role: user.role.toLowerCase(),
    joinDate: user.createdAt.toISOString().split("T")[0],
  }));
}

export async function getModerationQueue() {
  await requireAdmin();

  // Fetch uploads with low confidence for moderation
  const uploads = await prisma.upload.findMany({
    where: {
      report: {
        confidence: { lt: 80 }
      }
    },
    include: {
      user: true,
      report: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return uploads.map(upload => ({
    id: upload.id,
    fileName: upload.fileName,
    user: upload.user.email || upload.user.name || "Unknown User",
    reason: `Low AI Confidence (${upload.report?.confidence?.toFixed(1) || 0}%)`,
    date: upload.createdAt.toISOString().split("T")[0],
  }));
}

export async function deleteUpload(uploadId: string) {
  await requireAdmin();
  await prisma.upload.delete({ where: { id: uploadId } });
  return { success: true };
}
