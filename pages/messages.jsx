import { useState, useRef, useEffect } from "react";
import { apiChat } from "../lib/api";
import RequireAuth from "../components/RequireAuth";

export default function Messages() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState([]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  const send = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    setLog((prev) => [userMessage, ...prev]);
    setInput("");
    setTyping(true);

    try {
      const res = await apiChat(input);
      const botMessage = { role: "assistant", content: res.reply };
      setLog((prev) => [botMessage, ...prev]);
    } catch {
      setLog((prev) => [
        { role: "assistant", content: "HiveBot could not connect to the AI API." },
        ...prev,
      ]);
    } finally {
      setTyping(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [log, typing]);

  return (
    <RequireAuth>
      <div className="p-8 bg-black text-white min-h-screen flex flex-col items-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">HiveBot AI</h1>

        {/* Chat Window */}
        <div
          ref={chatRef}
          className="flex-1 w-full max-w-3xl bg-zinc-900 border border-zinc-700 rounded-xl p-5 overflow-y-auto"
          style={{ height: "65vh" }}
        >
          {[...log].reverse().map((m, i) => (
            <div key={i} className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-3 max-w-[75%] rounded-xl text-sm whitespace-pre-wrap ${
                  m.role === "assistant"
                    ? "bg-zinc-800 border border-yellow-400 text-yellow-300"
                    : "bg-yellow-400 text-black font-medium"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start mb-2">
              <div className="px-4 py-2 bg-zinc-800 border border-yellow-400 text-yellow-300 rounded-xl text-sm">
                HiveBot is typing…
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="w-full max-w-3xl mt-4 flex gap-3">
          <textarea
            rows={2}
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-zinc-800 text-white rounded-lg p-3 border border-zinc-700"
          />
          <button
            onClick={send}
            className="bg-yellow-400 text-black px-6 rounded-lg font-semibold hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </RequireAuth>
  );
}
