"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import {
  Scan,
  Cpu,
  FileText,
  Layers,
  BarChart3,
  Shield,
  Upload,
  Brain,
  CheckCircle,
  Download,
  ArrowRight,
  Star,
  ChevronDown,
  Send,
  Zap,
  Users,
  Globe,
  Target,
  ScanFace,
  Infinity as InfinityIcon,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { LandingScene } from "@/components/3d/LandingScene";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThreadBackground } from "@/components/ui/ThreadBackground";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Scan,
    title: "Thread Density Mapping",
    description:
      "Precisely measure threads per centimeter using advanced image analysis algorithms that detect individual warp and weft intersections.",
    gradient: "from-neon-indigo to-purple-500",
  },
  {
    icon: Cpu,
    title: "AI-Powered Classification",
    description:
      "Automatically classify fabric types — Cotton, Denim, Twill, Satin, Linen — with confidence scores exceeding 95%.",
    gradient: "from-aurora-emerald to-teal-accent",
  },
  {
    icon: FileText,
    title: "Automated Reports",
    description:
      "Generate comprehensive PDF reports with thread counts, weave patterns, density maps, and actionable quality insights.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Layers,
    title: "Warp & Weft Detection",
    description:
      "Separate and visualize warp and weft thread directions. Understand interlocking patterns at microscopic resolution.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Quality Analytics",
    description:
      "Track fabric quality metrics over time. Identify trends, anomalies, and statistical deviations in production batches.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Row-level security, encrypted storage, and SOC-2 compliant infrastructure protect your proprietary textile data.",
    gradient: "from-violet-500 to-indigo-500",
  },
];

const workflowSteps = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Fabric Image",
    description:
      "Drag and drop your fabric image. We support JPG and PNG files up to 5MB with automatic compression.",
  },
  {
    step: 2,
    icon: Brain,
    title: "AI Analysis",
    description:
      "Our computer vision engine scans every pixel, detecting thread intersections and classifying weave patterns in seconds.",
  },
  {
    step: 3,
    icon: CheckCircle,
    title: "Review Results",
    description:
      "Explore a detailed split-screen view with annotated fabric imagery, density counts, fabric type, and confidence metrics.",
  },
  {
    step: 4,
    icon: Download,
    title: "Export Reports",
    description:
      "Download professional PDF reports, share analysis links with your team, or access data via our REST API.",
  },
];

const stats = [
  { value: 10000000, suffix: "+", label: "Threads Scanned", icon: Target },
  { value: 50000, suffix: "+", label: "Reports Generated", icon: FileText },
  { value: 99, suffix: ".2%", label: "Analysis Accuracy", icon: Zap },
  { value: 150, suffix: "+", label: "Countries Served", icon: Globe },
];

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Textile Research Director, MIT",
    quote:
      "ThreadCounty has transformed our lab workflow. Analysis that used to take hours now happens in seconds with remarkable accuracy.",
    rating: 5,
  },
  {
    name: "Rajesh Patel",
    role: "QC Manager, Arvind Mills",
    quote:
      "The AI classification is incredibly precise. We've reduced quality defects by 40% since implementing ThreadCounty in our production line.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Fashion Technology Professor, Parsons",
    quote:
      "My students love the intuitive interface. It makes complex textile analysis accessible to beginners while offering depth for experts.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "How accurate is the AI thread analysis?",
    answer:
      "Our computer vision model achieves 99.2% accuracy on standard fabric types. We continuously train on new textile samples to improve precision across exotic and blended fabrics.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We currently support JPG, JPEG, and PNG formats with a maximum file size of 5MB. Images are automatically compressed before processing to ensure optimal analysis speed.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption, row-level security policies, and SOC-2 compliant infrastructure. Your fabric data is only accessible to your account.",
  },
  {
    question: "Can I use ThreadCounty for commercial production?",
    answer:
      "Yes! Our Professional and Enterprise plans are designed for production environments with continuous automated analysis, batch processing, and priority support.",
  },
  {
    question: "Do you offer an API for integration?",
    answer:
      "Our Professional and Enterprise plans include full REST API access for integrating thread analysis directly into your existing quality control and ERP systems.",
  },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Apply a spring to the scroll progress for Apple-like smoothness
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Text Opacities for the 4 scenes over 400vh
  // 0.00 - 0.25: Hero
  // 0.25 - 0.50: Fiber
  // 0.50 - 0.75: Weave
  // 0.75 - 1.00: AI

  const text1Opacity = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const text1Y = useTransform(smoothProgress, [0.15, 0.25], [0, -50]);

  const text2Opacity = useTransform(smoothProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.2, 0.3, 0.4, 0.5], [50, 0, 0, -50]);

  const text3Opacity = useTransform(smoothProgress, [0.45, 0.55, 0.65, 0.75], [0, 1, 1, 0]);
  const text3Y = useTransform(smoothProgress, [0.45, 0.55, 0.65, 0.75], [50, 0, 0, -50]);

  const text4Opacity = useTransform(smoothProgress, [0.7, 0.8, 0.9, 1], [0, 1, 1, 0]);
  const text4Y = useTransform(smoothProgress, [0.7, 0.8, 0.9, 1], [50, 0, 0, -50]);

  return (
    <div className="relative min-h-screen overflow-clip">
      <ThreadBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeInUp} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium glass text-primary">
                <Zap className="w-4 h-4" />
                AI-Powered Textile Intelligence
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.1]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Analyze Fabric with{" "}
              <GradientText animated className="block sm:inline">
                Precision AI
              </GradientText>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Upload any fabric image and receive instant thread density analysis,
              weave classification, and AI-powered quality insights. Built for
              manufacturers, researchers, and QC professionals.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-neon-indigo to-primary hover:opacity-90 text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 text-base px-8 h-12"
                >
                  Start Analyzing Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="glass border-border hover:border-primary/30 text-base px-8 h-12"
                >
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </div>
      </section>




      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Core Features"
            title="Everything You Need for"
            gradientTitle="Textile Intelligence"
            description="From thread counting to quality analytics, ThreadCounty gives you AI-powered tools to analyze and understand any fabric structure."
          />

          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <GlassCard className="h-full group">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold font-heading mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative z-10 py-24 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="How It Works"
            title="From Upload to"
            gradientTitle="Actionable Insights"
            description="Four simple steps to transform raw fabric images into detailed analytical reports."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {i < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <GlassCard className="text-center relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-neon-indigo to-aurora-emerald flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold font-heading mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Scrollytelling Container (400vh) */}
      <div ref={containerRef} className="relative h-[400vh] w-full">
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
          
          {/* The 3D Canvas running behind the text */}
          <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
            {mounted && !isMobile && (
              <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <LandingScene scrollYProgress={smoothProgress} />
              </Canvas>
            )}
          </div>

          {/* Text Overlay: Scene 1 (The Thread) */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-10"
            style={{ opacity: text1Opacity, y: text1Y }}
          >
            <div className="max-w-2xl text-center bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
              <InfinityIcon className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-balance text-white">
                It all starts with a single <GradientText>fiber</GradientText>.
              </h2>
              <p className="text-lg text-white/70">
                The fundamental building block of every textile, holding the DNA of its strength and quality.
              </p>
            </div>
          </motion.div>

          {/* Text Overlay: Scene 2 (The Weave) */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-10"
            style={{ opacity: text2Opacity, y: text2Y }}
          >
            <div className="max-w-2xl text-center bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-balance text-white">
                Woven into <GradientText>complexity</GradientText>.
              </h2>
              <p className="text-lg text-white/70">
                Thousands of threads interlock forming patterns impossible for the human eye to measure precisely.
              </p>
            </div>
          </motion.div>

          {/* Text Overlay: Scene 3 (The Zoom) */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-10"
            style={{ opacity: text3Opacity, y: text3Y }}
          >
            <div className="max-w-2xl text-center bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-balance text-white">
                Going <GradientText>deeper</GradientText>.
              </h2>
              <p className="text-lg text-white/70">
                We zoom into the microscopic gaps between the warp and weft.
              </p>
            </div>
          </motion.div>

          {/* Text Overlay: Scene 4 (Intelligence) */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-10"
            style={{ opacity: text4Opacity, y: text4Y }}
          >
            <div className="max-w-2xl text-center bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
              <ScanFace className="w-12 h-12 text-neon-indigo mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-balance text-white">
                Until <GradientText>now</GradientText>.
              </h2>
              <p className="text-lg text-white/70">
                Our computer vision models instantly map the entire matrix, analyzing thread density, weave patterns, and microscopic defects.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Stats Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <GlassCard className="text-center py-8 hover:border-primary/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl sm:text-4xl font-bold font-heading">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      className="gradient-text"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-24 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Testimonials"
            title="Trusted by Textile"
            gradientTitle="Professionals Worldwide"
            description="See what industry experts say about ThreadCounty's impact on their textile analysis workflows."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard className="h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-24 sm:py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            badge="FAQ"
            title="Frequently Asked"
            gradientTitle="Questions"
            description="Quick answers to common questions about ThreadCounty."
          />

          <div className="mt-12">
            <Accordion className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="glass rounded-xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-8">
              <Link href="/faq">
                <Button variant="outline" className="glass">
                  View All FAQs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-24 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <SectionHeading
                badge="Get in Touch"
                title="Let's Start a"
                gradientTitle="Conversation"
                description="Have questions about ThreadCounty? Reach out and our team will respond within 24 hours."
                align="left"
              />

              <div className="mt-8 space-y-4">
                <GlassCard className="flex items-center gap-4 py-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email Us</p>
                    <p className="text-sm text-muted-foreground">
                      support@threadcounty.ai
                    </p>
                  </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4 py-4">
                  <div className="w-10 h-10 rounded-lg bg-aurora-emerald/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-aurora-emerald" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Join Community</p>
                    <p className="text-sm text-muted-foreground">
                      5,000+ textile professionals
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>

            <GlassCard>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input id="contact-name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Tell us about your textile analysis needs..."
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-neon-indigo to-primary text-white"
                >
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="py-16 px-8 border-primary/20 bg-primary/5">
              <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-4">
                Ready to Revolutionize Your{" "}
                <GradientText animated>Textile Analysis?</GradientText>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-balance">
                Join thousands of professionals who trust ThreadCounty for precise,
                AI-powered fabric analysis. Start free — no credit card required.
              </p>
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-neon-indigo to-primary text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 text-base px-10 h-12 transition-all"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
