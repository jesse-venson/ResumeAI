'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md fade-in bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400/80" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-white/90">Check your email</CardTitle>
          <CardDescription className="text-center text-white/40">
            We've sent a password reset link to <strong className="text-white/60">{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/30 text-center">
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </p>
          <Link href="/login" className="block">
            <Button
              variant="outline"
              className="w-full bg-white/[0.03] border-white/[0.08] text-white/70 hover:bg-white/[0.06] hover:text-white/90 hover:border-white/[0.12]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </Link>
          <div className="text-center text-sm text-white/30">
            Didn't receive the email?{' '}
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="text-blue-400/70 hover:text-blue-400 font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md fade-in bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-400/80" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center text-white/90">Reset your password</CardTitle>
        <CardDescription className="text-center text-white/40">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/60">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 focus:border-blue-500/50 focus:ring-blue-500/20"
            />
          </div>
          {error && (
            <div className="text-sm text-red-400 text-center">{error}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-white/40 hover:text-white/60 inline-flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
