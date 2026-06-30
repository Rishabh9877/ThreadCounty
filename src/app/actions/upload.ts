"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function createUploadRecord(fileName: string, fileUrl: string, fileSize: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    },
  });

  // Create Upload record
  const upload = await prisma.upload.create({
    data: {
      userId: dbUser.id,
      fileName,
      fileUrl,
      fileSize,
      fileType: fileName.split('.').pop() || "unknown",
    },
  });

  // Generate dynamic analysis (mocked analysis but saved in DB)
  const fabricTypes = ["Cotton", "Denim", "Twill", "Satin", "Linen"];
  const fabricType = fabricTypes[Math.floor(Math.random() * fabricTypes.length)];
  const threadDensity = 130 + Math.floor(Math.random() * 160);
  const warpCount = Math.floor(threadDensity * 0.55) + Math.floor(Math.random() * 10);
  const weftCount = threadDensity - warpCount;
  const confidence = 85 + Math.random() * 14;

  const suggestions = [
    {
      type: "quality",
      text: `Thread density of ${threadDensity}/cm is ${threadDensity > 200 ? "above" : "within"} standard range for ${fabricType.toLowerCase()} fabrics.`,
    },
    {
      type: "improvement",
      text: `Warp-to-weft ratio is ${(warpCount / weftCount).toFixed(2)}:1. For optimal ${fabricType.toLowerCase()} structure, aim for a ratio closer to ${fabricType === "Denim" ? "2:1" : "1:1"}.`,
    },
  ];

  await prisma.report.create({
    data: {
      userId: dbUser.id,
      uploadId: upload.id,
      fabricType,
      threadDensity: threadDensity.toString(),
      warpCount,
      weftCount,
      confidence,
      aiSuggestions: JSON.stringify(suggestions),
    },
  });

  return upload.id;
}
