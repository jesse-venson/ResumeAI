# ResumeAI - AI-Powered Document Generator

**Live Site:** https://resume-ai-gamma-amber.vercel.app

A modern web application that helps users create professional resumes, cover letters, and statements of purpose using AI-powered generation with real-time streaming.

---

## What It Does

ResumeAI is an AI assistant that helps you create and refine professional documents through conversational chat. Upload your existing resume, describe what you need, and get tailored content with live preview and instant downloads.

### Core Services

1. **Resume Generator**
   - Upload existing resume (PDF/DOCX)
   - AI analyzes and tailors content for specific roles
   - Iterative refinement through chat conversation
   - Multiple professional templates

2. **Cover Letter Writer**
   - No upload required - describe yourself and the role
   - AI generates personalized, compelling cover letters
   - Adapts tone and content to company/position
   - Real-time streaming generation

3. **SOP Creator**
   - Generate statements of purpose for academic applications
   - Customizable based on program requirements
   - Highlights achievements and goals effectively
   - Professional formatting and structure

---

## Key Features

### Smart Chat Interface
- **Real-time Streaming:** Watch content generate character-by-character
- **Live Preview:** Side-by-side preview panel showing formatted output
- **Conversation Context:** AI remembers previous messages for refinement
- **Prompt Examples:** Built-in examples to guide users

### Document Management
- **File Upload:** Drag-and-drop support for PDF and DOCX files (5MB limit)
- **Multiple Templates:** 3-4 professional templates per document type
- **Download Options:** Export as PDF or DOCX
- **Document Library:** Save and access all generated documents
- **Conversation History:** Auto-titled chats organized by date

### User Experience
- **Authentication:** Secure signup/login with Supabase
- **Password Reset:** Email-based forgot password flow
- **Dark Mode:** Toggle between light/dark themes
- **Responsive Design:** Optimized for desktop and mobile
- **Modern UI:** ChatGPT-inspired interface with purple/pink gradients

---

## Technical Architecture

### Frontend Stack
- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** Tailwind CSS 3.4.1
- **Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **State:** Zustand 5.0.8 with persistence

### Backend & Database
- **BaaS:** Supabase (PostgreSQL + Auth)
- **API:** Next.js API routes
- **AI Engine:** Google Gemini 2.5 Flash
- **Storage:** Supabase tables + browser localStorage

### Document Processing
- **Upload Parsing:**
  - `mammoth` - DOCX file reading
  - `pdf-parse` - PDF file extraction
- **Generation:**
  - `jspdf` + `jspdf-autotable` - PDF creation
  - `docx` - DOCX file generation
  - `file-saver` - Client-side downloads
- **File Handling:** `react-dropzone` for drag-and-drop

---

## Data Architecture

### Supabase Database Schema

**Tables:**
- `profiles` - User profile information
- `conversations` - Chat sessions with metadata
- `messages` - Individual chat messages
- `uploaded_files` - Resume/document uploads
- `documents` - Generated final documents

**Authentication:**
- Email/password auth with Supabase Auth
- Password reset via magic links
- Session management with JWT tokens

### Local Storage
- `auth-storage` - User session data
- `conversation-storage` - Active conversations (synced with DB)
- `document-storage` - Generated documents (synced with DB)
- `theme-storage` - User theme preference

---

## AI Integration

### Gemini API Configuration
- **Model:** gemini-2.5-flash (v1 API)
- **Parameters:**
  - Temperature: 0.4 (balanced creativity/consistency)
  - Top-K: 40
  - Top-P: 0.95
  - Max Tokens: 8192
- **Streaming:** Server-sent events for real-time output

### Generation Flow
```
User Input → API Route → Gemini API → Stream Response
    ↓
Parse chunks → Update UI → Save to DB → Display Preview
```

---

## User Flow

### Authentication Flow
1. User signs up with email/password
2. Profile created in Supabase
3. Session stored locally + JWT token
4. Auto-login on return visits
5. Password reset via email link

### Document Creation Flow
1. **Select Service** - Choose Resume/Cover Letter/SOP
2. **Upload File** (Resume only) - Drag-and-drop existing resume
3. **Enter Prompt** - Describe requirements or use example
4. **AI Generation** - Real-time streaming with live preview
5. **Refine** - Chat back-and-forth to improve content
6. **Download** - Export as PDF or DOCX

### Conversation Management
- Auto-title generation based on first message
- Grouped by date (Today, Yesterday, Last 7 days, etc.)
- Switch between conversations without losing context
- Delete unwanted conversations

---

## API Endpoints

### `/api/generate`
**POST** - Generate content with AI streaming
- **Input:** `{ messages, serviceType, uploadedFile? }`
- **Output:** Server-sent event stream
- **Process:**
  1. Validate request
  2. Call Gemini API with conversation history
  3. Stream response chunks
  4. Client accumulates and displays

---

## File Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   ├── forgot-password/ # Password reset request
│   │   └── reset-password/  # New password entry
│   ├── (dashboard)/         # Protected routes
│   │   ├── dashboard/       # Main chat interface
│   │   └── settings/        # User settings
│   ├── api/
│   │   └── generate/        # AI generation endpoint
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── chat/                # Chat UI components
│   │   ├── ChatInput.tsx    # Message input with file upload
│   │   ├── ChatMessage.tsx  # Message display
│   │   ├── FileUpload.tsx   # Drag-and-drop uploader
│   │   ├── LivePreview.tsx  # Document preview panel
│   │   └── ServiceCards.tsx # Service type selector
│   ├── sidebar/
│   │   └── Sidebar.tsx      # Navigation sidebar
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Supabase client
│   │   └── middleware.ts    # Auth middleware
│   ├── store.ts             # Zustand state management
│   ├── gemini.ts            # Gemini API client
│   ├── templates.ts         # Prompt examples
│   ├── download.ts          # PDF/DOCX export
│   └── utils.ts             # Helper functions
└── types/
    └── index.ts             # TypeScript definitions
```

---

## Features In Scope

✅ **Implemented:**
- Resume/Cover Letter/SOP generation
- Real-time AI streaming
- File upload (DOCX parsing)
- PDF + DOCX downloads
- User authentication
- Password reset
- Dark mode
- Conversation history
- Document library
- Live preview
- Responsive design

---

## Features Out of Scope

❌ **Not Included:**
- PDF resume uploads (only DOCX supported)
- Cloud file storage (uses base64 in DB)
- Multi-user collaboration
- Grammar/plagiarism checking
- Multi-language support
- Native mobile apps
- LinkedIn integration
- Job board integration
- ATS score analysis
- Payment/subscription system
- Email sharing
- Template customization
- Version control for documents

---

## Deployment

### Environment Variables Required
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

### Build & Deploy
```bash
# Development
npm run dev

# Production Build
npm run build
npm start

# Deploy to Vercel
vercel --prod
```

### Supabase Configuration
1. Create project at supabase.com
2. Run database migrations (create tables)
3. Configure auth email templates
4. Add redirect URLs for password reset
5. Set site URL to production domain

---

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

---

## Known Limitations
- Local storage has ~5-10MB limit (browser-dependent)
- File uploads limited to 5MB
- PDF upload not supported (only DOCX)
- Gemini API rate limits apply
- Next.js 16 middleware deprecation warning (non-blocking)

---

## Future Enhancements
- PDF resume upload support
- Cloud file storage (Supabase Storage)
- ATS optimization scoring
- Job description parsing
- LinkedIn profile import
- Template editor
- Collaboration features
- Version history
- Analytics dashboard
- Email notifications

---

## Tech Stack Summary

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS 3.4.1 |
| Components | shadcn/ui (Radix UI) |
| State | Zustand 5.0.8 |
| Backend | Supabase (PostgreSQL + Auth) |
| AI | Google Gemini 2.5 Flash |
| File Upload | react-dropzone |
| PDF Parse | pdf-parse |
| DOCX Parse | mammoth |
| PDF Generate | jspdf + jspdf-autotable |
| DOCX Generate | docx |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

**Project Version:** 0.1.0
**License:** Educational/Demonstration Use
**Repository:** https://github.com/jesse-venson/ResumeAI
**Built with:** Next.js, TypeScript, and Tailwind CSS
