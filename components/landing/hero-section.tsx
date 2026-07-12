"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Heart, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
          >
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Secure, Confidential, Survivor-Centric
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance mb-6"
          >
            Your Voice. Recorded Once.{" "}
            <span className="text-primary">Protected Forever.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
          >
            A safe space for survivors to record their testimony once, in their own words, 
            at their own pace. Our AI transforms fragmented memories into legally structured 
            documentation, so you never have to relive the trauma of repeating your story.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" asChild className="px-8">
              <Link href="/auth-options">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">Learn How It Works</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-16 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>Trauma-Informed Design</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Legally Compliant</span>
            </div>
          </motion.div>
        </div>

        {/* Hero illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-12 bg-muted flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-warning-soft" />
              <div className="w-3 h-3 rounded-full bg-primary/50" />
            </div>
            <div className="pt-12 p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Memory recording preview */}
                <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Recording Memory</h3>
                  <p className="text-sm text-muted-foreground">
                    {"\"I remember it was evening, the street lights had just come on...\""}
                  </p>
                </div>

                {/* AI processing preview */}
                <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-primary rounded animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-6 bg-primary rounded animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-3 bg-primary rounded animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">AI Structuring</h3>
                  <p className="text-sm text-muted-foreground">
                    Timeline created with 12 events identified...
                  </p>
                </div>

                {/* Legal document preview */}
                <div className="bg-secondary/50 rounded-xl p-6 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Legal Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    Documentation formatted for legal proceedings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
