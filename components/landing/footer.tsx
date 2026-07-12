"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Phone, Mail, MapPin } from "lucide-react";

const footerLinks = {
  platform: {
    title: "Platform",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Security", href: "#security" },
      { label: "For Organizations", href: "/organizations" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Support Hub", href: "/support" },
      { label: "Legal Education", href: "/resources/legal" },
      { label: "Mental Health", href: "/resources/mental-health" },
      { label: "NGO Directory", href: "/resources/ngo" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Data Protection", href: "/data-protection" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  emergency: {
    title: "Emergency Help",
    links: [
      { label: "24/7 Helpline", href: "tel:1800-XXX-XXXX" },
      { label: "Crisis Chat", href: "/crisis-chat" },
      { label: "Find Local NGO", href: "/find-ngo" },
      { label: "Safety Planning", href: "/safety-planning" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg text-foreground">PRAMAAN</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-6">
                The Digital Testimony Passport. Your voice, recorded once, protected forever.
              </p>
              <div className="space-y-3">
                <a 
                  href="tel:1800-XXX-XXXX" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  1800-XXX-XXXX
                </a>
                <a 
                  href="mailto:support@pramaan.org" 
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@pramaan.org
                </a>
              </div>
            </div>

            {/* Links columns */}
            {Object.values(footerLinks).map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-4 px-6 rounded-xl bg-destructive/5 border border-destructive/10 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-foreground">In immediate danger?</p>
                <p className="text-sm text-muted-foreground">
                  Call emergency services or our 24/7 helpline immediately
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="tel:112"
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:bg-destructive/90 transition-colors"
              >
                Call 112
              </a>
              <a
                href="tel:1800-XXX-XXXX"
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
              >
                Helpline
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PRAMAAN. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>A humanitarian initiative for justice</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
