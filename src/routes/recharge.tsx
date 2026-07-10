// src/routes/recharge.tsx
// Wallet top-up. No payment gateway wired up yet, so "Proceed to pay" mock-
// credits the local wallet balance in auth-context and shows a clear toast
// that this is a placeholder — same honesty-over-fake-flows pattern used for
// Chat/Call buttons on astrologer cards. Swap mockCreditWallet for a real
// Razorpay/Easebuzz flow once that's ready.

import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Wallet, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/recharge")({
  head: () => ({ meta: [{ title: "Recharge Wallet — AstroView" }] }),
  component: RechargePage,
});

const TIERS: { amount: number; extraPct: number; popular?: boolean }[] = [
  { amount: 10, extraPct: 100 },
  { amount: 50, extraPct: 100 },
  { amount: 100, extraPct: 100, popular: true },
  { amount: 200, extraPct: 100 },
  { amount: 500, extraPct: 50 },
  { amount: 1000, extraPct: 5 },
  { amount: 2000, extraPct: 10 },
  { amount: 5000, extraPct: 12 },
  { amount: 10000, extraPct: 15 },
];

function bonusFor(amount: number, extraPct: number) {
  return Math.round((amount * extraPct) / 100);
}

function RechargePage() {
  const { isLoggedIn, walletBalance, mockCreditWallet } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(100);
  const [custom, setCustom] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/login" });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const customAmount = Number(custom);
  const amount = custom ? (Number.isFinite(customAmount) ? customAmount : 0) : (selected ?? 0);
  const tier = TIERS.find((t) => t.amount === amount);
  const bonus = tier ? bonusFor(tier.amount, tier.extraPct) : 0;

  const handleRecharge = () => {
    if (amount <= 0) return;
    setProcessing(true);
    // Mock — no payment gateway yet. Credits wallet instantly.
    setTimeout(() => {
      mockCreditWallet(amount + bonus);
      setProcessing(false);
      toast.success(`₹${amount + bonus} added to your wallet`, {
        description:
          bonus > 0
            ? `Includes ₹${bonus} bonus. This is a mock recharge — no real payment was made.`
            : "This is a mock recharge — no real payment was made.",
      });
      setCustom("");
    }, 700);
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 pt-32 md:pt-36 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold">Recharge your wallet</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Available balance:{" "}
            <span className="font-semibold text-foreground">₹{walletBalance}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {TIERS.map((t) => (
            <button
              key={t.amount}
              onClick={() => {
                setSelected(t.amount);
                setCustom("");
              }}
              className={`relative rounded-2xl border p-4 text-center transition-all ${
                selected === t.amount && !custom
                  ? "border-primary bg-primary/10 shadow-card"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {t.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <p className="font-display text-lg font-semibold">
                ₹{t.amount.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-700">{t.extraPct}% Extra</p>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Or enter a custom amount
          </label>
          <div className="flex items-center rounded-xl border border-input bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring max-w-xs">
            <span className="px-3 py-2.5 text-sm text-muted-foreground border-r border-border">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value.replace(/\D/g, ""));
                setSelected(null);
              }}
              placeholder="Enter amount"
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Recharge amount</span>
            <span className="font-medium">₹{amount.toLocaleString("en-IN")}</span>
          </div>
          {bonus > 0 && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-emerald-700">Bonus credit</span>
              <span className="font-medium text-emerald-700">
                +₹{bonus.toLocaleString("en-IN")}
              </span>
            </div>
          )}
          <div className="h-px bg-border my-4" />
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-semibold">Total credit</span>
            <span className="font-display text-xl font-semibold">
              ₹{(amount + bonus).toLocaleString("en-IN")}
            </span>
          </div>

          <Button
            className="w-full mt-5 rounded-full bg-gradient-primary text-primary-foreground"
            disabled={amount <= 0 || processing}
            onClick={handleRecharge}
          >
            <Wallet className="h-4 w-4" />
            {processing ? "Processing…" : "Proceed to pay"}
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Mock recharge — real payments coming soon
          </p>
        </div>
      </div>
    </main>
  );
}
