"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getUserHistory() {
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

  const uploads = await prisma.upload.findMany({
    where: { userId: dbUser.id },
    include: {
      report: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return uploads.map((upload) => ({
    id: upload.id,
    fileName: upload.fileName,
    date: upload.createdAt.toISOString(),
    status: upload.report ? "Completed" : "Processing", // simple derived status
    fabricType: upload.report?.fabricType || "Analyzing...",
    accuracy: upload.report?.confidence ? `${(upload.report.confidence * 100).toFixed(1)}%` : "N/A",
  }));
}
