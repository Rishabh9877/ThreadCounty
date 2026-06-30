"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactForm(data: { name: string; email: string; subject: string; message: string }) {
  try {
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        message: `[${data.subject}] ${data.message}`,
        status: "UNREAD",
      },
    });
    
    return { success: true, message: "Message sent successfully" };
  } catch (error) {
    console.error("Failed to submit contact form:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
