import type { ServiceType } from '@/types';

/**
 * Get today's date in a formatted string
 */
function getTodayDate(): string {
  const today = new Date();
  return today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Build context-aware prompt for Gemini based on service type
 */
export function buildPrompt(
  serviceType: ServiceType,
  userPrompt: string,
  resumeContent?: string
): string {
  switch (serviceType) {
    case 'resume':
      return buildResumePrompt(userPrompt, resumeContent);
    case 'cover-letter':
      return buildCoverLetterPrompt(userPrompt, resumeContent);
    case 'sop':
      return buildSOPPrompt(userPrompt);
    default:
      throw new Error('Invalid service type');
  }
}

/**
 * Build resume generation prompt
 */
function buildResumePrompt(
  userPrompt: string,
  resumeContent?: string
): string {
  const templateStyle = 'clean, minimalist design with bold section headers, focus on metrics and achievements';

  return `You are an expert resume writer with 15+ years of experience in crafting ATS-optimized, impactful resumes.

${resumeContent ? `ORIGINAL RESUME CONTENT:\n${resumeContent}\n\n` : ''}

USER REQUEST:
${userPrompt}

TEMPLATE STYLE: modern (${templateStyle})

CRITICAL INSTRUCTIONS:
1. Extract the candidate's actual name from the user request or resume content - DO NOT use placeholders
2. Create a professional, ATS-optimized resume
3. ABSOLUTELY FORBIDDEN - Do NOT write ANY of these:
   - "(Please customize with your actual email)"
   - "[Your Name]" or "[Your Email]" or any square bracket placeholders
   - "e.g.," or "for example:" followed by placeholder suggestions
   - Any text in parentheses that instructs the user
   - ANY markdown formatting symbols: NO ** for bold, NO __ for underline, NO * for bullets, NO # for headers
   If information is missing from user request, use realistic placeholder data OR omit that field entirely. DO NOT instruct the user to customize.
4. OUTPUT PLAIN TEXT ONLY - no markdown, no HTML, no special formatting codes
5. Use the modern template style with appropriate formatting
6. ${resumeContent ? 'Maintain all factual information from the original resume but enhance presentation' : 'Extract details from the user request and create a comprehensive resume'}
7. CRITICAL STRUCTURE - FOLLOW THIS EXACT FORMAT:
   Line 1: [Candidate's Full Name]
   Line 2: (blank line)
   Line 3: CONTACT:
   Line 4: [email address] (if provided)
   Line 5: [phone number] (ONLY if provided in user request - otherwise SKIP this line completely)
   Line 6: (blank line)
   Line 7: PROFESSIONAL SUMMARY
   ... rest of resume sections

   EXAMPLE WITH PHONE NUMBER:
   Jesse Venson

   CONTACT:
   jessevenson710@gmail.com
   7386314775

   PROFESSIONAL SUMMARY
   [summary text here...]

   EXAMPLE WITHOUT PHONE NUMBER (if user doesn't provide phone):
   Jesse Venson

   CONTACT:
   jessevenson710@gmail.com

   PROFESSIONAL SUMMARY
   [summary text here...]

8. CONTACT SECTION RULES:
   - The word "CONTACT:" must be on its own line
   - Email goes on the NEXT line (not same line as CONTACT:)
   - Phone goes on the line AFTER email (not same line as email) - BUT ONLY IF USER PROVIDED A PHONE NUMBER
   - CRITICAL: If the user does NOT provide a phone number in their request, DO NOT include a phone number line at all
   - DO NOT make up phone numbers, DO NOT use placeholders like "123-456-7890", DO NOT use random numbers
   - Only include what the user explicitly provides
   - Do NOT write phone/email on the first line with the name
   - Do NOT write phone/email anywhere except under CONTACT: heading
9. Use strong action verbs and quantify achievements where possible (e.g., "Increased revenue by 25%")
10. Use ONLY the bullet point symbol • for lists - never use * or - or any other symbol
11. Keep it concise and optimized for 1-page format

IMPORTANT: Before outputting, verify these requirements:
- NO parentheses with customization instructions
- NO square bracket placeholders anywhere
- NO example text like "e.g.," as filler
- NO markdown symbols anywhere (no **, no __, no *, no #)
- Section headers must be PLAIN CAPS text without any formatting symbols
- Phone and email MUST be under "CONTACT:" heading ONLY (not on line 1 with name)
- ONLY actual information extracted from user's request
Extract as much real information as possible from the user's request.

Generate the complete resume now:`;
}

/**
 * Build cover letter generation prompt
 */
function buildCoverLetterPrompt(
  userPrompt: string,
  resumeContent?: string
): string {
  const templateStyle = 'engaging, conversational tone with clear structure';

  return `You are an expert cover letter writer specializing in creating compelling, personalized application letters.

${resumeContent ? `CANDIDATE BACKGROUND (from resume):\n${resumeContent}\n\n` : ''}

USER REQUEST:
${userPrompt}

TEMPLATE STYLE: modern (${templateStyle})

CRITICAL INSTRUCTIONS:
1. Extract the candidate's actual name from the user request or resume content - DO NOT use placeholders like [Your Name]
2. Extract the company name and position from the user request - DO NOT use placeholders like [Company Name]
3. ABSOLUTELY FORBIDDEN - Do NOT write ANY of these:
   - "(Please customize with your actual email)"
   - "[mention specific achievement, e.g.,]"
   - "[Company Address, if known, otherwise omit]"
   - Any text in parentheses that instructs the user
   - Any text in square brackets as placeholders
   - Phrases like "e.g.," or "for example:" followed by placeholder suggestions
   If information is missing from user request, simply omit that field entirely. DO NOT instruct the user to customize.
4. Use ACTUAL INFORMATION - never use square bracket placeholders like [Your Address], [Your Email], etc.
5. Format as a proper business letter with:
   - Line 1: Candidate's name at the top
   - Line 2: Position/role being applied for (e.g., "Applying for Senior Software Engineer")
   - Contact information (email/phone if mentioned, otherwise omit completely)
   - Date: ${getTodayDate()}
   - Company name and hiring manager (if mentioned in request)
   - Subject line with position
6. Structure with EXACTLY 2 concise paragraphs:
   - First paragraph (3-4 sentences): Introduce yourself, express strong interest in the role, and highlight your most impressive achievement with quantifiable metrics. This is your MAIN selling paragraph.
   - Second paragraph (2-3 sentences): Express enthusiasm for the company, explain culture fit, and request an interview.
   - CRITICAL: End with "Yours sincerely," on a new line, followed by the candidate's name on the next line.
   CRITICAL: Keep it concise, impactful, and professional. Both paragraphs must be complete.
7. ${resumeContent ? 'Draw from the candidate\'s background to highlight relevant experience' : 'Create based on user request'}
8. Show genuine enthusiasm for the role and company
9. Demonstrate research about the company (infer from user request)
10. CRITICAL LENGTH REQUIREMENT: Body content MUST be 150-220 words (excluding header/contact info).
    - Paragraph 1: 100-140 words (3-4 sentences) - THIS IS THE MAIN SELLING PARAGRAPH
    - Paragraph 2: 50-80 words (2-3 sentences) - Closing with enthusiasm
    Keep it concise, professional, and impactful. Quality over quantity.
11. Personalize based on the specific role/company mentioned in the request

IMPORTANT: Before outputting, verify these requirements:
- NO parentheses with customization instructions
- NO square bracket placeholders anywhere
- NO example text like "e.g.," or "for example:" as filler
- ONLY actual information extracted from user's request
- Content MUST fit on ONE page when formatted as a business letter
- VERIFY: Did you include the role/position on line 2?
- VERIFY: Did you write EXACTLY TWO complete paragraphs (not more, not less)?
- VERIFY: Is paragraph 1 the longest (100-140 words) with specific achievements?
- VERIFY: Is paragraph 2 concise (50-80 words) with enthusiasm and call-to-action?
- VERIFY: Is the total word count 150-220 words (excluding header)?
Output ONLY the final cover letter content with no meta-text.

Generate the complete cover letter now:`;
}

/**
 * Build SOP generation prompt
 */
function buildSOPPrompt(
  userPrompt: string
): string {
  const templateStyle = 'engaging narrative with clear structure and modern academic tone';

  return `You are an expert academic writer specializing in graduate school Statements of Purpose.

USER REQUEST:
${userPrompt}

TEMPLATE STYLE: modern (${templateStyle})

CRITICAL INSTRUCTIONS:
1. Extract the applicant's actual name from the user request - DO NOT use placeholders
2. Extract the target program, university, and field of study from the request
3. ABSOLUTELY FORBIDDEN - Do NOT write ANY of these:
   - "(Please customize this section)"
   - "[Your Name]" or "[Program Name]" or any square bracket placeholders
   - "e.g.," or "for example:" followed by placeholder suggestions
   - Any text in parentheses that instructs the user
   If information is missing from user request, infer reasonable details OR omit that specific detail. DO NOT instruct the user to customize.
4. Create a compelling Statement of Purpose following the modern style
5. Start ONLY with the heading "Statement of Purpose" on the first line - nothing else on that line
6. Structure with EXACTLY 4 concise paragraphs (after the heading):
   - Paragraph 1 (120-150 words): Personal motivation and background - what sparked your interest in this field
   - Paragraph 2 (120-150 words): Academic preparation and key achievements relevant to the program
   - Paragraph 3 (120-150 words): Research interests and why this specific program is the perfect fit
   - Paragraph 4 (100-130 words): Future goals and how the program will help achieve them
7. CRITICAL LENGTH: Total body content MUST be 460-580 words (4 paragraphs) to fit on ONE page
8. Show intellectual curiosity and passion for the field
9. Demonstrate clear research interests specific to the program
10. Highlight relevant academic and professional achievements with specific examples
11. Maintain authentic, first-person voice while being professional
12. Include specific program details mentioned in the user request

IMPORTANT: Before outputting, verify these requirements:
- First line contains ONLY "Statement of Purpose" - no program name, no university
- NO parentheses with customization instructions
- NO square bracket placeholders anywhere
- NO example text like "e.g.," as filler
- ONLY actual information extracted from user's request
- Write in first person perspective
- VERIFY: Did you write EXACTLY 4 complete paragraphs?
- VERIFY: Is the total word count 460-580 words?
Extract as much detail as possible from the user's request about their background, interests, and target program.

Generate the complete Statement of Purpose now:`;
}
