"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const BUNDLES = [
  {
    credits: 10, price: 5000, label: "Starter", perLead: "₹500 per lead",
    highlight: false, tag: null,
    value: "Try it out",
  },
  {
    credits: 25, price: 10000, label: "Growth", perLead: "₹400 per lead",
    highlight: true, tag: "BEST VALUE",
    value: "Save ₹2,500 vs Starter",
  },
  {
    credits: 50, price: 18000, label: "Pro", perLead: "₹360 per lead",
    highlight: false, tag: null,
    value: "Save ₹7,000 vs Starter",
  },
] as const;

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function BuyCreditsContent() {
  const params       = useSearchParams();
  const pendingToken = params.get("pending_token") ?? "";
  const pendingFor   = params.get("pending_for")   ?? "";
  const email        = params.get("email")         ?? "";

  const [loading,   setLoading]   = useState<number | null>(null);
  const [bypassing, setBypassing] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const isDev = process.env.NODE_ENV !== "production";

  async function handleDevBypass() {
    setBypassing(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/dev-bypass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, credits: 10, pending_token: pendingToken, pending_for: pendingFor }),
      });
      const { returnUrl } = await res.json();
      window.location.href = returnUrl;
    } catch {
      setError("Dev bypass failed.");
      setBypassing(false);
    }
  }

  async function handleBuy(credits: 10 | 25 | 50) {
    setLoading(credits);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits, pending_token: pendingToken, pending_for: pendingFor, email }),
      });
      if (!res.ok) throw new Error("Could not create order");
      const { orderId, amount, keyId } = await res.json();

      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key: keyId, amount, currency: "INR", order_id: orderId,
        name: "HospitalGuru",
        description: `${credits} Lead Credits — Complete Your Acceptance`,
        prefill: { email },
        theme: { color: "#0f766e" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email, credits, pending_token: pendingToken, pending_for: pendingFor,
            }),
          });
          if (!verifyRes.ok) {
            setError("Payment received but setup failed. Email care@hospitalguru.com with your payment ID.");
            return;
          }
          const { returnUrl } = await verifyRes.json();
          window.location.href = returnUrl;
        },
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again or contact care@hospitalguru.com.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa]">

      {/* Top bar — visual continuity from the Accept Lead email */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-500 px-6 py-4 flex items-center justify-between">
        <span className="text-white font-black text-lg">
          Hospital<span className="text-teal-200">Guru</span>
        </span>
        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Partner Portal
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Hero — frame this as "almost there", not "blocked" */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔓</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            One step away from this patient
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            You&apos;ve used all your complimentary leads. Top up your credits to complete
            this acceptance and keep receiving new patients.
          </p>
        </div>

        {/* What they're about to get — keeps intent alive */}
        <div className="bg-white border border-teal-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 text-xl">🏥</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-0.5">Pending Acceptance</div>
            <div className="text-sm font-semibold text-gray-800">Patient lead is waiting for your response</div>
            <div className="text-xs text-gray-400 mt-0.5">As soon as you top up, your acceptance completes automatically</div>
          </div>
          <div className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
            ⏱ 48h left
          </div>
        </div>

        {/* ROI reality check — makes cost feel trivial */}
        <div className="bg-gray-900 text-white rounded-2xl p-5 mb-8">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">The math is simple</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-black text-teal-400">₹500</div>
              <div className="text-xs text-gray-400 mt-1">cost per lead</div>
            </div>
            <div className="flex items-center justify-center text-gray-600 text-lg font-bold">vs</div>
            <div>
              <div className="text-xl font-black text-white">₹3–12L</div>
              <div className="text-xs text-gray-400 mt-1">avg. treatment value</div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-4 pt-3 text-xs text-gray-400 text-center">
            One converted patient pays for <span className="text-white font-bold">600–2,400 credits</span>
          </div>
        </div>

        {/* Bundle cards */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {BUNDLES.map((bundle) => (
            <div
              key={bundle.credits}
              className={`relative bg-white rounded-2xl border-2 p-4 flex flex-col transition-shadow ${
                bundle.highlight
                  ? "border-teal-500 shadow-xl shadow-teal-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {bundle.tag && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full whitespace-nowrap">
                  {bundle.tag}
                </div>
              )}

              <div className="mb-3">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{bundle.label}</div>
                <div className="text-3xl font-black text-gray-900 leading-none">{bundle.credits}</div>
                <div className="text-xs text-gray-400">credits</div>
              </div>

              <div className="mb-1">
                <div className="text-lg font-black text-gray-900">₹{bundle.price.toLocaleString("en-IN")}</div>
                <div className="text-[10px] text-teal-600 font-semibold">{bundle.perLead}</div>
              </div>

              {bundle.highlight && (
                <div className="text-[10px] text-gray-400 mb-3">{bundle.value}</div>
              )}

              <button
                onClick={() => handleBuy(bundle.credits as 10 | 25 | 50)}
                disabled={loading !== null}
                className={`mt-auto w-full py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 ${
                  bundle.highlight
                    ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {loading === bundle.credits ? "Opening…" : bundle.highlight ? "✓ Complete Acceptance" : "Select"}
              </button>
            </div>
          ))}
        </div>

        {/* Urgency nudge */}
        <p className="text-center text-xs text-gray-400 mb-8">
          Credits never expire · Use on any future lead · Cancel anytime
        </p>

        {/* Objection handling */}
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 mb-6">
          {[
            {
              q: "Why am I paying now?",
              a: "We gave you free leads to prove the quality. Now that you've seen the value, credits keep the pipeline flowing — we only charge when you actually want a patient.",
            },
            {
              q: "What if the patient doesn't convert?",
              a: "Credits cover the introduction only. You're paying for a qualified, pre-screened CIS patient actively seeking treatment in India — not a guarantee. The conversion is yours to close.",
            },
            {
              q: "Are more leads coming?",
              a: "Yes. We send new patient inquiries to relevant specialists every day. Your credits sit in your account until you use them.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="px-5 py-4">
              <div className="text-sm font-bold text-gray-800 mb-1">{q}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{a}</div>
            </div>
          ))}
        </div>

        {/* Dev bypass */}
        {isDev && (
          <div className="mb-5 border-2 border-dashed border-orange-300 rounded-xl p-4 text-center bg-orange-50">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">⚡ Dev Mode</p>
            <button
              onClick={handleDevBypass}
              disabled={bypassing}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {bypassing ? "Adding credits…" : "Add 10 Test Credits & Continue"}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 text-center mb-5">
            {error}
          </div>
        )}

        {/* Trust footer */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>🔒 Payments secured by Razorpay · UPI · Cards · Net Banking</p>
          <p>
            Questions?{" "}
            <a href="mailto:care@hospitalguru.com" className="text-teal-600 font-medium">
              care@hospitalguru.com
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script   = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export default function BuyCreditsPage() {
  return (
    <Suspense>
      <BuyCreditsContent />
    </Suspense>
  );
}
