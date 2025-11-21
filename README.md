# ResumeAI - AI-Powered Resume Tailoring Software

A modern, ChatGPT-inspired web application for generating professional resumes, cover letters, and statements of purpose using AI.

## Features

### 🎯 Three Main Services
- **Resume Generator**: Transform existing resumes with AI-powered tailoring
- **Cover Letter Writer**: Create personalized, compelling cover letters
- **SOP Creator**: Generate standout statements of purpose for applications

### ✨ Key Features
- **Real-time Streaming**: Watch your documents generate character-by-character
- **Live Preview**: Bolt-style side-by-side preview as AI generates content
- **Multiple Templates**: Choose from 3-4 professional templates per document type
- **File Upload**: Drag-and-drop resume upload with PDF/DOCX support
- **Conversation Context**: Maintain context across messages for iterative refinement
- **Download Options**: Export as PDF or DOCX
- **Document Library**: Save and manage all generated documents
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop with mobile support

### 🎨 Design
- ChatGPT/Claude-inspired interface with purple/pink gradient accents
- Modern animations and smooth transitions
- Clean, professional layout with intuitive navigation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand with local storage persistence
- **File Handling**: react-dropzone
- **Document Generation**: jsPDF, docx
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd /Users/echris/Desktop/Jesse
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication routes
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/         # Protected dashboard routes
│   │   │   └── dashboard/
│   │   ├── api/                 # API routes
│   │   │   └── generate/        # Document generation endpoints
│   │   ├── globals.css          # Global styles and animations
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/
│   │   ├── chat/                # Chat interface components
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── LivePreview.tsx
│   │   │   ├── ServiceCards.tsx
│   │   │   └── TemplateSelector.tsx
│   │   ├── layout/              # Layout components
│   │   │   └── ThemeProvider.tsx
│   │   ├── sidebar/             # Sidebar components
│   │   │   └── Sidebar.tsx
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   ├── download.ts          # PDF/DOCX export utilities
│   │   ├── store.ts             # Zustand state management
│   │   ├── templates.ts         # Template definitions
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── index.ts             # TypeScript type definitions
└── public/                      # Static assets
```

## Usage Guide

### 1. Authentication
- Create an account or log in (mock authentication with local storage)
- Credentials are stored locally for development

### 2. Creating Documents

#### Start a New Conversation
1. Click "New Conversation" in the sidebar
2. Select a service type (Resume, Cover Letter, or SOP)
3. Choose a template from available options
4. Click "Continue with Template"

#### Resume Generation
1. Upload your existing resume (PDF or DOCX)
2. Provide a detailed prompt describing:
   - Target job position
   - Company details
   - Skills to highlight
   - Any specific changes needed
3. Watch as AI generates your tailored resume in real-time
4. Use the live preview to see the document as it's created

#### Cover Letter / SOP Generation
1. Enter your prompt with relevant details:
   - Position/program information
   - Company/institution name
   - Why you're interested
   - Key qualifications to highlight
2. AI will generate a personalized document
3. Review in the live preview panel

### 3. Refining Documents
- Continue the conversation to refine the document
- Examples:
  - "Make it more formal"
  - "Add more technical details"
  - "Shorten the introduction"
- Click "Regenerate" to create a new version with the same prompt

### 4. Downloading
- Click the download button in the preview panel
- Choose PDF or DOCX format
- File will be saved with automatic naming

### 5. Managing Documents
- Switch to "Docs" tab in sidebar to view all generated documents
- Filter by document type (Resume, Cover Letter, SOP)
- Access past conversations from "Chats" tab
- All data persists in browser local storage

## Features in Detail

### Template System
Each document type includes multiple templates:


### Prompt Examples
The system provides helpful prompt examples for each service type to guide users in creating effective requests.

### Conversation History
- Auto-titled based on content
- Grouped by date (Today, Yesterday, etc.)
- Quick access to past conversations
- Continue previous conversations

### File Upload
- Drag-and-drop interface
- Supports PDF and DOCX formats
- 5MB file size limit
- Visual upload progress
- File preview with size information

## Mock Backend

Currently uses mock API routes that simulate AI generation with:
- Streaming responses for realistic experience
- Sample content based on service type
- Character-by-character streaming animation

### Backend Integration (Future)
To integrate with a real AI backend:

1. Update `/src/app/api/generate/route.ts`
2. Replace mock content generation with actual API calls
3. Configure environment variables for API keys
4. Update authentication system as needed

## Customization

### Color Scheme
Edit `/src/app/globals.css` to modify the color palette:
- Light mode: `--primary`, `--accent` variables
- Dark mode: `.dark` class variables
- Gradient colors in component files

### Templates
Add or modify templates in `/src/lib/templates.ts`:
- Define new template objects
- Specify sections and descriptions
- Update preview content

### Animations
Customize animations in `/src/app/globals.css`:
- Adjust duration and easing
- Modify gradient animation speed
- Create new animation keyframes

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Known Issues

- Middleware warning: Next.js 16 deprecation notice (doesn't affect functionality)
- Local storage has ~5-10MB limit depending on browser

## Future Enhancements

- [ ] Real AI backend integration
- [ ] User authentication with backend
- [ ] Cloud storage for documents
- [ ] Collaboration features
- [ ] Version control for documents
- [ ] ATS score analysis
- [ ] Job description parsing
- [ ] LinkedIn import
- [ ] Payment/subscription system
- [ ] Email export
- [ ] Template customization
- [ ] Multi-language support

## License

This project is for educational/demonstration purposes.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
