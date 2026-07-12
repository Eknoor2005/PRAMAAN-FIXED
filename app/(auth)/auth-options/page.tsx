'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Chrome, Github, ArrowRight } from 'lucide-react';

export default function AuthOptionsPage() {
  const router = useRouter();
  const [selectedAuth, setSelectedAuth] = useState<string | null>(null);

  const authOptions = [
    {
      id: 'email',
      title: 'Email & Password',
      description: 'Traditional login with email and password. Full control over your account.',
      icon: Mail,
      href: '/login',
      color: 'from-blue-400 to-blue-600',
      features: ['Your password', 'Complete privacy', 'No data sharing'],
    },
    {
      id: 'google',
      title: 'Google Sign-In',
      description: 'Quick and easy. Uses your Google account for seamless authentication.',
      icon: Chrome,
      href: '/firebase/login',
      color: 'from-red-400 to-red-600',
      features: ['One-click login', 'Secure Google Auth', 'Email auto-filled'],
    },
    {
      id: 'github',
      title: 'GitHub Sign-In',
      description: 'For developers. Use your GitHub account to access PRAMAAN.',
      icon: Github,
      href: '/firebase/login',
      color: 'from-gray-700 to-gray-900',
      features: ['GitHub verified', 'Developer friendly', 'Secure tokens'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Choose Your Login Method</h1>
        </div>
        <p className="text-muted-foreground">
          Select how you want to secure your account and access your testimony
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {authOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedAuth(option.id)}
            >
              <Card
                className={`cursor-pointer transition-all border-2 ${
                  selectedAuth === option.id ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} p-2.5 mb-3`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className="w-full"
                    variant={selectedAuth === option.id ? 'default' : 'outline'}
                  >
                    <Link href={option.href}>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Security notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-lg bg-primary/5 border border-primary/10"
      >
        <p className="text-sm text-muted-foreground text-center">
          All authentication methods are secured with military-grade encryption. Your data is never shared without consent.
        </p>
      </motion.div>

      {/* Back link */}
      <div className="text-center">
        <Link href="/" className="text-sm text-primary hover:underline">
          Back to home
        </Link>
      </div>
    </motion.div>
  );
}
