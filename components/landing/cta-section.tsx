"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-secondary to-secondary/50 p-8 md:p-16 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-8">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                Justice Should Not Require Reliving Trauma
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
                Every survivor deserves to be heard without having to repeat their 
                story over and over. PRAMAAN ensures your voice is recorded once 
                and protected forever.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="px-8">
                  <Link href="/auth-options">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#resources">Access Resources</Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-8">
                Need immediate help? Call our 24/7 helpline or chat with a support counselor.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
