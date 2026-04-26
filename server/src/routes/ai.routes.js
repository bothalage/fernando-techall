const router = require("express").Router();
const { OpenAI } = require("openai");
const Chat = require("../models/Chat");
const { protect } = require("../middleware/auth");

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

// Get conversation history
router.get("/chat/:chatId", protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId, company: req.user.company })
      .populate("messages.from", "name role");
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat.messages);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Send message to AI assistant
router.post("/chat/:chatId/message", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Message required" });

    const chat = await Chat.findOne({ _id: req.params.chatId, company: req.user.company });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Add user message
    chat.messages.push({ from: req.user._id, text });
    await chat.save();

    // Get AI response if OpenAI is configured
    const openai = getOpenAI();
    let aiResponse = "I'm an AI assistant. Configure OPENAI_API_KEY to enable AI responses.";

    if (openai) {
      try {
        // Build conversation context (last 10 messages)
        const context = chat.messages.slice(-10).map((msg) => ({
          role: msg.from?.toString() === req.user._id.toString() ? "user" : "assistant",
          content: msg.text
        }));

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful customer support assistant for Fernando TechAll. Be concise and professional." },
            ...context
          ],
          max_tokens: 500,
          temperature: 0.7
        });

        aiResponse = completion.choices[0].message.content;
      } catch (aiError) {
        console.error("OpenAI error:", aiError);
        aiResponse = "Sorry, I encountered an issue. Please try again.";
      }
    }

    // Add AI response
    chat.messages.push({ from: null, text: aiResponse }); // null indicates AI
    await chat.save();

    res.json({ userMessage: text, aiResponse });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Chat suggestions for common issues
router.get("/suggestions", protect, async (req, res) => {
  const suggestions = [
    "How do I create a ticket?",
    "What are your support hours?",
    "How do I reset my password?",
    "Can you help with billing?",
    "Do you have API documentation?"
  ];
  res.json(suggestions);
});

module.exports = router;
