"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending reset email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isSubmitted ? "Check your email" : "Reset your password"}
          </CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "We sent a password reset link to your email"
              : "Enter your email and we'll send you a reset link"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try another email
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <Button variant="ghost" className="w-full" asChild>
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign in
                </Link>
              </Button>
            </form>
          )}

          {/* Security note */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              For your security, password reset links expire after 24 hours. 
              If you need help, contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
