// src/routes/login.tsx
// Phone-OTP login, wired to the real KamleshKhyati Astro API
// (LoginOtp / OtpVerification / RegisterUser — see lib/api/auth.functions.ts).
// Google login is UI-only for now: no OAuth client ID yet, so it toasts a
// "coming soon" message — same placeholder pattern used for Chat/Call on
// astrologer cards (see astrologer-helpers.ts) until it's actually wired up.

import { useState, useRef } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendLoginOtp, verifyLoginOtp, registerUser, getUserProfile } from "@/lib/api/auth.functions";
import { useAuth, type AstroViewUser } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log in — AstroView" }],
  }),
  component: LoginPage,
});

type Step = "phone" | "otp" | "details";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.31A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.58.38-2.31v-3.1H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.4l4.01-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.23 0 12 0 7.31 0 3.26 2.69 1.3 6.6l4.01 3.1c.94-2.83 3.58-4.95 6.69-4.95Z"
      />
    </svg>
  );
}

function LoginPage() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const pendingUserRef = useRef<Partial<AstroViewUser> | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  const phoneValid = /^\d{10}$/.test(phone);

  const handlePhoneChange = (raw: string) => {
    setPhone(raw.replace(/\D/g, "").slice(0, 10));
  };

  const handleSendOtp = async () => {
    if (!phoneValid) return;
    setLoading(true);
    try {
      await sendLoginOtp({ data: { mobileNo: phone } });
      toast.success("OTP sent", { description: `We've sent a code to +91 ${phone}` });
      setStep("otp");
    } catch (err) {
      toast.error("Couldn't send OTP", {
        description: err instanceof Error ? err.message : "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return;
    setLoading(true);
    try {
      const result = await verifyLoginOtp({ data: { mobileNo: phone, otp } });

      const userId = String(result?.userId ?? result?.id ?? phone);
      const token: string | undefined = result?.token ?? result?.accessToken;

      if (result?.isProfileComplete) {
        // Existing user. OtpVerification doesn't return a name, so fetch
        // the profile to get it before logging them in.
        // GetUserProfile returns a different shape than RegisterUser/
        // UserProfile assume — firstName/lastName instead of name, no email
        // field at all, and gender/city come back as numeric IDs (genderId,
        // cityId) rather than free text. We only use it for a display name
        // here; the profile edit form's gender/city fields don't map to
        // this backend model yet (see profile.tsx note) and need real
        // lookup values before they can round-trip correctly.
        //
        // Some backend records still carry the literal Swagger placeholder
        // value "string" for lastName (default request-body value nobody
        // overwrote) — filter that out so it never shows up in the UI.
        const isRealValue = (v?: string) =>
          !!v && v.trim().length > 0 && v.trim().toLowerCase() !== "string";
        const profile = await getUserProfile({ data: { userId, token } });
        const resolvedName =
          [profile?.firstName, profile?.lastName]
            .filter(isRealValue)
            .join(" ")
            .trim() || "there";
        // dob is a plain date field (unlike genderId/cityId, which are
        // numeric lookup IDs we can't safely map yet) — take the date part
        // only, in case the backend sends a full ISO datetime string.
        const resolvedDob =
          typeof profile?.dob === "string" && profile.dob.trim()
            ? profile.dob.split("T")[0]
            : undefined;
        login({
          userId,
          mobileNo: phone,
          name: resolvedName,
          dob: resolvedDob,
          token,
        });
        toast.success(`Welcome back, ${resolvedName}!`);
        navigate({ to: "/" });
      } else {
        // Profile not complete yet — collect a name and call RegisterUser
        // before considering them logged in. Keep the token around —
        // RegisterUser needs it as a bearer header.
        pendingUserRef.current = { userId, mobileNo: phone, token };
        setStep("details");
      }
    } catch (err) {
      toast.error("Verification failed", {
        description:
          err instanceof Error ? err.message : "That code didn't match — please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const pendingToken = pendingUserRef.current?.token;
      const result = await registerUser({
        data: { mobileNo: phone, name: name.trim(), token: pendingToken },
      });
      const userId = String(
        result?.userId ?? result?.id ?? pendingUserRef.current?.userId ?? phone,
      );
      const token: string | undefined = result?.token ?? result?.accessToken ?? pendingToken;
      login({ userId, mobileNo: phone, name: name.trim(), email: result?.email, token });
      toast.success(`Welcome to AstroView, ${name.trim()}!`);
      navigate({ to: "/" });
    } catch (err) {
      toast.error("Couldn't complete sign up", {
        description: err instanceof Error ? err.message : "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast("Google sign-in is launching soon", {
      description: "Phone login works right now — Google will follow once it's wired up.",
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-soft">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold">
            {step === "phone" && "Log in to AstroView"}
            {step === "otp" && "Verify your number"}
            {step === "details" && "Almost there"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {step === "phone" && "Enter your phone number to continue"}
            {step === "otp" && `Enter the code sent to +91 ${phone}`}
            {step === "details" && "Tell us your name to finish setting up"}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          {step === "phone" && (
            <>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Phone number
              </label>
              <div className="flex items-center rounded-xl border border-input bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                <span className="px-3 py-2.5 text-sm text-muted-foreground border-r border-border select-none">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                  maxLength={10}
                />
              </div>
              {phone.length > 0 && !phoneValid && (
                <p className="mt-1.5 text-xs text-destructive">
                  Enter a valid 10-digit mobile number
                </p>
              )}

              <Button
                className="w-full mt-4 rounded-full bg-gradient-primary text-primary-foreground"
                disabled={!phoneValid || loading}
                onClick={handleSendOtp}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send OTP
              </Button>

              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button variant="outline" className="w-full rounded-full" onClick={handleGoogleLogin}>
                <GoogleIcon />
                Continue with Google
              </Button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                className="w-full mt-5 rounded-full bg-gradient-primary text-primary-foreground"
                disabled={otp.length < 4 || loading}
                onClick={handleVerifyOtp}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify &amp; continue
              </Button>

              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
                className="mt-4 mx-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Change number
              </button>
            </>
          )}

          {step === "details" && (
            <>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Your name
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarthak Sharma"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
              />

              <Button
                className="w-full mt-4 rounded-full bg-gradient-primary text-primary-foreground"
                disabled={!name.trim() || loading}
                onClick={handleCompleteRegistration}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Finish sign up
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => router.history.back()}
          className="mt-6 mx-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      </div>
    </main>
  );
}