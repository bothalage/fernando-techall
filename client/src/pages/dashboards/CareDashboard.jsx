import { useEffect, useRef, useState } from "react";
import api from "../../api/client";
import { getSocket } from "../../api/socket";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Send, MessageSquare } from "lucide-react";

export default function CareDashboard() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [agents, setAgents] = useState([]);
  const [active, setActive] = useState(null);
  const [text, setText] = useState("");
  const endRef = useRef();

  const load = async () => {
    const { data } = await api.get("/chats");
    setChats(data);

    if (active?._id) {
      const nextActive = data.find((chat) => chat._id === active._id);
      if (nextActive) setActive(nextActive);
    }

    if (user.role !== "customer_care_agent") {
      const a = await api.get("/users", { params: { role: "customer_care_agent" } });
      setAgents(a.data);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!active) return;
    const s = getSocket();
    s.emit("chat:join", active._id);
    const onMsg = ({ chatId, message }) => {
      if (chatId === active._id) {
        setActive((c) => ({ ...c, messages: [...c.messages, message] }));
      }
    };
    s.on("chat:message", onMsg);
    return () => s.off("chat:message", onMsg);
  }, [active?._id]);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [active?.messages]);

  const send = () => {
    if (!text.trim() || !active) return;
    getSocket().emit("chat:message", { chatId: active._id, text });
    setText("");
  };

  const assign = async (chatId, agentId) => {
    await api.patch(`/chats/${chatId}/assign`, { agent: agentId });
    toast.success("Assigned");
    load();
  };

  const selfAssign = async (chatId) => {
    await api.patch(`/chats/${chatId}/assign`, {});
    toast.success("Assigned to you");
    load();
  };

  return (
    <div className="grid xl:grid-cols-[320px_minmax(0,1fr)] gap-4 h-[calc(100vh-180px)]">
      <div className="card overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="text-primary" size={18} />
          <h3 className="font-bold text-lg">Conversations</h3>
        </div>

        {chats.map((c) => (
          <div key={c._id} onClick={() => setActive(c)} className={`p-4 rounded-2xl cursor-pointer mb-3 border ${active?._id === c._id ? "border-primary/40 bg-primary/12" : "border-primary/10 bg-surface/40"}`}>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{c.customer?.name}</span>
              <span className="text-xs text-primary">{c.status}</span>
            </div>
            <div className="text-xs text-muted mt-2">Agent: {c.agent?.name || "Unassigned"} · {c.messages.length} msgs</div>
            {!c.agent && user.role === "customer_care_agent" && (
              <button onClick={(e) => { e.stopPropagation(); selfAssign(c._id); }} className="text-xs text-accent mt-3">Self assign</button>
            )}
            {user.role !== "customer_care_agent" && (
              <select className="input mt-3 text-xs" defaultValue={c.agent?._id || ""} onClick={(e) => e.stopPropagation()} onChange={(e) => assign(c._id, e.target.value)}>
                <option value="">Assign agent</option>
                {agents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            )}
          </div>
        ))}
      </div>

      <div className="card flex flex-col">
        {!active ? <p className="text-muted m-auto">Select a conversation</p> : (
          <>
            <div className="border-b border-primary/10 pb-4 mb-4">
              <div className="font-semibold text-lg">{active.customer?.name}</div>
              <div className="text-xs text-muted mt-1">{active.customer?.email}</div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {active.messages.map((m, i) => (
                <div key={i} className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm ${String(m.from) === String(user.id) ? "bg-gradient-to-r from-primary to-accent text-white ml-auto" : "bg-surface border border-primary/10"}`}>
                  {m.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="flex gap-2 pt-4 mt-4 border-t border-primary/10">
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Reply..." />
              <button onClick={send} className="btn-primary !px-4"><Send size={16} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
