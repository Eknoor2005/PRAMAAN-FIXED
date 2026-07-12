"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  Users,
  Database,
  Bell,
  Smartphone,
  Save,
  CheckCircle2,
  AlertCircle,
  Key,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PrivacySettingsPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    // Data Visibility
    profileVisibility: "private" as "private" | "advocates-only" | "case-team",
    testimoniesVisibility: "private" as "private" | "case-team",
    evidenceVisibility: "private" as "private" | "case-team",

    // Encryption
    e2eEncryption: true,
    encryptionKey: "enabled",

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    caseUpdateNotifications: true,
    accessLogNotifications: true,

    // Two Factor
    twoFactorEnabled: false,
    twoFactorMethod: "sms" as "sms" | "email" | "authenticator",

    // Data & Privacy
    allowDataAnalytics: false,
    dataRetentionPolicy: "unlimited" as "1-year" | "5-year" | "unlimited",
    allowThirdPartyTools: false,
  });

  const handleSettingChange = (
    setting: keyof typeof settings,
    value: any
  ) => {
    setSettings({ ...settings, [setting]: value });
  };

  const handleSave = async () => {
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Privacy & Security</h1>
          <p className="text-muted-foreground mt-1">
            Manage how your data is protected and who can access it
          </p>
        </div>
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <p className="text-sm text-primary font-medium">Settings saved successfully</p>
        </motion.div>
      )}

      {/* Data Visibility Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <CardTitle>Data Visibility</CardTitle>
            </div>
            <CardDescription>
              Control who can see your profile, testimonies, and evidence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Visibility */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Profile Visibility</Label>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) =>
                  handleSettingChange(
                    "profileVisibility",
                    value as "private" | "advocates-only" | "case-team"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div>
                      <p className="font-medium">Private</p>
                      <p className="text-xs text-muted-foreground">Only you can see your profile</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="advocates-only">
                    <div>
                      <p className="font-medium">Advocates Only</p>
                      <p className="text-xs text-muted-foreground">Visible to your assigned advocate</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="case-team">
                    <div>
                      <p className="font-medium">Case Team</p>
                      <p className="text-xs text-muted-foreground">Visible to police, lawyer, and advocate</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Your personal information like name and contact details will never be publicly shared
              </p>
            </div>

            {/* Testimonies Visibility */}
            <div className="space-y-3 border-t border-border pt-6">
              <Label className="text-base font-medium">Testimonies Visibility</Label>
              <Select
                value={settings.testimoniesVisibility}
                onValueChange={(value) =>
                  handleSettingChange(
                    "testimoniesVisibility",
                    value as "private" | "case-team"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div>
                      <p className="font-medium">Private (Only You)</p>
                      <p className="text-xs text-muted-foreground">No one else can access your recordings</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="case-team">
                    <div>
                      <p className="font-medium">Case Team</p>
                      <p className="text-xs text-muted-foreground">Shared with authorized case personnel</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Evidence Visibility */}
            <div className="space-y-3 border-t border-border pt-6">
              <Label className="text-base font-medium">Evidence Visibility</Label>
              <Select
                value={settings.evidenceVisibility}
                onValueChange={(value) =>
                  handleSettingChange(
                    "evidenceVisibility",
                    value as "private" | "case-team"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div>
                      <p className="font-medium">Private (Only You)</p>
                      <p className="text-xs text-muted-foreground">Keep all evidence completely private</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="case-team">
                    <div>
                      <p className="font-medium">Case Team</p>
                      <p className="text-xs text-muted-foreground">Shared only with involved legal professionals</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Encryption Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle>Encryption & Security</CardTitle>
            </div>
            <CardDescription>
              Your data is protected with military-grade encryption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* E2E Encryption */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">End-to-End Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    All data encrypted with AES-256
                  </p>
                </div>
              </div>
              <div className="w-12 h-7 rounded-full bg-primary relative">
                <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white" />
              </div>
            </div>

            {/* Key Management */}
            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                <Label className="text-base font-medium">Encryption Keys</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Your private encryption key is securely stored and never shared
              </p>
              <Button variant="outline" className="w-full">
                Rotate Encryption Key
              </Button>
            </div>

            {/* Download Keys */}
            <div className="space-y-3 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                Download and backup your encryption keys for recovery purposes
              </p>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="w-4 h-4" />
                Download Key Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <CardTitle>Two-Factor Authentication</CardTitle>
            </div>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="font-medium text-foreground">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Require a verification code when signing in
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorEnabled}
                  onChange={(e) =>
                    handleSettingChange("twoFactorEnabled", e.target.checked)
                  }
                  className="w-5 h-5"
                />
              </label>
            </div>

            {settings.twoFactorEnabled && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 border-t border-border pt-6"
              >
                <Label className="text-base font-medium">2FA Method</Label>
                <Select
                  value={settings.twoFactorMethod}
                  onValueChange={(value) =>
                    handleSettingChange(
                      "twoFactorMethod",
                      value as "sms" | "email" | "authenticator"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS to Your Phone</SelectItem>
                    <SelectItem value="email">Email Verification</SelectItem>
                    <SelectItem value="authenticator">Authenticator App</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Choose how you want to be notified about important events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange("emailNotifications", e.target.checked)
                  }
                  className="w-5 h-5"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive urgent alerts via SMS
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) =>
                    handleSettingChange("smsNotifications", e.target.checked)
                  }
                  className="w-5 h-5"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="font-medium text-foreground">Case Updates</p>
                <p className="text-sm text-muted-foreground">
                  Notify me when case status changes
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.caseUpdateNotifications}
                  onChange={(e) =>
                    handleSettingChange("caseUpdateNotifications", e.target.checked)
                  }
                  className="w-5 h-5"
                />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="font-medium text-foreground">Access Logs</p>
                <p className="text-sm text-muted-foreground">
                  Notify me when someone accesses my evidence
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.accessLogNotifications}
                  onChange={(e) =>
                    handleSettingChange("accessLogNotifications", e.target.checked)
                  }
                  className="w-5 h-5"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data & Privacy */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <CardTitle>Data & Privacy</CardTitle>
            </div>
            <CardDescription>
              Manage how your data is processed and retained
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div>
                <p className="font-medium text-foreground">Anonymous Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Help us improve PRAMAAN with anonymous usage data
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowDataAnalytics}
                  onChange={(e) =>
                    handleSettingChange("allowDataAnalytics", e.target.checked)
                  }
                  className="w-5 h-5"
                />
              </label>
            </div>

            <div className="space-y-3 border-t border-border pt-6">
              <Label className="text-base font-medium">Data Retention</Label>
              <Select
                value={settings.dataRetentionPolicy}
                onValueChange={(value) =>
                  handleSettingChange(
                    "dataRetentionPolicy",
                    value as "1-year" | "5-year" | "unlimited"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-year">Delete after 1 year of inactivity</SelectItem>
                  <SelectItem value="5-year">Delete after 5 years</SelectItem>
                  <SelectItem value="unlimited">Keep indefinitely</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border border-t mt-6 pt-6">
              <div>
                <p className="font-medium text-foreground">Third-Party Integrations</p>
                <p className="text-sm text-muted-foreground">
                  Allow PRAMAAN to use third-party tools for analysis
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowThirdPartyTools}
                  onChange={(e) =>
                    handleSettingChange("allowThirdPartyTools", e.target.checked)
                  }
                  className="w-5 h-5"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </motion.div>
    </motion.div>
  );
}
