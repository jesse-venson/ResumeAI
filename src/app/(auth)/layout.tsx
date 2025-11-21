'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Wait for Zustand to rehydrate from localStorage
  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // If already hydrated, set immediately
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    // Fallback: force hydration after 1 second if it hasn't completed
    const timeout = setTimeout(() => {
      if (!hasHydrated) {
        console.warn('Hydration timeout - forcing hydration complete');
        setHasHydrated(true);
      }
    }, 1000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [hasHydrated]);

  // Show loading during hydration
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
