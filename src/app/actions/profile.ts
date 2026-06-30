"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getSecurityLogs() {
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

  const logs = await prisma.securityLog.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return logs.map((log: any) => ({
    id: log.id,
    action: log.action,
    date: log.createdAt.toISOString(),
    ip: log.ipAddress || "Unknown",
    device: log.userAgent || "Unknown Device",
  }));
}

export async function logSecurityAction(action: string, ipAddress: string = "192.168.1.1", userAgent: string = "Web Browser") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.securityLog.create({
    data: {
      userId: user.id,
      action,
      ipAddress,
      userAgent,
    },
  });
}

export async function updateProfileName(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.user.upsert({
    where: { id: user.id },
    update: { name },
    create: {
      id: user.id,
      email: user.email || "",
      name,
    }
  });
  
  return { success: true };
}
