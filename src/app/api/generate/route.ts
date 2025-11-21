import { NextRequest } from 'next/server';
import { geminiModel, generationConfig } from '@/lib/gemini';
import { buildPrompt } from '@/lib/prompts';
import { parseFile } from '@/lib/fileParser';

// Use Node.js runtime for file parsing libraries
export const runtime = 'nodejs';

/**
 * POST /api/generate
 * Generate AI content using Google Gemini API
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, serviceType, uploadedFile, messages } = await request.json();

    // Validate required fields
    if (!prompt || !serviceType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: prompt or serviceType' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse uploaded file if present
    let resumeContent: string | undefined;
    if (uploadedFile) {
      try {
        resumeContent = await parseFile(uploadedFile);
        console.log('Successfully parsed uploaded file');
      } catch (parseError) {
        console.error('File parsing error:', parseError);
        return new Response(
          JSON.stringify({
            error: 'Could not read the uploaded file. Please ensure it\'s a valid PDF or DOCX.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Build context-aware prompt
    const fullPrompt = buildPrompt(serviceType, prompt, resumeContent);

    // Build conversation history for context (last 5 messages)
    const conversationHistory = messages
      ?.slice(-5) // Last 5 messages for context
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })) || [];

    // Add current prompt as final message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: fullPrompt }]
    });

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Generate content with streaming and conversation history
          const result = await geminiModel.generateContentStream({
            contents: conversationHistory,
            generationConfig,
          });

          // Stream response chunks
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(encoder.encode(chunkText));
          }

          controller.close();
        } catch (error: any) {
          console.error('Gemini API error:', error);

          // Handle specific error cases
          let errorMessage = 'AI generation failed. Please try again.';

          if (error.message?.includes('API_KEY')) {
            errorMessage = 'API key is invalid. Please check your GEMINI_API_KEY.';
          } else if (error.message?.includes('quota')) {
            errorMessage = 'Daily API limit reached. Please try again tomorrow.';
          } else if (error.message?.includes('SAFETY')) {
            errorMessage = 'Content was blocked due to safety filters. Please rephrase your request.';
          }

          controller.enqueue(encoder.encode(`Error: ${errorMessage}`));
          controller.close();
        }
      },
      cancel() {
        console.log('Stream cancelled by client');
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Request handling error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
