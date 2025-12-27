'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Use replace to prevent back button from returning to login
        router.replace('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md fade-in bg-white/[0.03] border-white/[0.08] backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-400/80" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center text-white/90">Welcome back</CardTitle>
        <CardDescription className="text-center text-white/40">
          Log in to your ResumeAI account
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-white/60">Password</Label>
              <Link href="/forgot-password" className="text-sm text-blue-400/70 hover:text-blue-400 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-white/40">Don't have an account? </span>
          <Link href="/signup" className="text-blue-400/70 hover:text-blue-400 font-medium transition-colors">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
