import type { ServiceType } from '@/types';
import { FileText, Mail, GraduationCap, Info } from 'lucide-react';

interface PromptGuidanceProps {
  serviceType: ServiceType;
}

export function PromptGuidance({ serviceType }: PromptGuidanceProps) {
  const guidance = {
    resume: {
      icon: FileText,
      title: 'Resume Generator',
      description: 'Click the 📎 (paperclip) icon below to upload your current resume, OR type your details:',
      requiredInfo: [
        'Your full name',
        'Work experience (company, role, duration, achievements)',
        'Education (degree, institution, year)',
        'Skills (technical and soft skills)',
        'Contact information (email, phone - optional)',
      ],
      example: 'Example: "My name is John Doe. I worked as a Software Engineer at TechCorp for 3 years where I increased performance by 40%. I have a BS in Computer Science from MIT. Skills include React, Python, and cloud technologies."',
    },
    'cover-letter': {
      icon: Mail,
      title: 'Cover Letter Writer',
      description: 'Provide the following information for a personalized cover letter:',
      requiredInfo: [
        'Your full name',
        'Target company name',
        'Position/role you\'re applying for',
        'Relevant experience or achievements',
        'Why you\'re interested in this role/company',
      ],
      example: 'Example: "Write a cover letter for Jane Smith applying to Senior Marketing Manager at InnovateTech Solutions. I have 5 years of marketing experience, increased user engagement by 25% at my previous company, and I\'m excited about InnovateTech\'s AI-driven approach."',
    },
    sop: {
      icon: GraduationCap,
      title: 'Statement of Purpose',
      description: 'Provide the following details for your SOP:',
      requiredInfo: [
        'Your full name',
        'Target program and university',
        'Your academic background',
        'Research interests or career goals',
        'Relevant projects or achievements',
        'Why this specific program fits your goals',
      ],
      example: 'Example: "Write an SOP for Alex Johnson applying to the Master\'s in Computer Science at Stanford University. I completed my BS in CS, worked on machine learning projects, and I\'m interested in AI research. Stanford\'s AI lab aligns with my goal to advance natural language processing."',
    },
  };

  const config = guidance[serviceType];
  const Icon = config.icon;

  return (
    <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
              {config.title} - What to Include
            </h3>
          </div>
          <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
            {config.description}
          </p>
          <ul className="space-y-1.5 mb-3">
            {config.requiredInfo.map((info, index) => (
              <li key={index} className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2">
                <span className="text-purple-500 dark:text-purple-400 flex-shrink-0">•</span>
                <span>{info}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
            <p className="text-xs font-medium text-purple-900 dark:text-purple-100 mb-1.5">
              Example Prompt:
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 italic leading-relaxed">
              {config.example}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
