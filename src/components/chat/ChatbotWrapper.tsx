"use client";

import dynamic from "next/dynamic";

const AIChatbot = dynamic(
  () => import("@/components/chat/AIChatbot").then((m) => m.AIChatbot),
  { ssr: false }
);

export function ChatbotWrapper() {
  return <AIChatbot />;
}
