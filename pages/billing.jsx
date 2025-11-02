import { useEffect, useState } from "react";
import { apiMe, apiCreateCheckout, apiBillingPortal } from "../lib/api";

export default function Billing() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    apiMe().then(setUser).catch(() => setUser(null));
  }, []);

  const openPopup = (plan) => {
    setSelectedPlan(plan);
    setShowPopup(true);
  };

  const startCheckout = async () => {
    setStatus("Redirecting to Stripe...");
    try {
      const data = await apiCreateCheckout(selectedPlan);
      window.location.href = data.url;
    } catch (e) {
      setStatus("Error connecting to Stripe.");
    }
  };

  const openPortal = async () => {
    setStatus("Opening portal...");
    try {
      const data = await apiBillingPortal();
      window.location.href = data.url;
    } catch (e) {
      setStatus("Error opening billing portal.");
    }
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">
        Billing & Subscription
      </h1>

      {user && (
        <div className="text-zinc-400 mb-6">
          Logged in as:{" "}
          <span className="text-yellow-400">{user.email}</span> — Plan:{" "}
          <span className="text-yellow-400 font-semibold">{user.plan}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["cohost", "pro", "agency"].map((plan) => (
          <div
            key={plan}
            className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 text-center"
          >
            <h2 className="text-2xl font-bold text-yellow-400 capitalize mb-2">
              {plan}
            </h2>
            <p className="text-zinc-400 mb-4">
              {plan === "cohost" && "$19.99 / mo"}
              {plan === "pro" && "$29.99 / mo"}
              {plan === "agency" && "$99.99 / mo"}
            </p>
            <button
              onClick={() => openPopup(plan)}
              className="bg-yellow-400 text-black px-5 py-2 rounded font-semibold hover:opacity-90"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={openPortal}
        className="mt-8 border border-yellow-400 text-yellow-400 px-6 py-2 rounded hover:bg-yellow-400 hover:text-black transition"
      >
        Manage Subscription
      </button>

      {status && <p className="mt-4 text-zinc-400">{status}</p>}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-xl border border-yellow-400 max-w-lg w-full text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-3 capitalize">
              {selectedPlan} Plan
            </h2>
            <p className="text-zinc-300 mb-4">
              {selectedPlan === "cohost" &&
                "Perfect for part-time hosts managing 1–3 properties."}
              {selectedPlan === "pro" &&
                "For professional landlords managing multiple properties."}
              {selectedPlan === "agency" &&
                "For property managers and co-hosting agencies with full AI automation."}
            </p>
            <button
              onClick={startCheckout}
              className="bg-yellow-400 text-black px-6 py-3 rounded font-semibold hover:opacity-90 mr-4"
            >
              Subscribe
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="border border-yellow-400 text-yellow-400 px-6 py-3 rounded hover:bg-yellow-400 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
