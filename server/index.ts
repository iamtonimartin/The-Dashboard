import 'dotenv/config';
import express from 'express';
import { join } from 'path';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 3001;

// Lazy-initialised so the server starts even if OPENAI_API_KEY isn't set yet
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set.');
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

// Allow large payloads for receipt image uploads
app.use(express.json({ limit: '10mb' }));

// ── POST /api/ai/draft-post ───────────────────────────────────────────────
// Refines a rough draft for a specific platform using GPT-4o
app.post('/api/ai/draft-post', async (req, res) => {
  const { draft, platform } = req.body as { draft: string; platform: string };

  if (!draft?.trim()) {
    res.status(400).json({ error: 'Draft content is required.' });
    return;
  }

  const platformGuides: Record<string, string> = {
    linkedin: 'professional LinkedIn post (max 3000 chars, structured with line breaks, end with 3–5 relevant hashtags)',
    x: 'punchy X/Twitter post (max 280 chars, strong hook, 1–2 hashtags)',
    email: 'newsletter-style email (first line is the subject, then blank line, then body — conversational and direct)',
  };

  const format = platformGuides[platform] ?? platformGuides.linkedin;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a ghostwriter for Toni Martin, Founder & CEO of Vibecoding Lab. Her voice is direct, insightful, and authentic — like a sharp founder who has done the work. Output only the final post with no commentary or preamble.`,
        },
        {
          role: 'user',
          content: `Refine this rough draft into a ${format}:\n\n${draft}`,
        },
      ],
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (err) {
    console.error('[draft-post]', err);
    res.status(500).json({ error: 'Failed to generate draft.' });
  }
});

// ── POST /api/ai/generate-ideas ───────────────────────────────────────────
// Returns 6 fresh content ideas for the Content Studio
app.post('/api/ai/generate-ideas', async (req, res) => {
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a content strategist for an AI/SaaS founder brand. Return JSON only.',
        },
        {
          role: 'user',
          content: `Generate 6 fresh, specific content ideas for a founder in the AI productivity and startup space. Topics should feel timely and thought-provoking — not generic. Return a JSON object: { "ideas": [{ "title": "...", "description": "one sentence angle" }] }`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0].message.content ?? '{}');
    res.json({ ideas: parsed.ideas ?? [] });
  } catch (err) {
    console.error('[generate-ideas]', err);
    res.status(500).json({ error: 'Failed to generate ideas.' });
  }
});

// ── POST /api/ai/chat ─────────────────────────────────────────────────────
// Knowledge Base co-pilot chat
app.post('/api/ai/chat', async (req, res) => {
  const { messages } = req.body as { messages: Array<{ role: string; content: string }> };

  if (!messages?.length) {
    res.status(400).json({ error: 'Messages are required.' });
    return;
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are HQ Co-Pilot, an intelligent assistant embedded in Toni Martin's personal knowledge base. Answer questions concisely and helpfully. When referencing a document, mention it by name. If you don't have relevant context, say so clearly and suggest uploading the relevant file.`,
        },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (err) {
    console.error('[chat]', err);
    res.status(500).json({ error: 'Failed to generate response.' });
  }
});

// ── POST /api/ai/parse-receipt ────────────────────────────────────────────
// Extracts transaction data from a receipt image using GPT-4o vision
app.post('/api/ai/parse-receipt', async (req, res) => {
  const { imageBase64, mimeType } = req.body as { imageBase64: string; mimeType: string };

  if (!imageBase64 || !mimeType) {
    res.status(400).json({ error: 'Image data is required.' });
    return;
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the transaction details from this receipt. Return JSON only with this shape: { "date": "YYYY-MM-DD", "description": "merchant and item description", "amount": 0.00, "category": "one of: Food, Travel, Tech, Office, Lifestyle, Revenue, Consulting, Other" }',
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0].message.content ?? '{}');
    res.json(parsed);
  } catch (err) {
    console.error('[parse-receipt]', err);
    res.status(500).json({ error: 'Failed to parse receipt.' });
  }
});

// ── Serve Vite frontend in production ─────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  // SPA fallback — all unmatched routes return index.html
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
});
