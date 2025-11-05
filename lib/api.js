import axios from "axios";

const API_BASE = "https://househive-backend-v3.onrender.com/";

export async function askAI(question, history = []) {
  try {
    const normalizedHistory = Array.isArray(history) ? history : [];

    const updatedHistory =
      normalizedHistory[normalizedHistory.length - 1]?.content === question
        ? normalizedHistory
        : [...normalizedHistory, { role: "user", content: question }];

    const payload = {
      message: question,
      history: updatedHistory,
    };

    const { data } = await axios.post(`${API_BASE}/api/ai/chat`, payload);
    return {
      reply: data.reply,
      history: [...updatedHistory, { role: "assistant", content: data.reply }],
    };
  } catch (err) {
    console.error("AI Error:", err);
    return {
      reply: "HiveBot could not reply right now.",
      history,
    };
  }
}
