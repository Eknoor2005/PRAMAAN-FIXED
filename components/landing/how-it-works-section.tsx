"use client";

import { motion } from "framer-motion";
import { Mic, Brain, FolderLock, Scale } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Mic,
    title: "Record Your Testimony",
    description: "Share your memories in your own words using voice, video, or text. Take breaks whenever you need. Save drafts and return when you're ready.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Structures Your Timeline",
    description: "Our compassionate AI organizes your fragmented memories into a clear chronological timeline, identifying key events and connections.",
  },
  {
    number: "03",
    icon: FolderLock,
    title: "Evidence Securely Stored",
    description: "Upload supporting documents, photos, and files. Everything is encrypted and stored securely, accessible only to those you authorize.",
  },
  {
    number: "04",
    icon: Scale,
    title: "Legal Teams Access Case",
    description: "Authorized lawyers, police, and support staff access your structured testimony. You never have to repeat your story again.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            How PRAMAAN Works
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            A simple, survivor-centric process that puts you in control while 
            creating legally sound documentation.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex gap-6 md:gap-10 pb-12">
                {/* Timeline line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 md:left-10 top-16 w-0.5 h-[calc(100%-4rem)] bg-border" />
                )}
                
                {/* Step number */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
                    <step.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 md:pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
