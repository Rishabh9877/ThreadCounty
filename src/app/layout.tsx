import type { Metadata } from "next";
import { inter, outfit } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { LenisProvider } from "@/providers/LenisProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ChatbotWrapper } from "@/components/chat/ChatbotWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ThreadCounty — AI-Powered Textile Analysis",
    template: "%s | ThreadCounty",
  },
  description:
    "Analyze fabric structures with AI and Computer Vision. Automated thread density analysis, weave classification, and downloadable reports for textile professionals.",
  keywords: [
    "textile analysis",
    "AI fabric inspection",
    "thread density",
    "warp weft detection",
    "computer vision textiles",
    "fabric quality control",
  ],
  authors: [{ name: "ThreadCounty" }],
  openGraph: {
    title: "ThreadCounty — AI-Powered Textile Analysis",
    description:
      "Analyze fabric structures with AI and Computer Vision. Automated thread density analysis, weave classification, and downloadable reports.",
    type: "website",
    locale: "en_US",
    siteName: "ThreadCounty",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThreadCounty — AI-Powered Textile Analysis",
    description:
      "Analyze fabric structures with AI and Computer Vision.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <SupabaseProvider>
            <LenisProvider>
              <TooltipProvider>
                {children}
                <Toaster richColors position="top-right" />
                <ChatbotWrapper />
              </TooltipProvider>
            </LenisProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
