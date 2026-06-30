"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getResultData(uploadId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const upload = await prisma.upload.findUnique({
    where: { id: uploadId, userId: user.id },
    include: { report: true },
  });

  if (!upload || !upload.report) {
    return null; // Not found or still processing
  }

  return {
    id: upload.id,
    fileName: upload.fileName,
    threadDensity: parseInt(upload.report.threadDensity || "0"),
    warpCount: upload.report.warpCount || 0,
    weftCount: upload.report.weftCount || 0,
    fabricType: upload.report.fabricType || "Unknown",
    confidence: upload.report.confidence || 0,
    uniformity: 88, // Mocking a metric we didn't add to DB for now
    suggestions: upload.report.aiSuggestions ? JSON.parse(upload.report.aiSuggestions) : [],
    createdAt: upload.report.createdAt.toISOString(),
  };
}
