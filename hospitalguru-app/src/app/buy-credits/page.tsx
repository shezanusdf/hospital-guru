"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const BUNDLES = [
  { credits: 10, price: 5000,  label: "Starter",    perLead: "₹500/lead",  highlight: false },
  { credits: 25, price: 10000, label: "Growth",      perLead: "₹400/lead",  highlight: true  },
  { credits: 50, price: 18000, label: "Pro",         perLead: "₹360/lead",  highlight: false },
] as const;

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function BuyCreditsContent() {
  const params        = useSearchParams();
  const pendingToken  = params.get("pending_token") ?? "";
  const pendingFor    = params.get("pending_for")   ?? "";
  const email         = params.get("email")         ?? "";

  const [loading, setLoading] = useState<number | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  async function handleBuy(credits: 10 | 25 | 50) {
    setLoading(credits);
    setError(null);

    try {
      // 1. Create Razorpay order
      const res = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ credits, pending_token: pendingToken, pending_for: pendingFor, email }),
      });

      if (!res.ok) throw new Error("Could not create order");
      const { orderId, amount, keyId } = await res.json();

      // 2. Load Razorpay JS if not already loaded
      await loadRazorpayScript();

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key:         keyId,
        amount,
        currency:    "INR",
        order_id:    orderId,
        name:        "HospitalGuru",
        description: `${credits} Lead Credits`,
        prefill:     { email },
        theme:       { color: "#0f766e" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          // 4. Verify payment and add credits
          const verifyRes = await fetch("/api/payment/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              email,
              credits,
              pending_token: pendingToken,
              pending_for:   pendingFor,
            }),
          });

          if (!verifyRes.ok) {
            setError("Payment verified but credit top-up failed. Contact care@hospitalguru.com.");
            return;
          }

          const { returnUrl } = await verifyRes.json();
          // 5. Complete the pending lead accept
          window.location.href = returnUrl;
        },
      });

      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            ⚠️ You&apos;ve used all your free leads
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">
            Buy Lead Credits
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Each credit lets you accept one patient lead and receive their full contact details.
            Credits never expire.
          </p>
          {email && (
            <p className="text-xs text-gray-400 mt-2">Account: <span className="font-mono">{email}</span></p>
          )}
        </div>

        {/* Bundle cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {BUNDLES.map((bundle) => (
            <div
              key={bundle.credits}
              className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col ${
                bundle.highlight
                  ? "border-teal-500 shadow-lg shadow-teal-100"
                  : "border-gray-200"
              }`}
            >
              {bundle.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{bundle.label}</div>
                <div className="text-4xl font-black text-gray-900">{bundle.credits}</div>
                <div className="text-sm text-gray-500">lead credits</div>
              </div>

              <div className="mb-6">
                <div className="text-2xl font-black text-teal-600">₹{bundle.price.toLocaleString("en-IN")}</div>
                <div className="text-xs text-gray-400 mt-1">{bundle.perLead}</div>
              </div>

              <button
                onClick={() => handleBuy(bundle.credits as 10 | 25 | 50)}
                disabled={loading !== null}
                className={`mt-auto w-full py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 ${
                  bundle.highlight
                    ? "bg-teal-600 hover:bg-teal-700 text-white"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                {loading === bundle.credits ? "Processing…" : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 text-center mb-6">
            {error}
          </div>
        )}

        {/* Trust line */}
        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>🔒 Secure payment via Razorpay · UPI, Cards, Net Banking accepted</p>
          <p>Questions? <a href="mailto:care@hospitalguru.com" className="text-teal-600">care@hospitalguru.com</a></p>
        </div>
      </div>
    </main>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script    = document.createElement("script");
    script.src      = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload   = () => resolve();
    script.onerror  = () => reject(new Error("Failed to load Razorpay"));
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
