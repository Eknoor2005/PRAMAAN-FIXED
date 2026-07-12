"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Home,
  Mic,
  FolderLock,
  Brain,
  BarChart3,
  MessageSquare,
  Heart,
  Settings,
  LogOut,
  Phone,
  Lock,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Mic, label: "Record Memory", href: "/dashboard/record" },
  { icon: Brain, label: "AI Timeline", href: "/dashboard/timeline" },
  { icon: FolderLock, label: "Evidence Vault", href: "/dashboard/evidence" },
  { icon: BarChart3, label: "Case Progress", href: "/dashboard/progress" },
  { icon: Zap, label: "Utilities", href: "/dashboard/utilities" },
  { icon: Lock, label: "Privacy Settings", href: "/dashboard/privacy" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  { icon: Heart, label: "Support Hub", href: "/dashboard/support" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-sm"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-sidebar-foreground">PRAMAAN</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Emergency Help Button */}
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-2"
              asChild
            >
              <a href="tel:1800-XXX-XXXX">
                <Phone className="w-4 h-4" />
                Emergency Help
              </a>
            </Button>
          </div>

          {/* Bottom navigation */}
          <div className="p-4 border-t border-sidebar-border">
            <ul className="space-y-1">
              {bottomNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                  onClick={() => {
                    // Handle logout
                    window.location.href = "/login";
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>

          {/* User info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-accent-foreground">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Jane Doe</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">Survivor</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
