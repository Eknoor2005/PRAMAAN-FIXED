"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mic,
  Upload,
  Brain,
  MessageSquare,
  Heart,
  Clock,
  FileText,
  Image,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { listEvidence } from "@/lib/api-client";

// Mock data
const caseOverview = {
  status: "investigation",
  title: "Case #2024-001",
  lastUpdated: "2 hours ago",
  progress: 45,
};

const recentTestimonies = [
  { id: 1, type: "voice", duration: "5:32", date: "Today, 2:30 PM", status: "processed" },
  { id: 2, type: "text", preview: "I remember the sound of...", date: "Yesterday", status: "processed" },
  { id: 3, type: "video", duration: "3:15", date: "2 days ago", status: "processing" },
];

const quickActions = [
  { icon: Mic, label: "Record New Memory", href: "/dashboard/record", variant: "default" as const },
  { icon: Upload, label: "Upload Evidence", href: "/dashboard/evidence", variant: "outline" as const },
  { icon: Brain, label: "View Timeline", href: "/dashboard/timeline", variant: "outline" as const },
  { icon: MessageSquare, label: "Chat with Lawyer", href: "/dashboard/messages", variant: "outline" as const },
  { icon: Heart, label: "Support Resources", href: "/dashboard/support", variant: "outline" as const },
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

export default function DashboardPage() {
  const [evidenceStats, setEvidenceStats] = useState({ documents: 0, images: 0, videos: 0, total: 0 });

  useEffect(() => {
    listEvidence()
      .then((items) => {
        setEvidenceStats({
          documents: items.filter((e) => e.fileType === "document").length,
          images: items.filter((e) => e.fileType === "photo").length,
          videos: items.filter((e) => e.fileType === "video").length,
          total: items.length,
        });
      })
      .catch(() => {
        // Dashboard stats are non-critical — fail quietly and keep zeros
      });
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, Jane</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your case and recent activity
        </p>
      </motion.div>

      {/* Case Overview Card */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{caseOverview.title}</CardTitle>
                <CardDescription>Last updated {caseOverview.lastUpdated}</CardDescription>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning-soft/20 text-warning-soft-foreground text-sm font-medium">
                <Clock className="w-4 h-4" />
                Investigation
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Case Progress</span>
                <span className="font-medium">{caseOverview.progress}%</span>
              </div>
              <Progress value={caseOverview.progress} className="h-2" />
              <div className="flex items-center gap-4 mt-4">
                <Button size="sm" asChild>
                  <Link href="/dashboard/progress">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto py-4 flex-col gap-2"
              asChild
            >
              <Link href={action.href}>
                <action.icon className="w-5 h-5" />
                <span className="text-xs">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Testimonies */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Testimonies</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/record">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTestimonies.map((testimony) => (
                  <div
                    key={testimony.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {testimony.type === "voice" && <Mic className="w-5 h-5 text-primary" />}
                      {testimony.type === "text" && <FileText className="w-5 h-5 text-primary" />}
                      {testimony.type === "video" && <Image className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize">
                        {testimony.type} Recording
                        {testimony.duration && ` (${testimony.duration})`}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {testimony.preview || testimony.date}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {testimony.status === "processed" ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-warning-soft border-t-transparent animate-spin" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Evidence Uploaded */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Evidence Vault</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/evidence">Manage</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{evidenceStats.documents}</p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <Image className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{evidenceStats.images}</p>
                  <p className="text-xs text-muted-foreground">Images</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <Mic className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{evidenceStats.videos}</p>
                  <p className="text-xs text-muted-foreground">Videos</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  All your evidence is encrypted and securely stored. Only authorized personnel can access it.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Support Reminder */}
      <motion.div variants={itemVariants}>
        <Card className="border-destructive/10 bg-destructive/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Need immediate support?</p>
                <p className="text-sm text-muted-foreground">
                  Our helpline is available 24/7. You&apos;re not alone in this journey.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/support">Resources</Link>
                </Button>
                <Button variant="destructive" size="sm" asChild>
                  <a href="tel:1800-XXX-XXXX">Call Helpline</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
