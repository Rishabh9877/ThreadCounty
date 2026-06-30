"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function updateSubscription(planId: string, isAnnual: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to subscribe." };
  }

  try {
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

    const currentPeriodEnd = new Date();
    if (isAnnual) {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    } else {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    }

    // Cancel existing active subscriptions
    await prisma.subscription.updateMany({
      where: { userId: dbUser.id, status: "active" },
      data: { status: "canceled" }
    });

    // Create new subscription
    await prisma.subscription.create({
      data: {
        userId: dbUser.id,
        planId: planId.toLowerCase(),
        status: "active",
        currentPeriodEnd,
      },
    });

    return { success: true, message: `Successfully subscribed to the ${planId} plan!` };
  } catch (error) {
    console.error("Failed to update subscription:", error);
    return { success: false, error: "Failed to update subscription. Please try again." };
  }
}
