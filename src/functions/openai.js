const { onRequest } = require("firebase-functions/v2/https");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.askOpenAI = onRequest(async (req, res) => {
  // CORS handling same as before
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4"
      messages: [{ role: "user", content: prompt }],
    });
    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});