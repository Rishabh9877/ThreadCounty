"use server";

import { createClient } from "@/lib/supabase/server";

// Check if user is admin
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Use Supabase directly to bypass Prisma connection issues
  const { data: dbUser, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !dbUser || dbUser.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }

  return dbUser;
}

export async function getAdminMetrics() {
  await requireAdmin();
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalUploads },
    { count: activeSubscriptions }
  ] = await Promise.all([
    supabase.from("User").select("*", { count: "exact", head: true }),
    supabase.from("Upload").select("*", { count: "exact", head: true }),
    supabase.from("Subscription").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);

  return {
    totalUsers: totalUsers || 0,
    totalUploads: totalUploads || 0,
    activeSubscriptions: activeSubscriptions || 0,
    systemHealth: "99.9%", // Mocked for demo
  };
}

export async function getAdminUsers() {
  await requireAdmin();
  const supabase = await createClient();

  // Fetch users with their subscriptions and uploads
  const { data: users } = await supabase
    .from("User")
    .select(`
      id, email, name, role, created_at,
      Subscription ( planId, status ),
      Upload ( id )
    `)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!users) return [];

  return users.map((user: any) => ({
    id: user.id,
    email: user.email,
    name: user.name || "Unknown User",
    plan: user.Subscription?.find((s: any) => s.status === "active")?.planId || "Free",
    uploads: user.Upload?.length || 0,
    role: user.role.toLowerCase(),
    joinDate: new Date(user.created_at).toISOString().split("T")[0],
  }));
}

export async function getModerationQueue() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: uploads } = await supabase
    .from("Upload")
    .select(`
      id, fileName, created_at,
      User ( email, name ),
      Report !inner ( confidence )
    `)
    .lt("Report.confidence", 80)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!uploads) return [];

  return uploads.map((upload: any) => ({
    id: upload.id,
    fileName: upload.fileName,
    user: upload.User?.email || upload.User?.name || "Unknown User",
    reason: `Low AI Confidence (${upload.Report[0]?.confidence?.toFixed(1) || 0}%)`,
    date: new Date(upload.created_at).toISOString().split("T")[0],
  }));
}

export async function deleteUpload(uploadId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("Upload").delete().eq("id", uploadId);
  return { success: true };
}
