import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Conversation, GeneratedDocument, ServiceType } from '@/types';
import { createClient } from '@/lib/supabase/client';

// Helper function to generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  loadConversations: () => Promise<void>;
  addConversation: (serviceType: ServiceType) => Promise<string>;
  updateConversation: (id: string, updates: Partial<Conversation>) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  getCurrentConversation: () => Conversation | null;
  setCurrentConversation: (id: string | null) => void;
}

interface DocumentState {
  documents: GeneratedDocument[];
  isLoading: boolean;
  loadDocuments: () => Promise<void>;
  addDocument: (document: Omit<GeneratedDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDocument: (id: string, updates: Partial<GeneratedDocument>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentsByType: (type: ServiceType) => GeneratedDocument[];
}

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error('Login error:', error.message);
            return { success: false, error: error.message };
          }

          if (data.user) {
            // Fetch user profile from database
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              name: profile?.name || data.user.email!.split('@')[0],
              createdAt: profile?.created_at || new Date().toISOString(),
            };

            set({ user, isAuthenticated: true });
            return { success: true };
          }
          return { success: false, error: 'No user data returned' };
        } catch (error: any) {
          console.error('Login error:', error);
          return { success: false, error: error.message || 'Login failed' };
        }
      },
      signup: async (name: string, email: string, password: string) => {
        try {
          const supabase = createClient();

          console.log('Starting signup for:', email);

          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
              },
            },
          });

          if (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
          }

          console.log('Signup response:', data);

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              name,
              createdAt: new Date().toISOString(),
            };

            set({ user, isAuthenticated: true });
            return { success: true };
          }
          return { success: false, error: 'No user data returned from signup' };
        } catch (error: any) {
          console.error('Signup error:', error);
          return { success: false, error: error.message || 'Signup failed' };
        }
      },
      logout: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Logout error:', error);
        }

        // Clear Zustand state
        set({ user: null, isAuthenticated: false });

        // Clear all localStorage to prevent stale data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('conversation-storage');
          localStorage.removeItem('document-storage');
          // Keep theme-storage - user preference should persist
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,
      loadConversations: async () => {
        try {
          set({ isLoading: true });
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            set({ conversations: [], isLoading: false });
            return;
          }

          // Load conversations from Supabase
          const { data: conversationsData, error: convError } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (convError) throw convError;

          // Load messages, uploaded files, and documents for each conversation
          const conversations: Conversation[] = await Promise.all(
            (conversationsData || []).map(async (conv) => {
              // Load messages
              const { data: messages } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conv.id)
                .order('timestamp', { ascending: true });

              // Load uploaded files
              const { data: uploadedFiles } = await supabase
                .from('uploaded_files')
                .select('*')
                .eq('conversation_id', conv.id)
                .order('uploaded_at', { ascending: true });

              // Load generated documents (for the conversation view)
              const { data: generatedDocs } = await supabase
                .from('documents')
                .select('*')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: true });

              return {
                id: conv.id,
                title: conv.title,
                serviceType: conv.service_type,
                messages: messages || [],
                uploadedFiles: uploadedFiles?.map(f => ({
                  id: f.id,
                  name: f.name,
                  size: f.size,
                  type: f.type,
                  url: f.url,
                  data: f.data,
                  uploadedAt: f.uploaded_at,
                })) || [],
                generatedDocuments: generatedDocs?.map(d => ({
                  id: d.id,
                  conversationId: d.conversation_id,
                  title: d.title,
                  type: d.type,
                  content: d.content,
                  createdAt: d.created_at,
                  updatedAt: d.updated_at,
                })) || [],
                createdAt: conv.created_at,
                updatedAt: conv.updated_at,
              };
            })
          );

          set({ conversations, isLoading: false });
        } catch (error) {
          console.error('Error loading conversations:', error);
          set({ isLoading: false });
        }
      },
      addConversation: async (serviceType: ServiceType) => {
        const id = generateUUID();
        const now = new Date().toISOString();
        const newConversation: Conversation = {
          id,
          title: `New ${serviceType}`,
          serviceType,
          messages: [],
          uploadedFiles: [],
          generatedDocuments: [],
          createdAt: now,
          updatedAt: now,
        };

        // Update local state immediately
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));

        // Sync to Supabase
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            console.log('Attempting to insert conversation:', { id, user_id: user.id, title: newConversation.title, service_type: serviceType });
            const { data, error } = await supabase.from('conversations').insert({
              id,
              user_id: user.id,
              title: newConversation.title,
              service_type: serviceType,
              created_at: now,
              updated_at: now,
            });

            if (error) {
              console.error('Supabase insert error:', error);
            } else {
              console.log('Conversation saved successfully:', data);
            }
          } else {
            console.error('No user found when trying to save conversation');
          }
        } catch (error) {
          console.error('Error saving conversation to Supabase:', error);
        }

        return id;
      },
      updateConversation: async (id: string, updates: Partial<Conversation>) => {
        const now = new Date().toISOString();

        // Update local state immediately
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id
              ? { ...conv, ...updates, updatedAt: now }
              : conv
          ),
        }));

        // Sync to Supabase
        try {
          const supabase = createClient();
          const conversation = get().conversations.find(c => c.id === id);

          if (conversation) {
            // Update conversation metadata
            await supabase
              .from('conversations')
              .update({
                title: updates.title || conversation.title,
                service_type: updates.serviceType || conversation.serviceType,
                updated_at: now,
              })
              .eq('id', id);

            // If messages were updated, sync them
            if (updates.messages) {
              const { data: existingMessages } = await supabase
                .from('messages')
                .select('id')
                .eq('conversation_id', id);

              const existingIds = new Set(existingMessages?.map(m => m.id) || []);
              const newMessages = updates.messages.filter(m => !existingIds.has(m.id));

              if (newMessages.length > 0) {
                await supabase.from('messages').insert(
                  newMessages.map(m => ({
                    id: m.id,
                    conversation_id: id,
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp,
                  }))
                );
              }
            }

            // If uploaded files were updated, sync them
            if (updates.uploadedFiles) {
              const { data: existingFiles } = await supabase
                .from('uploaded_files')
                .select('id')
                .eq('conversation_id', id);

              const existingIds = new Set(existingFiles?.map(f => f.id) || []);
              const newFiles = updates.uploadedFiles.filter(f => !existingIds.has(f.id));

              if (newFiles.length > 0) {
                await supabase.from('uploaded_files').insert(
                  newFiles.map(f => ({
                    id: f.id,
                    conversation_id: id,
                    name: f.name,
                    size: f.size,
                    type: f.type,
                    url: f.url,
                    data: f.data,
                    uploaded_at: f.uploadedAt,
                  }))
                );
              }
            }
          }
        } catch (error) {
          console.error('Error updating conversation in Supabase:', error);
        }
      },
      deleteConversation: async (id: string) => {
        // Update local state immediately
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId:
            state.currentConversationId === id ? null : state.currentConversationId,
        }));

        // Sync to Supabase (cascade delete will handle related records)
        try {
          const supabase = createClient();
          await supabase.from('conversations').delete().eq('id', id);
        } catch (error) {
          console.error('Error deleting conversation from Supabase:', error);
        }
      },
      getCurrentConversation: () => {
        const state = get();
        return (
          state.conversations.find((conv) => conv.id === state.currentConversationId) || null
        );
      },
      setCurrentConversation: (id: string | null) => {
        set({ currentConversationId: id });
      },
    }),
    {
      name: 'conversation-storage',
    }
  )
);

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: [],
      isLoading: false,
      loadDocuments: async () => {
        try {
          set({ isLoading: true });
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (!user) {
            set({ documents: [], isLoading: false });
            return;
          }

          // Load documents from Supabase
          const { data: documentsData, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const documents: GeneratedDocument[] = (documentsData || []).map(d => ({
            id: d.id,
            conversationId: d.conversation_id,
            title: d.title,
            type: d.type,
            content: d.content,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));

          set({ documents, isLoading: false });
        } catch (error) {
          console.error('Error loading documents:', error);
          set({ isLoading: false });
        }
      },
      addDocument: async (document) => {
        const id = generateUUID();
        const now = new Date().toISOString();
        const newDocument: GeneratedDocument = {
          ...document,
          id,
          createdAt: now,
          updatedAt: now,
        };

        // Update local state immediately
        set((state) => ({
          documents: [newDocument, ...state.documents],
        }));

        // Sync to Supabase
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            await supabase.from('documents').insert({
              id,
              user_id: user.id,
              conversation_id: document.conversationId,
              title: document.title,
              type: document.type,
              content: document.content,
              created_at: now,
              updated_at: now,
            });
          }
        } catch (error) {
          console.error('Error saving document to Supabase:', error);
        }
      },
      updateDocument: async (id: string, updates: Partial<GeneratedDocument>) => {
        const now = new Date().toISOString();

        // Update local state immediately
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id
              ? { ...doc, ...updates, updatedAt: now }
              : doc
          ),
        }));

        // Sync to Supabase
        try {
          const supabase = createClient();
          await supabase
            .from('documents')
            .update({
              title: updates.title,
              content: updates.content,
              type: updates.type,
              updated_at: now,
            })
            .eq('id', id);
        } catch (error) {
          console.error('Error updating document in Supabase:', error);
        }
      },
      deleteDocument: async (id: string) => {
        // Update local state immediately
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        }));

        // Sync to Supabase
        try {
          const supabase = createClient();
          await supabase.from('documents').delete().eq('id', id);
        } catch (error) {
          console.error('Error deleting document from Supabase:', error);
        }
      },
      getDocumentsByType: (type: ServiceType) => {
        return get().documents.filter((doc) => doc.type === type);
      },
    }),
    {
      name: 'document-storage',
    }
  )
);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
          }
          return { theme: newTheme };
        });
      },
      setTheme: (theme: 'light' | 'dark') => {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
