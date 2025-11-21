'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Sun,
  Moon,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useConversationStore, useAuthStore, useThemeStore, useDocumentStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const router = useRouter();
  const { conversations, currentConversationId, setCurrentConversation, addConversation, deleteConversation } =
    useConversationStore();
  const { documents, deleteDocument } = useDocumentStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('conversations');

  const handleNewConversation = () => {
    // This will be handled by the service selection
    setCurrentConversation(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDocumentClick = (conversationId: string) => {
    setCurrentConversation(conversationId);
    router.push('/dashboard');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDateGroup = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return 'Older';
    }
  };

  // Sort conversations by most recent first
  const sortedConversations = [...conversations].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Group conversations by date
  const groupedConversations = sortedConversations.reduce((groups, conv) => {
    const group = getDateGroup(conv.createdAt);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(conv);
    return groups;
  }, {} as Record<string, typeof sortedConversations>);

  const groupedDocuments = documents.reduce((groups, doc) => {
    if (!groups[doc.type]) {
      groups[doc.type] = [];
    }
    groups[doc.type].push(doc);
    return groups;
  }, {} as Record<string, typeof documents>);

  return (
    <div className="w-64 h-screen bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col relative overflow-hidden z-10">
      {/* Header */}
      <div className="p-3 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">ResumeAI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-7 w-7">
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </Button>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8 text-xs"
          onClick={handleNewConversation}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Conversation
        </Button>
      </div>

      {/* Tabs - takes remaining space */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-3 grid w-auto grid-cols-2 h-8">
          <TabsTrigger value="conversations" className="text-xs py-1">
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs py-1">
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Docs
          </TabsTrigger>
        </TabsList>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="flex-1 mt-0">
          <ScrollArea className="h-[calc(100vh-240px)] scrollbar-thin">
            <div className="p-3 space-y-3 pb-20">
              {sortedConversations.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-8">
                  No conversations yet
                </div>
              ) : (
                ['Today', 'Yesterday', 'Older'].map((groupName) => {
                  const convs = groupedConversations[groupName];
                  if (!convs || convs.length === 0) return null;

                  return (
                    <div key={groupName} className="space-y-0.5">
                      <div className="text-[10px] font-medium text-muted-foreground px-2 uppercase tracking-wide">
                        {groupName}
                      </div>
                      {convs.map((conv) => (
                        <div
                          key={conv.id}
                          className="group relative w-full"
                        >
                          <button
                            onClick={() => setCurrentConversation(conv.id)}
                            className={cn(
                              'w-full text-left px-2.5 py-1.5 rounded-md text-xs hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all duration-200 cursor-pointer',
                              currentConversationId === conv.id &&
                                'bg-purple-100/60 dark:bg-purple-900/40 shadow-sm'
                            )}
                          >
                            <div className="flex items-center justify-between gap-2 pr-7">
                              <div className="font-medium truncate leading-tight flex-1">
                                {conv.serviceType === 'cover-letter' ? 'Cover Letter' : conv.serviceType === 'sop' ? 'SOP' : 'Resume'}
                              </div>
                              <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {formatTime(conv.createdAt)}
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this conversation?')) {
                                deleteConversation(conv.id);
                                if (currentConversationId === conv.id) {
                                  router.push('/dashboard');
                                }
                              }
                            }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded hover:bg-red-100 dark:hover:bg-red-950/50 text-gray-400 hover:text-red-600 dark:text-gray-600 dark:hover:text-red-400 flex items-center justify-center transition-colors"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="flex-1 mt-0">
          <ScrollArea className="h-[calc(100vh-240px)] scrollbar-thin">
            <div className="p-3 space-y-3 pb-20">
              {Object.keys(groupedDocuments).length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-8">
                  No documents yet
                </div>
              ) : (
                Object.entries(groupedDocuments).map(([type, docs]) => (
                  <div key={type} className="space-y-0.5">
                    <div className="text-[10px] font-medium text-muted-foreground px-2 capitalize uppercase tracking-wide">
                      {type.replace('-', ' ')}s ({docs.length})
                    </div>
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        className="group relative w-full"
                      >
                        <button
                          onClick={() => handleDocumentClick(doc.conversationId)}
                          className="w-full text-left px-2.5 py-1.5 rounded-md text-xs hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all duration-200 cursor-pointer"
                        >
                          <div className="font-medium truncate pr-7 leading-tight">{doc.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this document?')) {
                              deleteDocument(doc.id);
                            }
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded hover:bg-red-100 dark:hover:bg-red-950/50 text-gray-400 hover:text-red-600 dark:text-gray-600 dark:hover:text-red-400 flex items-center justify-center transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 group">
        {/* Hover trigger area - allows clicks to pass through */}
        <div className="h-12 w-full absolute bottom-0 pointer-events-none" />

        {/* Footer content - slides up on hover */}
        <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 shadow-2xl relative z-20">
          <div className="p-3 space-y-1.5">
            <div className="px-2 py-1.5 text-xs">
              <div className="font-medium truncate">{user?.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
            </div>
            <Separator className="bg-gray-200/50 dark:bg-gray-800/50" />
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 h-7 text-xs"
                onClick={() => router.push('/settings')}
              >
                <Settings className="w-3 h-3 mr-1.5" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50/50 dark:hover:bg-red-950/30 h-7 px-2"
              >
                <LogOut className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
