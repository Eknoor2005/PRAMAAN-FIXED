'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { firebaseSignup, firebaseLogin, firebaseSocialAuth } from '@/lib/api-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function FirebaseAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignUp = searchParams.get('mode') === 'signup';

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setErrorMessage('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setErrorMessage('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setErrorMessage('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        if (!formData.name) {
          setErrorMessage('Please enter your name');
          setIsLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Send the verified Firebase identity to our backend to create the PRAMAAN account
        const idToken = await userCredential.user.getIdToken();
        await firebaseSignup({
          idToken,
          firebaseUid: userCredential.user.uid,
          email: formData.email,
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' '),
          authMethod: 'firebase',
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const idToken = await userCredential.user.getIdToken();
        await firebaseLogin({
          idToken,
          firebaseUid: userCredential.user.uid,
          email: formData.email,
        });
      }

      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: typeof googleProvider, providerName: string) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await firebaseSocialAuth({
        idToken,
        firebaseUid: result.user.uid,
        email: result.user.email || '',
        firstName: result.user.displayName?.split(' ')[0] || 'User',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        authMethod: providerName.toLowerCase(),
        photoURL: result.user.photoURL,
      });

      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : `${providerName} authentication failed`;
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
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
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Join PRAMAAN and secure your testimony'
              : 'Welcome back to your safe space'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialAuth(googleProvider, 'Google')}
              disabled={isLoading}
              className="gap-2"
            >
              <Chrome className="w-4 h-4" />
              Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email Auth Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrorMessage('');
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrorMessage('');
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrorMessage('');
                  }}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      setErrorMessage('');
                    }}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle between login and signup */}
          <div className="text-center text-sm text-muted-foreground">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link href="/firebase/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Link href="/firebase/signup" className="text-primary hover:underline font-medium">
                  Create one
                </Link>
              </>
            )}
          </div>

          {/* Security note */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground text-center">
              Your connection is secured with military-grade encryption. All Firebase connections use secure tokens.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
