import { useState, useEffect } from "react";

export default function Billing() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);

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

      <div className="plan-wrapper"> <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {/* Cohost Plan */}
        <div className="plan">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Cohost</h2>
          <p className="text-zinc-400 mb-4">$19.99 / month</p>
          <button
            onClick={() => startCheckout("cohost")}
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition"
          >
            Upgrade
          </button>
        </div>
        </div>

        {/* Pro Plan */}
        <div className="plan">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-yellow-500 text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Pro</h2>
          <p className="text-zinc-400 mb-4">$29.99 / month</p>
          <button
            onClick={() => startCheckout("pro")}
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition"
          >
            Upgrade
          </button>
        </div></div>

        {/* Agency Plan */}
        <div className="plan">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-700 text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Agency</h2>
          <p className="text-zinc-400 mb-4">$99.99 / month</p>
          <button
            onClick={() => startCheckout("agency")}
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition"
          >
            Upgrade
          </button></div></div>
     
        </div>
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
    </div>
  );
}

