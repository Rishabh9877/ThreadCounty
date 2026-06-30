"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getCompareData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) throw new Error("User not found");

  // Get the 2 most recent completed reports for this user
  const uploads = await prisma.upload.findMany({
    where: { 
      userId: dbUser.id,
      report: { isNot: null } 
    },
    include: { report: true },
    orderBy: { createdAt: 'desc' },
    take: 2
  });

  if (uploads.length < 2) {
    return { success: false, error: "Not enough data. Please upload and analyze at least 2 images to use the compare feature." };
  }

  const samples = uploads.map((u, i) => ({
    id: u.id,
    name: u.fileName,
    type: u.report!.fabricType || "Unknown",
    density: u.report!.threadDensity ? parseInt(u.report!.threadDensity) : 0,
    warp: u.report!.warpCount || 0,
    weft: u.report!.weftCount || 0,
    confidence: u.report!.confidence ? parseFloat((u.report!.confidence * 100).toFixed(1)) : 0,
  }));

  return { success: true, samples };
}
