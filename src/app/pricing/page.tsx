"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Building2, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientText } from "@/components/ui/GradientText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThreadBackground } from "@/components/ui/ThreadBackground";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    icon: Zap,
    price: { monthly: 0, annual: 0 },
    description: "Perfect for trying out ThreadCounty",
    features: [
      "5 uploads per month",
      "Basic thread density analysis",
      "Standard resolution",
      "Community support",
      "1 GB storage",
    ],
    notIncluded: [
      "PDF report export",
      "API access",
      "Batch processing",
      "Custom AI models",
    ],
    cta: "Get Started Free",
    popular: false,
    gradient: "from-slate-500 to-slate-600",
  },
  {
    name: "Student",
    icon: GraduationCap,
    price: { monthly: 9, annual: 7 },
    description: "Ideal for students and researchers",
    features: [
      "50 uploads per month",
      "Advanced thread density analysis",
      "High resolution support",
      "PDF report export",
      "Email support",
      "5 GB storage",
      "Warp/weft visualization",
    ],
    notIncluded: [
      "API access",
      "Batch processing",
      "Custom AI models",
    ],
    cta: "Start Student Plan",
    popular: false,
    gradient: "from-aurora-emerald to-teal-accent",
  },
  {
    name: "Professional",
    icon: Star,
    price: { monthly: 29, annual: 24 },
    description: "For production QC teams",
    features: [
      "Unlimited uploads",
      "Full AI analysis suite",
      "Maximum resolution",
      "PDF & CSV export",
      "REST API access",
      "Priority processing",
      "25 GB storage",
      "Batch processing",
      "Priority support",
    ],
    notIncluded: ["Custom AI models"],
    cta: "Go Professional",
    popular: true,
    gradient: "from-neon-indigo to-primary",
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: { monthly: -1, annual: -1 },
    description: "Custom solutions for large teams",
    features: [
      "Everything in Professional",
      "Custom AI model training",
      "Unlimited storage",
      "Dedicated infrastructure",
      "SSO / SAML authentication",
      "SLA guarantee",
      "Custom integrations",
      "On-premise deployment",
      "Dedicated account manager",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-amber-500 to-orange-500",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    setIsSubmitting(planName);
    try {
      const { updateSubscription } = await import("@/app/actions/subscription");
      const result = await updateSubscription(planName, isAnnual);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred during subscription.");
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <ThreadBackground />
      <Navbar />

      <section className="relative z-10 pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            badge="Pricing"
            title="Simple, Transparent"
            gradientTitle="Pricing"
            description="Choose the plan that fits your textile analysis needs. All plans include core AI features."
          />

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <Label
              htmlFor="billing-toggle"
              className={cn("text-sm", !isAnnual && "text-foreground font-medium")}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label
              htmlFor="billing-toggle"
              className={cn("text-sm", isAnnual && "text-foreground font-medium")}
            >
              Annual
              <Badge variant="secondary" className="ml-2 text-xs">
                Save 20%
              </Badge>
            </Label>
          </div>

          {/* Pricing Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard
                  className={cn(
                    "h-full flex flex-col relative",
                    plan.popular && "border-primary/50 glow-indigo"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-neon-indigo to-primary text-white shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-3`}
                    >
                      <plan.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold font-heading">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    {plan.price.monthly === -1 ? (
                      <div className="text-3xl font-bold font-heading">
                        Custom
                      </div>
                    ) : (
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold font-heading">
                          <GradientText>
                            $
                            {isAnnual ? plan.price.annual : plan.price.monthly}
                          </GradientText>
                        </span>
                        <span className="text-sm text-muted-foreground mb-1">
                          /month
                        </span>
                      </div>
                    )}
                    {isAnnual && plan.price.monthly > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Billed annually ($
                        {plan.price.annual * 12}/year)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-aurora-emerald flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      "w-full",
                      plan.popular
                        ? "bg-gradient-to-r from-neon-indigo to-primary text-white shadow-lg"
                        : "glass"
                    )}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={isSubmitting === plan.name}
                  >
                    {isSubmitting === plan.name ? "Processing..." : plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
