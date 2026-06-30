"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  Rocket,
  Brain,
  Scan,
  Cpu,
  Users,
  Calendar,
  Linkedin,
  Twitter,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThreadBackground } from "@/components/ui/ThreadBackground";
import { Separator } from "@/components/ui/separator";

const values = [
  { icon: Eye, title: "Vision", description: "Making textile analysis accessible to every manufacturer, student, and researcher through cutting-edge AI." },
  { icon: Heart, title: "Mission", description: "Democratize fabric quality control by replacing expensive lab equipment with intelligent software solutions." },
  { icon: Rocket, title: "Innovation", description: "Continuously pushing the boundaries of computer vision to deliver ever-more-precise textile analysis." },
];

const techStack = [
  { icon: Brain, title: "Deep Learning CNN", description: "Custom convolutional neural networks trained on 500K+ textile samples for fabric classification." },
  { icon: Scan, title: "Edge Detection", description: "Advanced Canny and Hough transform algorithms isolate individual thread intersections." },
  { icon: Cpu, title: "Real-time Processing", description: "GPU-accelerated inference pipeline delivers analysis results in under 3 seconds." },
];

const team = [
  { name: "Dr. Ananya Sharma", role: "CEO & Co-Founder", bio: "PhD in Computer Vision from Stanford. Former research lead at Google Brain.", initials: "AS" },
  { name: "Marcus Chen", role: "CTO & Co-Founder", bio: "15 years in ML infrastructure. Previously built ML platforms at Meta and Stripe.", initials: "MC" },
  { name: "Prof. Elena Rossi", role: "Chief Scientist", bio: "Professor of Textile Engineering at ETH Zürich. 50+ published papers on fabric analysis.", initials: "ER" },
  { name: "James Okonkwo", role: "Head of Product", bio: "Product leader with experience at Figma and Linear. Obsessed with developer experience.", initials: "JO" },
  { name: "Priya Mehta", role: "Lead ML Engineer", bio: "MS in AI from MIT. Specialized in convolutional architectures for material science.", initials: "PM" },
  { name: "David Kim", role: "Head of Design", bio: "Award-winning designer. Previously led design systems at Vercel and Notion.", initials: "DK" },
];

const timeline = [
  { year: "2022", event: "ThreadCounty founded in Palo Alto", detail: "Initial research on AI-powered textile analysis" },
  { year: "2023", event: "Seed funding of $2.5M", detail: "Launched private beta with 50 textile manufacturers" },
  { year: "2024", event: "Public launch", detail: "10,000+ users in first quarter. Series A of $12M." },
  { year: "2025", event: "Enterprise platform", detail: "Custom AI models, API access, and on-premise deployment" },
  { year: "2026", event: "Global expansion", detail: "150+ countries served. Partnership with major textile associations." },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <ThreadBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SectionHeading
              badge="Our Story"
              title="Weaving the Future of"
              gradientTitle="Textile Intelligence"
              description="ThreadCounty was born from a simple observation: textile quality control shouldn't require expensive equipment and years of training. AI can bridge that gap."
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="h-full text-center py-8" glow="indigo">
                  <v.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-heading mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading badge="Technology" title="Our Computer Vision" gradientTitle="Stack" description="Built on cutting-edge AI research and optimized for real-world textile analysis." />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {techStack.map((tech, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <tech.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold font-heading mb-2">{tech.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading badge="Team" title="Meet the" gradientTitle="Team" description="World-class experts in AI, computer vision, textile engineering, and product design." />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <GlassCard className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-indigo to-aurora-emerald flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg transition-transform group-hover:scale-110">
                    {member.initials}
                  </div>
                  <h3 className="text-base font-semibold font-heading">{member.name}</h3>
                  <p className="text-xs text-primary font-medium mt-1">{member.role}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{member.bio}</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <Linkedin className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <Twitter className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeading badge="Journey" title="Our" gradientTitle="Timeline" />
          <div className="mt-12 space-y-0">
            {timeline.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-indigo to-aurora-emerald flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-primary/30 to-transparent min-h-[40px]" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-xs text-primary font-semibold mb-1">{item.year}</p>
                  <h3 className="text-base font-semibold font-heading">{item.event}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
