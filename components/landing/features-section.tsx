"use client";

import { motion } from "framer-motion";
import { 
  Mic, 
  Brain, 
  Lock, 
  FileText, 
  Shield, 
  Heart 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Mic,
    title: "One-Time Testimony Recording",
    description: "Record your memories once, in your own words, at your own pace. Voice, video, or text - whatever feels right.",
  },
  {
    icon: Brain,
    title: "AI Testimony Structuring",
    description: "Our AI gently organizes fragmented memories into a chronological timeline without requiring you to relive trauma.",
  },
  {
    icon: Lock,
    title: "Secure Evidence Vault",
    description: "Upload and store documents, photos, medical reports with military-grade encryption. Your evidence stays safe.",
  },
  {
    icon: FileText,
    title: "Legal-Ready Documentation",
    description: "Automatically generate properly formatted documents that meet legal requirements for proceedings.",
  },
  {
    icon: Shield,
    title: "Privacy Control",
    description: "You decide who sees what. Control access permissions for police, lawyers, and support staff.",
  },
  {
    icon: Heart,
    title: "Support Hub",
    description: "Access mental health resources, helplines, NGO contacts, and legal education materials anytime.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Built for Survivors, Designed with Care
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Every feature is crafted with trauma-informed principles to ensure your 
            journey towards justice is as gentle as possible.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-border bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
