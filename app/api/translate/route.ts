import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage = 'English' } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate the following Markdown/HTML text into ${targetLanguage}. Maintain all formatting, line breaks, and elements exactly as they are. Keep technical terms if they correspond properly. Here is the text:\n\n${text}`,
    });

    return NextResponse.json({ translatedText: response.text });
  } catch (err: any) {
    console.error('Translation Error:', err);
    return NextResponse.json({ error: err.message || 'Translation failed' }, { status: 500 });
  }
}
