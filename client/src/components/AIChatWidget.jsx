import { useEffect, useState, useRef } from "react";
import api from "../api/client";
import toast from "react-hot-toast";
import { Send, Lightbulb, X } from "lucide-react";

export default function AIChatWidget({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEnd = useRef(null);

  useEffect(() => {
    if (chatId) loadMessages();
    loadSuggestions();
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const { data } = await api.get(`/ai/chat/${chatId}`);
      setMessages(data);
    } catch (e) {
      console.error("Failed to load messages:", e);
    }
  };

  const loadSuggestions = async () => {
    try {
      const { data } = await api.get("/ai/suggestions");
      setSuggestions(data);
    } catch (e) {
      console.error("Failed to load suggestions:", e);
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim() || !chatId) return;
    try {
      setLoading(true);
      const { data } = await api.post(`/ai/chat/${chatId}/message`, { text });
      setMessages((prev) => [
        ...prev,
        { from: { name: "You" }, text: data.userMessage },
        { from: null, text: data.aiResponse }
      ]);
      setInput("");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Lightbulb className="text-primary/40 mb-3" size={32} />
            <p className="text-sm text-muted mb-4">Start a conversation or try a suggestion</p>
            <div className="space-y-2 w-full">
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full px-3 py-2 text-xs bg-surface/60 hover:bg-surface rounded-lg text-left transition-colors border border-primary/10 hover:border-primary/30"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from?._id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.from?._id ? "bg-primary/20 text-text" : "bg-surface/60 text-text"}`}>
                <div className="text-xs font-semibold mb-1 text-muted">{msg.from?.name || "AI Assistant"}</div>
                <div className="text-sm leading-relaxed">{msg.text}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="border-t border-primary/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something..."
            className="flex-1 px-3 py-2 bg-surface/60 rounded-lg text-sm border border-primary/10 focus:outline-none focus:border-primary/50 text-text placeholder-muted"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-gradient-to-r from-primary to-accent rounded-lg text-white disabled:opacity-50 hover:shadow-lg transition-all"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
