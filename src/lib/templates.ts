import type { ServiceType, PromptExample } from '@/types';

export const promptExamples: Record<ServiceType, PromptExample[]> = {
  resume: [
    {
      title: 'Detailed Resume Example',
      prompt: 'My name is Jesse Venson. B.Tech CSE from TIET, 5th semester, CGPA 8.5. Completed Financial Derivatives elective covering options pricing and risk management. 3-month internship at ICICI Securities as Financial Analyst where I created derivative pricing models and improved risk assessment accuracy by 25%. Built ResumeAI - AI-powered resume platform with Next.js, React, TypeScript, Gemini AI featuring real-time generation and 40% faster load times. Skills: React, Next.js, TypeScript, Python, Node.js, SQL, Git, Data Structures, Algorithms, Financial Analysis. Contact: jessevenson710@gmail.com',
    },
  ],
  'cover-letter': [
    {
      title: 'Detailed Cover Letter Example',
      prompt: 'Write a cover letter for Michael Chen applying to Senior Product Manager at Salesforce. I have 6 years of product management experience at tech companies. At my current role at Adobe, I launched 3 major features that increased user engagement by 35% and revenue by $2M annually. I led cross-functional teams of 12 people and managed a $5M product budget. I\'m excited about Salesforce\'s focus on AI-powered CRM solutions and want to contribute to the Einstein Analytics product line. My experience in B2B SaaS and data analytics makes me a great fit.',
    },
  ],
  sop: [
    {
      title: 'Detailed SOP Example',
      prompt: 'Write a Statement of Purpose for Lisa Park applying to the PhD in Computer Science program at Carnegie Mellon University, specializing in Human-Computer Interaction. I completed my BS in Computer Science at UC Berkeley with a 3.8 GPA. During undergrad, I worked on 2 research projects in accessibility technology and published a paper at CHI conference. I\'m particularly interested in designing inclusive AI systems for people with disabilities. CMU\'s HCI Institute and Professor Scott Hudson\'s work on ability-based design align perfectly with my research goals. After my PhD, I want to become a researcher in accessible computing and eventually lead a research lab focused on inclusive technology.',
    },
  ],
};

export const getPromptExamples = (type: ServiceType): PromptExample[] => {
  return promptExamples[type] || [];
};
