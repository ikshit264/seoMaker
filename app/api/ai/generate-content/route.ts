import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  AI_SEMANTIC_JSON_SCHEMA,
  AiGenerateRequestSchema,
  buildAiResponse,
  buildGeminiPrompt,
  parseAiSemanticDocument,
} from '@/lib/ai-content';
import { normalizeLayoutContent } from '@/lib/editor-content';

const MODEL_NAME = 'gemini-2.5-flash';

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  return new GoogleGenAI({ apiKey });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AiGenerateRequestSchema.parse(body);
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: buildGeminiPrompt(parsed),
      config: {
        temperature: 0.4,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseJsonSchema: AI_SEMANTIC_JSON_SCHEMA,
        systemInstruction: [
          'You generate editable content structures for a block-based CMS.',
          'Return JSON only.',
          'Do not wrap JSON in markdown.',
          'Use concise but complete content that can be edited by a human after import.',
          'Prefer sections, subsections, FAQs, lists, and tables when they make the page easier to scan.',
        ].join(' '),
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return NextResponse.json({ error: 'Gemini returned an empty response' }, { status: 502 });
    }

    const semanticDocument = parseAiSemanticDocument(rawText, parsed.mode);
    const result = buildAiResponse(normalizeLayoutContent({ blocks: [] }), semanticDocument);

    return NextResponse.json(result);
  } catch (error: any) {
    const message = error?.message || 'Failed to generate content';
    const status = message.includes('Prompt is too short') || message.includes('Required') ? 400 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

