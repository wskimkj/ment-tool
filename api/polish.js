// api/polish.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemMessage, userMessage } = req.body;

  if (!systemMessage || !userMessage) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";

    res.status(200).json({ result });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: err.message || "Unknown error" });
  }
}
