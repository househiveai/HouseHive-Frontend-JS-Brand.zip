import { useState } from "react";
import { apiChat } from "../lib/api";
import RequireAuth from "../components/RequireAuth";

export default function Messages() {
  RequireAuth;
  const [input, setInput] = useState("");
  const [log, setLog] = useState([]);

  const send = async () => {
    if (!input) return;
    const msgs = [...log, { role: "user", content: input }];
    setLog(msgs);
    setInput("");
    try {
      const res = await apiChat(input);
      setLog([...msgs, { role: "assistant", content: res.reply }]);
    } catch {
      setLog([
        ...msgs,
        { role: "assistant", content: "HiveBot could not connect to the AI API." },
      ]);
    }
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">HiveBot AI</h1>
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 max-w-3xl">
        <textarea
          rows={3}
          placeholder="Ask HiveBot anything about your properties, guests, or tasks..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded p-3 mb-3"
        />
        <button
          onClick={send}
          className="bg-yellow-400 text-black px-5 py-2 rounded font-semibold hover:opacity-90"
        >
          Send
        </button>
      </div>

      <div className="mt-6 max-w-3xl">
        {log.map((m, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl mb-3 ${
              m.role === "assistant"
                ? "bg-zinc-800 border border-yellow-400"
                : "bg-zinc-900 border border-zinc-700"
            }`}
          >
            <div className="font-bold mb-1 text-yellow-400">
              {m.role === "assistant" ? "HiveBot" : "You"}
            </div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
