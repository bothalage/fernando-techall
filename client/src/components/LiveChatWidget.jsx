import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/client";
import { getSocket } from "../api/socket";
import { MessageCircle, X, Send, MoreVertical } from "lucide-react";
import agentAvatar from "../assets/ft-agent-valery.jpg";

export default function LiveChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef();

  useEffect(() => {
    if (!open || !user) return;
    let isMounted = true;
    let cleanup = () => {};

    api.post("/chats/start").then(({ data }) => {
      if (!isMounted) return;
      setChat(data);
      setMessages(data.messages || []);

      const s = getSocket();
      s.emit("chat:join", data._id);
      const onMsg = ({ chatId, message }) => {
        if (chatId === data._id) setMessages((m) => [...m, message]);
      };
      s.on("chat:message", onMsg);
      cleanup = () => s.off("chat:message", onMsg);
    }).catch(() => {});

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [open, user]);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = () => {
    if (!text.trim() || !chat) return;
    getSocket().emit("chat:message", { chatId: chat._id, text });
    setText("");
  };

  if (!user) return null;

  return (
    <>
      <button onClick={() => setOpen((o) => !o)} className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl grid place-items-center bg-gradient-to-r from-primary to-accent text-white shadow-[0_18px_44px_rgba(90,92,255,0.35)]">
        {open ? <X /> : <MessageCircle />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-[340px] h-[440px] glass rounded-[24px] flex flex-col overflow-hidden">
          <div className="px-4 py-4 border-b border-primary/10 flex items-center justify-between gap-3 bg-surface/50">
            <div className="flex items-center gap-3">
              <img src={agentAvatar} alt="Support agent Valery" width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-primary/30" />
              <div className="leading-tight">
                <div className="font-semibold text-sm">Valery</div>
                <div className="text-xs text-muted">Support Agent</div>
              </div>
            </div>
            <MoreVertical size={16} className="text-muted" />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[linear-gradient(180deg,rgba(6,10,24,0.2),rgba(6,10,24,0.05))]">
            {messages.length === 0 && <p className="text-muted text-sm">Hello! How can we help you today?</p>}
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] ${String(m.from) === String(user.id) ? "ml-auto" : ""}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm ${String(m.from) === String(user.id) ? "bg-gradient-to-r from-primary to-accent text-white" : "bg-surface border border-primary/10 text-text"}`}>
                  {m.text}
                </div>
                {m.fromRole === "assistant" && <div className="text-[11px] text-muted mt-1 px-1">TechAll AI assistant</div>}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="p-3 flex gap-2 border-t border-primary/10 bg-surface/40">
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message..." />
            <button onClick={send} className="btn-primary !px-4"><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
