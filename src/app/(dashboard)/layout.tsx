'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useConversationStore, useDocumentStore } from '@/lib/store';
import { Sidebar } from '@/components/sidebar/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadConversations = useConversationStore((state) => state.loadConversations);
  const loadDocuments = useDocumentStore((state) => state.loadDocuments);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  // Wait for Zustand to rehydrate from localStorage
  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // If already hydrated (e.g., fast connection), set immediately
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsubscribe;
  }, []);

  // Check auth only AFTER hydration completes
  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Load data from Supabase when authenticated
  useEffect(() => {
    if (hasHydrated && isAuthenticated && !hasLoadedData) {
      Promise.all([
        loadConversations(),
        loadDocuments(),
      ]).then(() => {
        setHasLoadedData(true);
      });
    }
  }, [hasHydrated, isAuthenticated, hasLoadedData, loadConversations, loadDocuments]);

  // Show loading state during hydration
  if (!hasHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/40 dark:from-gray-950 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Return null only after confirming user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
