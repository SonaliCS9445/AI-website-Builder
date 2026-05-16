const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

const model = "deepseek/deepseek-chat";

export const generateResponse = async (prompt) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in environment');
  }

  try {
    const res = await fetch(openRouterUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You must return valid json.' },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`openrouter error: ${res.status} ${errorData}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  } catch (err) {
    console.error('generateResponse error:', err.message || err);
    throw err;
  }
};
