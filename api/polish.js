// /api/polish.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { systemMessage, userMessage } = req.body;

  if (!systemMessage || !userMessage) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const result = completion.choices[0].message.content;

    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
