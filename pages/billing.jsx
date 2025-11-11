import { useEffect, useState } from "react";
import { apiMe, apiCreateCheckout, apiBillingPortal } from "../lib/api";

const PLANS = {
  cohost: {
    priceLabel: "$19.99 / mo",
    blurb: "Perfect for part-time hosts managing 1–3 properties.",
    priceId: "price_1SRxcvLIwGlwBzO6ZjGZA0pv", // <— replace with your real Stripe Price ID
  },
  pro: {
    priceLabel: "$29.99 / mo",
    blurb: "Built for professional landlords scaling a modern portfolio.",
    priceId: "price_1SNwkMLIwGlwBzO6snGiqUdA", // <— replace
  },
  agency: {
    priceLabel: "$99.99 / mo",
    blurb: "For co-hosting teams who need advanced automations and reporting.",
    priceId: "price_1SNwlGLIwGlwBzO64zfSxvcS", // <— replace
  },
};


export default function Billing() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("cohost");

  useEffect(() => {
    apiMe().then(setUser).catch(() => setUser(null));
  }, []);

  const openPopup = (plan) => {
    setSelectedPlan(plan);
    setShowPopup(true);
  };

const startCheckout = async () => {
  setStatus("Redirecting to Stripe…");
  try {
    const data = await apiCreateCheckout(PLANS[selectedPlan].priceId);
    window.location.href = data.url;
  } catch (e) {
    setStatus("Error connecting to Stripe.");
  }
};



  const openPortal = async () => {
    setStatus("Opening portal…");
    try {
      const data = await apiBillingPortal();
      window.location.href = data.url;
    } catch (e) {
      setStatus("Error opening billing portal.");
    }
  };

  return (
    <section className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-xl backdrop-blur-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#FFB400]">Billing & plans</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Choose the HouseHive tier that fits</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Update subscription details, access invoices, and manage your Stripe portal without leaving this modern workspace.
        </p>
        {user && (
          <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-300">
            <span>Signed in as {user.email}</span>
            {user.plan && (
              <span className="rounded-full bg-[#FFB400]/20 px-3 py-1 text-[#FFB400]">Current plan: {user.plan}</span>
            )}
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {Object.entries(PLANS).map(([plan, info]) => (
          <div
            key={plan}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB400]/10 to-transparent" aria-hidden />
            <div className="relative flex h-full flex-col">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{plan}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white capitalize">{plan}</h2>
              <p className="mt-2 text-sm text-slate-200">{info.priceLabel}</p> 
              <p className="mt-4 flex-1 text-sm text-slate-200">{info.blurb}</p>
              <button
                onClick={() => openPopup(plan)}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#FFB400] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
              >
                View details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur-xl sm:p-8">
        <h2 className="text-lg font-semibold">Manage subscription</h2>
        <p className="mt-1 text-sm text-slate-200">Access invoices, update payment methods, or cancel anytime.</p>
        <button
          onClick={openPortal}
          className="mt-4 inline-flex items-center justify-center rounded-2xl border border-[#FFB400] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#FFB400] transition hover:bg-[#FFB400] hover:text-slate-900"
        >
          Open customer portal
        </button>
        {status && <p className="mt-4 text-sm text-slate-300">{status}</p>}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-semibold capitalize">{selectedPlan} plan</h2>
                <p className="mt-1 text-sm text-slate-200">{PLANS[selectedPlan].blurb}</p>
                <p className="mt-2 text-sm text-[#FFB400]">{PLANS[selectedPlan].priceLabel}</p> 
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white transition hover:text-[#FFB400]"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={startCheckout}
                className="rounded-2xl bg-[#FFB400] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 transition hover:bg-[#f39c00]"
              >
                Subscribe now
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-[#FFB400] hover:text-[#FFB400]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
