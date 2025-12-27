'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore, useThemeStore } from '@/lib/store';
import { Moon, Sun, User, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="h-full overflow-auto bg-[#0c0c12] relative">
      <div className="max-w-4xl mx-auto p-8 relative z-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white/90">Settings</h1>
          <p className="text-white/40">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white/90">Profile Information</CardTitle>
              <CardDescription className="text-white/40">
                Your personal information (stored locally)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/60">Full Name</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-white/30" />
                  <Input
                    id="name"
                    value={user?.name || ''}
                    disabled
                    className="flex-1 bg-white/[0.03] border-white/[0.08] text-white/70"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/60">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/30" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="flex-1 bg-white/[0.03] border-white/[0.08] text-white/70"
                  />
                </div>
              </div>
              <p className="text-xs text-white/30">
                Profile information is currently read-only. Contact support to make changes.
              </p>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white/90">Appearance</CardTitle>
              <CardDescription className="text-white/40">
                Customize how ResumeAI looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium mb-1 text-white/80">Theme</div>
                  <div className="text-sm text-white/40">
                    Switch between light and dark mode
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-10 w-10 bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:text-white/90"
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-white/30">
                Current theme: <span className="font-medium capitalize text-white/50">{theme}</span>
              </p>
            </CardContent>
          </Card>

          {/* Data & Storage */}
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white/90">Data & Storage</CardTitle>
              <CardDescription className="text-white/40">
                Manage your local data and storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium mb-1 text-white/80">Local Storage</div>
                <p className="text-sm text-white/40 mb-3">
                  All your conversations and documents are stored locally in your browser.
                  Clearing browser data will delete this information.
                </p>
                <p className="text-xs text-amber-400/70">
                  ⚠️ Note: Data is only accessible in this browser
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-white/[0.03] border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400">
                Account Actions
              </CardTitle>
              <CardDescription className="text-white/40">
                Manage your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full sm:w-auto bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50"
              >
                Log Out
              </Button>
              <p className="text-xs text-white/30 mt-3">
                You'll be redirected to the home page
              </p>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="text-white/90">About ResumeAI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p className="text-white/40">
                  Version: 1.0.0 (Beta)
                </p>
                <p className="text-white/40">
                  AI-Powered Resume Tailoring Software
                </p>
                <Separator className="my-3 bg-white/[0.06]" />
                <p className="text-xs text-white/30">
                  Built with Next.js, TypeScript, and Tailwind CSS
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:text-white/90"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
