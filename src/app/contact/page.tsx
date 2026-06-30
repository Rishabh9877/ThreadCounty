"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone, Twitter, Github, Linkedin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThreadBackground } from "@/components/ui/ThreadBackground";
import { toast } from "sonner";

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@threadcounty.ai", href: "mailto:support@threadcounty.ai" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
  { icon: MapPin, label: "Office", value: "100 Innovation Drive, Palo Alto, CA 94301", href: "#" },
  { icon: MessageSquare, label: "Live Chat", value: "Available 9am–6pm PST", href: "#" },
];

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.subject) newErrors.subject = "Please select a subject";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.length < 10) newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const { submitContactForm } = await import("@/app/actions/contact");
      const result = await submitContactForm(formData);
      
      if (result.success) {
        toast.success(result.message || "Message sent successfully! We'll respond within 24 hours.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <ThreadBackground />
      <Navbar />

      <section className="relative z-10 pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading badge="Contact" title="Get in" gradientTitle="Touch" description="Have questions? We'd love to hear from you. Our team responds within 24 hours." />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((item, i) => (
                <motion.a key={i} href={item.href} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="flex items-center gap-4 py-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.value}</p>
                    </div>
                  </GlassCard>
                </motion.a>
              ))}

              {/* Social Links */}
              <GlassCard>
                <p className="text-sm font-semibold mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {socialLinks.map((s, i) => (
                    <a key={i} href={s.href} className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label={s.label}>
                      <s.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </GlassCard>

              {/* Map Placeholder */}
              <GlassCard className="h-48 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo/10 via-transparent to-aurora-emerald/10" />
                <div className="relative text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Palo Alto, California</p>
                </div>
              </GlassCard>
            </div>

            {/* Contact Form */}
            <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <GlassCard>
                <h2 className="text-xl font-bold font-heading mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Full Name</Label>
                      <Input id="contact-name" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? "border-destructive" : ""} />
                      {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input id="contact-email" type="email" placeholder="you@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={errors.email ? "border-destructive" : ""} />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Select value={formData.subject} onValueChange={(val) => setFormData({ ...formData, subject: val || "" })}>
                      <SelectTrigger className={errors.subject ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="sales">Sales & Pricing</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea id="contact-message" placeholder="Tell us how we can help..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={errors.message ? "border-destructive" : ""} />
                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-neon-indigo to-primary text-white gap-2">
                    <Send className="w-4 h-4" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
