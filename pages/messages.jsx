import { useState, useRef, useEffect } from "react";
import RequireAuth from "../components/RequireAuth";
import { apiChat, apiDraftMessage } from "../lib/api";
import DashboardBridge from "../components/DashboardBridge";
import { createEmptyMetrics, fetchPortfolioSnapshot } from "../lib/portfolio";

export default function Messages() {
  return (
    <RequireAuth>
      <MessagesContent />
    </RequireAuth>
  );
}

function MessagesContent() {
  const [input, setInput] = useState("");
  const [log, setLog] = useState([]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  const [metrics, setMetrics] = useState(() => createEmptyMetrics());
  const [metricsError, setMetricsError] = useState("");

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", content: trimmed };
    const historyForApi = [...log].reverse();

    setLog((prev) => [userMessage, ...prev]);
    setInput("");
    setTyping(true);

    try {
      const res = await apiChat(trimmed, historyForApi);
      const reply = res?.reply || res?.message || res?.response || "";
      if (!reply) throw new Error("Missing reply from AI API");
      const botMessage = { role: "assistant", content: reply };
      setLog((prev) => [botMessage, ...prev]);
    } catch (error) {
      const message =
        error?.message === "Missing reply from AI API"
          ? "HiveBot could not understand the response from the AI API."
          : "HiveBot could not connect to the AI API.";
      setLog((prev) => [
        { role: "assistant", content: message },
        ...prev,
      ]);
    } finally {
      setTyping(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [log, typing]);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const snapshot = await fetchPortfolioSnapshot();
        if (!active) return;
        setMetrics(snapshot.metrics);
        if (snapshot.errorSummary) {
          setMetricsError(snapshot.errorSummary);
        } else if (snapshot.errors?.length) {
          setMetricsError(`Some dashboard data failed to load: ${snapshot.errors.join(", ")}`);
        } else {
          setMetricsError("");
        }
      } catch (err) {
        if (!active) return;
        setMetricsError(err?.message || "Unable to load dashboard metrics.");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Messaging studio</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">HiveBot conversation hub</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Draft proactive updates, respond to residents with AI assistance, and keep every conversation in one polished feed.
        </p>
      </header>

      <DashboardBridge metrics={metrics} focus="Messages" />

      {metricsError && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{metricsError}</div>
      )}

      <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col">
            <div
              ref={chatRef}
              className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 text-sm text-white shadow-inner"
              style={{ minHeight: "360px" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_65%)]" aria-hidden />
              <div className="relative flex h-full flex-col justify-end gap-4 overflow-y-auto pr-2">
                {[...log].reverse().map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${
                        message.role === "assistant"
                          ? "border border-[#FFB400]/40 bg-white/10 text-[#FFB400]"
                          : "bg-[#FFB400] text-slate-900"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-[#FFB400]/40 bg-white/10 px-4 py-2 text-sm text-[#FFB400]">
                      HiveBot is typing…
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm shadow-lg sm:flex-row sm:items-end">
              <textarea
                rows={2}
                placeholder="Type a message for HiveBot to send or polish…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[96px] flex-1 rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-white placeholder-slate-400 focus:border-[#FFB400] focus:outline-none focus:ring-2 focus:ring-[#FFB400]/60"
              />

              <div className="flex flex-col gap-3 sm:w-44">
                <button
                  onClick={send}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#FFB400] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
                >
                  Send message
                </button>
                <button
                  onClick={async () => {
                    if (!input.trim()) return;
                    const res = await apiDraftMessage("Tenant", input.trim());
                    setInput(res.draft);
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-[#FFB400] hover:text-[#FFB400]"
                >
                  Auto-draft reply
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4 rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-slate-200 shadow-lg">
            <h2 className="text-lg font-semibold text-white">Prompt ideas</h2>
            <ul className="space-y-3 text-sm">
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                “Draft a warm rent reminder for unit 3C due on Friday.”
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                “Summarize the maintenance steps we&apos;ve taken for the elevator repair.”
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                “Write a friendly welcome message for a new Airbnb guest arriving tomorrow.”
              </li>
            </ul>

            <div className="rounded-2xl border border-white/10 bg-[#FFB400]/10 p-4 text-slate-900">
              <p className="text-sm font-semibold">Pro tip</p>
              <p className="mt-1 text-xs text-slate-800">
                Provide context like tone, due dates, or property nicknames to get even sharper replies from HiveBot.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
