import { useState, useEffect } from "react";

export default function Billing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // ✅ Load user info on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => (data.email ? setUser(data) : setMessage("Unable to load user info.")))
      .catch(() => setMessage("Unable to load user info."));
  }, []);

  // ✅ Stripe checkout
  const startCheckout = async (plan: string) => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMessage("Could not start checkout. Please try again.");
    } catch {
      setMessage("Error connecting to Stripe.");
    }
    setLoading(false);
  };

  // ✅ Billing portal
  const openBillingPortal = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/billing-portal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMessage("Could not open billing portal.");
    } catch {
      setMessage("Error connecting to Stripe.");
    }
    setLoading(false);
  };

  // ✅ Plan details
  const planDetails: Record<string, any> = {
    cohost: {
      name: "Cohost Plan",
      price: "$19.99 / month",
      features: [
        "Manage up to 5 properties",
        "Smart guest messaging & alerts",
        "Maintenance task automation",
      ],
      color: "#FFB400",
    },
    pro: {
      name: "Pro Plan",
      price: "$29.99 / month",
      features: [
        "Unlimited properties",
        "AI co-host automation",
        "Smart rent tracking",
        "Team access (3 users)",
      ],
      color: "#FFD85A",
    },
    agency: {
      name: "Agency Plan",
      price: "$99.99 / month",
      features: [
        "Unlimited clients & properties",
        "White-label dashboard",
        "Priority AI support",
        "Custom automation flows",
      ],
      color: "#FFC300",
    },
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-20">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">
        Billing & Subscription
      </h1>

      {user ? (
        <>
          <p className="text-zinc-400 mb-6">
            Logged in as: <span className="text-yellow-400">{user.email}</span>
          </p>
          <p className="text-zinc-400 mb-8">
            Current Plan:{" "}
            <span className="text-yellow-400 font-semibold">{user.plan}</span>
          </p>
        </>
      ) : (
        <p className="text-red-400 mb-8">{message || "Unable to load user info."}</p>
      )}

      {/* 🟡 Plan Boxes */}
      <div className="plan-wrapper">
        {Object.entries(planDetails).map(([key, plan]) => (
          <div
            key={key}
            className="plan"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              {plan.name.split(" ")[0]}
            </h2>
            <p className="text-zinc-400 mb-4">{plan.price}</p>
            <button
              onClick={() => setSelectedPlan(key)}
              disabled={loading}
              className="bg-[#FFB400] text-black px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button
          onClick={openBillingPortal}
          disabled={loading}
          className="border border-yellow-400 text-yellow-400 py-2 px-6 rounded hover:bg-yellow-400 hover:text-black transition"
        >
          Manage Subscription
        </button>
      </div>

      {message && <p className="text-red-400 mt-6">{message}</p>}

      {/* 🟢 Full-Screen Popup Modal */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95 text-white p-6"
          onClick={() => setSelectedPlan(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0c0c0c] border border-[#2a2a2a] rounded-3xl p-10 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-6 text-gray-400 hover:text-white text-3xl font-bold"
            >
              ✕
            </button>

            <h2
              className="text-4xl font-bold mb-2"
              style={{ color: planDetails[selectedPlan].color }}
            >
              {planDetails[selectedPlan].name}
            </h2>

            <p className="text-gray-400 text-lg mb-6">
              {planDetails[selectedPlan].price}
            </p>

            <div className="border-t border-zinc-700 my-6"></div>

            <ul className="text-left text-gray-300 text-lg space-y-3">
              {planDetails[selectedPlan].features.map((f: string) => (
                <li key={f} className="flex items-start space-x-2">
                  <span className="text-[#FFB400]">✔</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <button
                onClick={() => startCheckout(selectedPlan)}
                disabled={loading}
                className="bg-[#FFB400] text-black px-8 py-4 rounded-2xl text-xl font-bold hover:opacity-90 transition"
              >
                Purchase {planDetails[selectedPlan].name.split(" ")[0]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
