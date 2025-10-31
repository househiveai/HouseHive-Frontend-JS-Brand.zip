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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setUser(data);
        } else {
          setMessage("Unable to load user info.");
        }
      })
      .catch(() => setMessage("Unable to load user info."));
  }, []);

  // ✅ Checkout
  const startCheckout = async (plan: string) => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ plan }),
        }
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage("Could not start checkout. Please try again.");
      }
    } catch (err) {
      setMessage("Error connecting to Stripe.");
    }
    setLoading(false);
  };

  // ✅ Billing Portal
  const openBillingPortal = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/billing-portal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage("Could not open billing portal.");
      }
    } catch (err) {
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
        "Track up to 5 properties",
        "Smart guest messaging",
        "Maintenance task automation",
      ],
      color: "#FFB400",
    },
    pro: {
      name: "Pro Plan",
      price: "$29.99 / month",
      features: [
        "Unlimited properties",
        "Full AI chat automation",
        "Smart rent tracking",
        "Team access for 3 users",
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
        "Custom integrations",
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
        <p className="text-red-400 mb-8">
          {message || "Unable to load user info."}
        </p>
      )}

      {/* 🟡 Plan Boxes */}
      <div className="plan-wrapper flex flex-wrap justify-center gap-8">
        {Object.entries(planDetails).map(([key, plan]) => (
          <div
            key={key}
            className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 text-center w-64 hover:border-yellow-400 transition"
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

      {/* Manage Subscription */}
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

      {/* 🟢 Popup Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-[#111] border border-[#333] rounded-2xl p-8 max-w-md text-center relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: planDetails[selectedPlan].color }}
            >
              {planDetails[selectedPlan].name}
            </h2>
            <p className="text-gray-400 mb-4">
              {planDetails[selectedPlan].price}
            </p>

            <ul className="text-gray-300 text-left mb-6 list-disc list-inside">
              {planDetails[selectedPlan].features.map((f: string) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout(selectedPlan)}
              disabled={loading}
              className="bg-[#FFB400] text-black px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Purchase {planDetails[selectedPlan].name.split(" ")[0]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
