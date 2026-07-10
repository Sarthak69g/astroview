// src/routes/profile.tsx
// Editable profile details. Saves via PUT /api/User/UserProfile (see
// lib/api/auth.functions.ts) — since the exact response shape is unconfirmed,
// on success we just merge the form values straight into local state rather
// than trusting a specific response field name.

import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Wallet, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/lib/api/auth.functions";
import { useAuth } from "@/lib/auth-context";
import { avatarUrl } from "@/lib/avatar";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Your Profile — AstroView" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isLoggedIn, updateUser, walletBalance } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/login" });
      return;
    }
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setDob(user.dob ?? "");
      setGender(user.gender ?? "");
      setCity(user.city ?? "");
    }
  }, [isLoggedIn, user, navigate]);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        data: {
          userId: user.userId,
          name,
          email: email || undefined,
          dob: dob || undefined,
          gender: gender || undefined,
          city: city || undefined,
          token: user.token,
        },
      });
      updateUser({ name, email, dob, gender, city });
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Couldn't save changes", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 pt-32 md:pt-36 pb-20">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <img
            src={avatarUrl(user.mobileNo)}
            alt={user.name}
            className="h-16 w-16 rounded-full border border-border bg-secondary object-cover"
          />
          <div>
            <h1 className="font-display text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">+91 {user.mobileNo}</p>
          </div>
        </div>

        <Link
          to="/recharge"
          className="mb-8 flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-card transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary-deep">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Wallet balance</p>
              <p className="text-xs text-muted-foreground">Recharge to book consultations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold">₹{walletBalance}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="font-display text-base font-semibold mb-1">Personal details</h2>

          <Field label="Full name" value={name} onChange={setName} placeholder="Your name" />
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            type="email"
          />
          <Field label="Date of birth" value={dob} onChange={setDob} type="date" />

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Gender</label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                    gender === g
                      ? "border-primary bg-primary/10 text-primary-deep font-medium"
                      : "border-input text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <Field label="City" value={city} onChange={setCity} placeholder="Your city" />

          <Button
            className="w-full rounded-full bg-gradient-primary text-primary-foreground mt-2"
            disabled={saving || !name.trim()}
            onClick={handleSave}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}