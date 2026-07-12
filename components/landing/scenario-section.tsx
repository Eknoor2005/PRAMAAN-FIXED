"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export function ScenarioSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Understanding Trauma & Memory
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Trauma affects how we remember. PRAMAAN is designed to work with, not against, 
            the natural way memories surface after difficult experiences.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-border bg-card overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  {/* Story side */}
                  <div className="p-8 md:p-10 bg-secondary/30">
                    <Quote className="w-10 h-10 text-primary/30 mb-4" />
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        <span className="text-foreground font-medium">{"\"I don't remember the exact date"}</span>, 
                        but I know the streetlights had just turned on. The smell of rain was strong that day.
                      </p>
                      <p>
                        Later, I remembered his shoes - white sneakers with a red stripe. 
                        I hadn&apos;t thought about that detail until weeks later.
                      </p>
                      <p>
                        The sound of a car horn still makes me freeze. I hear it in my dreams sometimes.
                      </p>
                      <p className="text-foreground font-medium">
                        {"These fragments felt disconnected, but they were all I had.\""}
                      </p>
                    </div>
                  </div>

                  {/* How PRAMAAN helps */}
                  <div className="p-8 md:p-10">
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      How PRAMAAN Helps
                    </h3>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            Accepts Fragments
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Record memories as they come - no need for perfect chronology
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            Builds Timeline
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            AI connects details and creates a coherent narrative
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            Validates Experience
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Normal trauma responses are documented, not questioned
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">4</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">
                            Legal Format
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Transforms personal account into court-ready documentation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
