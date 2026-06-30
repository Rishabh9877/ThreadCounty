"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThreadBackground } from "@/components/ui/ThreadBackground";

const faqCategories = [
  {
    name: "Platform & Features",
    faqs: [
      { q: "What is ThreadCounty?", a: "ThreadCounty is an AI-powered textile analysis platform that uses computer vision to analyze fabric images, measure thread density, classify weave types, and generate detailed quality reports." },
      { q: "What file formats are supported?", a: "We support JPG, JPEG, and PNG image formats. Files must be under 5MB. Images are automatically compressed before processing." },
      { q: "How does the fabric analysis work?", a: "Upload a fabric image and our AI engine uses convolutional neural networks to detect individual thread intersections, measure density per centimeter, classify the weave type, and generate confidence scores." },
      { q: "Can I export my analysis reports?", a: "Yes! All plans support viewing analysis results. Student and above plans include PDF export, and Professional plans add CSV export and API access." },
    ],
  },
  {
    name: "AI Analysis Accuracy",
    faqs: [
      { q: "How accurate is the thread density measurement?", a: "Our AI model achieves 99.2% accuracy on standard fabric types including Cotton, Denim, Twill, Satin, and Linen. Accuracy may vary for exotic or blended fabrics." },
      { q: "What factors affect analysis quality?", a: "Image resolution (300+ DPI recommended), even lighting, flat fabric surface, and minimal wrinkles or folds will produce the most accurate results." },
      { q: "How was the AI model trained?", a: "Our model was trained on 500,000+ labeled textile samples across 50+ fabric types, using a custom CNN architecture optimized for thread intersection detection." },
    ],
  },
  {
    name: "Billing & Pricing",
    faqs: [
      { q: "Is there a free plan?", a: "Yes! Our Free plan includes 5 uploads per month, basic thread density analysis, and 1GB of storage. No credit card required." },
      { q: "Can I change plans at any time?", a: "Absolutely. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle." },
      { q: "Do you offer student discounts?", a: "Yes! Our Student plan at $9/month (or $7/month billed annually) is designed specifically for students and academic researchers. Verify with a .edu email." },
      { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, AmEx), PayPal, and wire transfer for Enterprise accounts." },
    ],
  },
  {
    name: "Upload Limits & Formats",
    faqs: [
      { q: "What is the maximum file size?", a: "The maximum file size is 5MB per image. We automatically compress images before analysis to optimize processing speed." },
      { q: "How many images can I upload?", a: "Upload limits vary by plan: Free (5/month), Student (50/month), Professional (unlimited), Enterprise (unlimited with batch API)." },
      { q: "Can I upload multiple images at once?", a: "Batch uploading is available on Professional and Enterprise plans. Free and Student plans support single-image uploads." },
    ],
  },
  {
    name: "Account & Security",
    faqs: [
      { q: "How is my data protected?", a: "We use row-level security policies, end-to-end encryption, and SOC-2 compliant infrastructure. Your fabric data is only accessible to your authenticated account." },
      { q: "Can I delete my account?", a: "Yes. Go to Profile > Danger Zone > Delete Account. This permanently removes all your data including uploads, reports, and subscription information." },
      { q: "Do you support two-factor authentication?", a: "Yes, 2FA is available for all accounts via authenticator apps. We plan to add hardware key support in a future update." },
      { q: "Who can see my uploaded images?", a: "Only you and authorized admin accounts. We never share, sell, or use your textile data for training without explicit consent." },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = useMemo(() => {
    return faqCategories
      .filter((cat) => activeCategory === "all" || cat.name === activeCategory)
      .map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter(
          (faq) =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((cat) => cat.faqs.length > 0);
  }, [searchQuery, activeCategory]);

  return (
    <div className="relative min-h-screen">
      <ThreadBackground />
      <Navbar />

      <section className="relative z-10 pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeading badge="Help Center" title="Frequently Asked" gradientTitle="Questions" description="Find answers to common questions about ThreadCounty's platform, AI analysis, billing, and security." />

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search questions..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Badge variant={activeCategory === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveCategory("all")}>All</Badge>
            {faqCategories.map((cat) => (
              <Badge key={cat.name} variant={activeCategory === cat.name ? "default" : "outline"} className="cursor-pointer" onClick={() => setActiveCategory(cat.name)}>
                {cat.name}
              </Badge>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="mt-12 space-y-8">
            {filteredFaqs.map((category, ci) => (
              <motion.div key={ci} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h3 className="text-lg font-semibold font-heading mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  {category.name}
                </h3>
                <Accordion className="space-y-3">
                  {category.faqs.map((faq, fi) => (
                    <AccordionItem key={fi} value={`${ci}-${fi}`} className="glass rounded-xl px-6 border-none">
                      <AccordionTrigger className="text-left text-sm font-medium hover:no-underline py-4">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}

            {filteredFaqs.length === 0 && (
              <GlassCard className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No matching questions found</p>
                <p className="text-sm text-muted-foreground mt-1">Try different search terms or browse all categories.</p>
              </GlassCard>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
