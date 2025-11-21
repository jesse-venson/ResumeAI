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
    <div className="h-full overflow-auto bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 relative">
      <div className="max-w-4xl mx-auto p-8 relative z-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal information (stored locally)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={user?.name || ''}
                    disabled
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="flex-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Profile information is currently read-only. Contact support to make changes.
              </p>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how ResumeAI looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium mb-1">Theme</div>
                  <div className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-10 w-10"
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Current theme: <span className="font-medium capitalize">{theme}</span>
              </p>
            </CardContent>
          </Card>

          {/* Data & Storage */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Storage</CardTitle>
              <CardDescription>
                Manage your local data and storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium mb-1">Local Storage</div>
                <p className="text-sm text-muted-foreground mb-3">
                  All your conversations and documents are stored locally in your browser.
                  Clearing browser data will delete this information.
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-500">
                  ⚠️ Note: Data is only accessible in this browser
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                Account Actions
              </CardTitle>
              <CardDescription>
                Manage your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full sm:w-auto"
              >
                Log Out
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                You'll be redirected to the home page
              </p>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About ResumeAI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Version: 1.0.0 (Beta)
                </p>
                <p className="text-muted-foreground">
                  AI-Powered Resume Tailoring Software
                </p>
                <Separator className="my-3" />
                <p className="text-xs text-muted-foreground">
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
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
