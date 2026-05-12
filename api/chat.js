// ═══════════════════════════════════════════════════════════
//  TechRob Chat API — Liceul Tehnologic Nr. 1 Cadea
//  Vercel API Route — az OpenAI kulcs itt van elrejtve
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {

  // Csak POST kérést fogadunk
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS fejlécek
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // Max 20 üzenet előzmény
  const safeMessages = messages.slice(-20);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Az API kulcs a Vercel környezeti változóból jön — senki nem látja!
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 300,
        messages: safeMessages
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(502).json({ error: 'Connection error' });
  }
}
