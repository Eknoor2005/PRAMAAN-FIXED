"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

const comparisonData = {
  traditional: {
    title: "Traditional Reporting",
    items: [
      "Repeat story to multiple authorities",
      "Chronological narrative required",
      "Memory gaps questioned",
      "Multiple traumatic recounts",
      "Physical presence required",
      "Limited privacy control",
      "Paper-based documentation",
      "Inconsistencies used against survivor",
    ],
  },
  pramaan: {
    title: "PRAMAAN System",
    items: [
      "Record testimony once",
      "Fragmented memories accepted",
      "AI structures timeline",
      "Single, controlled recording",
      "Record from anywhere safely",
      "Full privacy control",
      "Secure digital vault",
      "Trauma responses documented",
    ],
  },
};

export function ComparisonSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            A Better Path to Justice
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            See how PRAMAAN transforms the reporting experience for survivors.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-border bg-card/50">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-muted-foreground mb-6">
                    {comparisonData.traditional.title}
                  </h3>
                  <ul className="space-y-4">
                    {comparisonData.traditional.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-destructive" />
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* PRAMAAN */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full border-primary/20 bg-card shadow-lg shadow-primary/5">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    {comparisonData.pramaan.title}
                  </h3>
                  <ul className="space-y-4">
                    {comparisonData.pramaan.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
