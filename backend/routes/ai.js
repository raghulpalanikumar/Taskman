import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

router.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'No question provided' });

  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not set on the server' });
  }

  const orgId = (process.env.OPENAI_ORG_ID || '').trim();
  const projectId = (process.env.OPENAI_PROJECT_ID || '').trim();

  // Only allow task management questions
  if (!/task|todo|deadline|priority|assign|subtask|project|kanban|status|progress|reminder|schedule|productivity|work|manage/i.test(question)) {
    return res.json({ answer: 'I can only answer questions related to task management.' });
  }

  const baseHeaders = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  if (orgId) baseHeaders['OpenAI-Organization'] = orgId;
  if (projectId) baseHeaders['OpenAI-Project'] = projectId;

  const callOpenAI = async (model) => {
    const payload = {
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that only answers questions about task management.' },
        { role: 'user', content: question }
      ],
      max_tokens: 256
    };
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(payload)
    });
    const json = await resp.json().catch(() => ({}));
    return { resp, json };
  };

  try {
    // Try preferred model first, then fallback
    const preferredModel = 'gpt-4o-mini';
    let { resp, json } = await callOpenAI(preferredModel);

    if (!resp.ok) {
      const message = json?.error?.message || `OpenAI error: HTTP ${resp.status}`;
      // Try fallback model if model-related error
      if (/model/i.test(message) || resp.status === 404) {
        const fallbackModel = 'gpt-3.5-turbo';
        const fallback = await callOpenAI(fallbackModel);
        resp = fallback.resp;
        json = fallback.json;
      }
    }

    if (!resp.ok) {
      const message = json?.error?.message || `OpenAI error: HTTP ${resp.status}`;
      console.error('OpenAI API error:', message, json);
      return res.status(502).json({ error: message });
    }

    const answer = json.choices?.[0]?.message?.content || 'Sorry, I could not generate an answer.';
    res.json({ answer });
  } catch (err) {
    console.error('AI route error:', err);
    res.status(500).json({ error: 'AI service error' });
  }
});

export default router;
