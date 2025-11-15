const OpenAI = require("openai");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { systemMessage, userMessage } = req.body;

    if (!systemMessage || !userMessage) {
      return res.status(400).json({ error: "systemMessage와 userMessage가 필요합니다." });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
      console.log(process.env.OPENAI_API_KEY);
    });

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    });

    const resultText = response.choices[0].message.content;

    res.status(200).json({ result: resultText });
  } catch (err) {
    console.error("API 오류:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};
