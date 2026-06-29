export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, sensorContext } = req.body;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: sensorContext },
          { role: 'user', content: question }
        ]
      })
    });

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content || 'Maaf, ada gangguan. Coba lagi ya!';
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
