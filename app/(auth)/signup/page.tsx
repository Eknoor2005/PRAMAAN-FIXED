"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  User, 
  Phone,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/types";

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: "survivor", label: "Survivor", description: "Record and manage your testimony" },
  { value: "police", label: "Police Officer", description: "Access cases for investigation" },
  { value: "lawyer", label: "Lawyer", description: "Represent and support survivors" },
  { value: "ngo", label: "NGO Worker", description: "Provide support services" },
  { value: "admin", label: "Administrator", description: "System administration" },
];

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"details" | "otp">("details");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const passwordStrength = passwordRequirements.filter((req) =>
    req.test(formData.password)
  ).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (step === "details") {
      // Validation
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.role) {
        setErrorMessage("Please fill in all fields");
        return;
      }

      if (passwordStrength < 4) {
        setErrorMessage("Password does not meet security requirements");
        return;
      }

      if (!agreedToTerms || !agreedToPrivacy) {
        setErrorMessage("You must agree to the Terms and Privacy Policy");
        return;
      }

      setIsLoading(true);
      try {
        // Simulate sending OTP
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSuccessMessage("Verification code sent to your phone");
        setStep("otp");
      } catch (error) {
        setErrorMessage("Failed to send verification code. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // OTP verification
      if (otp.length !== 6) {
        setErrorMessage("Please enter a valid 6-digit code");
        return;
      }

      setIsLoading(true);
      try {
        // Simulate OTP verification and account creation
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSuccessMessage("Account created successfully!");
        router.push("/dashboard");
      } catch (error) {
        setErrorMessage("Invalid verification code. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
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
            {step === "details" ? "Create your account" : "Verify your phone"}
          </CardTitle>
          <CardDescription>
            {step === "details" 
              ? "Join PRAMAAN to access secure testimony recording"
              : `We sent a verification code to ${formData.phone}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "details" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                >
                  {errorMessage}
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary"
                >
                  {successMessage}
                </motion.div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span>{role.label}</span>
                          <span className="text-xs text-muted-foreground">{role.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            passwordStrength >= level
                              ? passwordStrength <= 1
                                ? "bg-destructive"
                                : passwordStrength <= 2
                                ? "bg-warning-soft"
                                : "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {passwordRequirements.map((req, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-1.5 text-xs ${
                            req.test(formData.password)
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {req.test(formData.password) ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          {req.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || passwordStrength < 4 || !formData.role || !agreedToTerms || !agreedToPrivacy}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Terms & Privacy */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      setErrorMessage("");
                    }}
                    className="w-4 h-4 rounded border border-border mt-1"
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-xs font-normal cursor-pointer leading-tight">
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and understand that my testimony will be securely encrypted
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={agreedToPrivacy}
                    onChange={(e) => {
                      setAgreedToPrivacy(e.target.checked);
                      setErrorMessage("");
                    }}
                    className="w-4 h-4 rounded border border-border mt-1"
                    disabled={isLoading}
                  />
                  <Label htmlFor="privacy" className="text-xs font-normal cursor-pointer leading-tight">
                    I agree to the{" "}
                    <Link href="/privacy" target="_blank" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and consent to the processing of my data
                  </Label>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-sm text-primary hover:underline"
                >
                  Change phone number
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>

          {/* Terms note */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
