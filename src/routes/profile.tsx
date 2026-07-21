// src/routes/profile.tsx
// Editable profile details, extended to match the real backend field set
// confirmed against astro-admin-portal's UserProfile.jsx (Divyansh's admin
// build, same kgaapi.techascents.com backend): firstName/lastName split,
// genderId (numeric), tob/pob (astrological details), and location as
// countryId/stateId/cityId foreign keys rather than free text. These
// fields are also what gate chat eligibility (see AstrologerListing.jsx's
// isProfileComplete check) — a customer can't start a live consultation
// until DOB, TOB, POB, and gender are all filled in.
//
// Place of birth uses AstroView's own PlaceAutocomplete (offline India
// dataset + Nominatim fallback) instead of the admin portal's live
// per-keystroke Nominatim calls — same data source, no extra network
// round-trips for the common case.
//
// Saves via PUT /api/User/UserProfile (see lib/api/auth.functions.ts).

import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Wallet, ChevronRight, User, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlaceAutocomplete, { type PlaceSelection } from "@/components/PlaceAutocomplete";
import { updateUserProfile, getUserProfile } from "@/lib/api/auth.functions";
import { getStateOptions, getCityOptions, type DropdownOption } from "@/lib/api/dropdowns.functions";
import { useAuth } from "@/lib/auth-context";
import { avatarUrl } from "@/lib/avatar";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Your Profile — AstroView" }] }),
  component: ProfilePage,
});

const INDIA_COUNTRY_ID = 1;

function ProfilePage() {
  const { user, isLoggedIn, updateUser, walletBalance } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [genderId, setGenderId] = useState<number | null>(null);
  const [tob, setTob] = useState("");
  const [pobText, setPobText] = useState("");
  const [pobResolved, setPobResolved] = useState<string | null>(null);
  const [pobLat, setPobLat] = useState<number | null>(null);
  const [pobLng, setPobLng] = useState<number | null>(null);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [stateId, setStateId] = useState<number | "">("");
  const [cityId, setCityId] = useState<number | "">("");
  const [pinCode, setPinCode] = useState("");

  const [states, setStates] = useState<DropdownOption[]>([]);
  const [cities, setCities] = useState<DropdownOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Redirect out if not logged in.
  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/login" });
  }, [isLoggedIn, navigate]);

  // States list loads once, up front — country is always India here.
  useEffect(() => {
    let cancelled = false;
    setLoadingStates(true);
    getStateOptions({ data: { countryId: INDIA_COUNTRY_ID } })
      .then((list) => {
        if (!cancelled) setStates(list);
      })
      .catch(() => {
        if (!cancelled) setStates([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingStates(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hydrate the form with the latest saved profile from the backend
  // (rather than only whatever's cached locally from login) — mirrors
  // UserProfile.jsx fetching fresh on mount in the admin portal.
  useEffect(() => {
    if (!user?.userId) return;
    let cancelled = false;

    (async () => {
      try {
        const profile = await getUserProfile({ data: { userId: user.userId, token: user.token } });
        if (cancelled || !profile) return;

        // Some backend records still carry the literal Swagger placeholder
        // "string" for lastName (a default request-body value nobody
        // overwrote) — same issue login.tsx already filters for the
        // display name. Filter it here too so it never shows in the form.
        const isRealValue = (v?: string) =>
          !!v && v.trim().length > 0 && v.trim().toLowerCase() !== "string";
        const cleanFirstName = isRealValue(profile.firstName) ? profile.firstName : (user.firstName ?? "");
        const cleanLastName = isRealValue(profile.lastName) ? profile.lastName : (user.lastName ?? "");

        setFirstName(cleanFirstName);
        setLastName(cleanLastName);
        setEmail(profile.email ?? user.email ?? "");
        setDob(typeof profile.dob === "string" ? profile.dob.split("T")[0] : (user.dob ?? ""));
        setGenderId(profile.genderId ?? user.genderId ?? null);
        setTob(profile.tob ?? user.tob ?? "");
        const resolvedPob = profile.pob ?? user.pob ?? "";
        setPobText(resolvedPob);
        setPobResolved(resolvedPob || null);
        setAddressLine1(profile.addressLine1 ?? user.addressLine1 ?? "");
        setAddressLine2(profile.addressLine2 ?? user.addressLine2 ?? "");
        setPinCode(profile.pinCode ?? user.pinCode ?? "");

        const resolvedStateId = profile.stateId ?? user.stateId;
        if (resolvedStateId) {
          setStateId(resolvedStateId);
          setLoadingCities(true);
          const cityList = await getCityOptions({ data: { stateId: resolvedStateId } }).catch(() => []);
          if (!cancelled) setCities(cityList);
          setLoadingCities(false);
        }
        const resolvedCityId = profile.cityId ?? user.cityId;
        if (resolvedCityId) setCityId(resolvedCityId);
      } catch {
        // 404 just means no profile saved yet — fall back to whatever's
        // cached locally from login, which the initial useState values
        // and the block below already cover.
        if (!cancelled && user) {
          setFirstName(user.firstName ?? "");
          setLastName(user.lastName ?? "");
          setEmail(user.email ?? "");
          setDob(user.dob ?? "");
          setGenderId(user.genderId ?? null);
          setTob(user.tob ?? "");
          setPobText(user.pob ?? "");
        }
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  if (!user) return null;

  const handleStateChange = async (value: string) => {
    const id = value ? Number(value) : "";
    setStateId(id);
    setCityId("");
    setCities([]);
    if (!id) return;

    setLoadingCities(true);
    try {
      const list = await getCityOptions({ data: { stateId: id } });
      setCities(list);
    } catch {
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handlePlaceSelect = (selection: PlaceSelection) => {
    setPobResolved(selection.label);
    setPobLat(selection.latitude);
    setPobLng(selection.longitude);
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile({
        data: {
          userId: user.userId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email || undefined,
          dob: dob || undefined,
          tob: tob || undefined,
          pob: pobResolved || pobText || undefined,
          genderId: genderId ?? undefined,
          addressLine1: addressLine1 || undefined,
          addressLine2: addressLine2 || undefined,
          countryId: INDIA_COUNTRY_ID,
          stateId: stateId ? Number(stateId) : undefined,
          cityId: cityId ? Number(cityId) : undefined,
          pinCode: pinCode || undefined,
          token: user.token,
        },
      });

      updateUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email,
        dob,
        genderId: genderId ?? undefined,
        tob,
        pob: pobResolved || pobText,
        pobLat: pobLat ?? undefined,
        pobLng: pobLng ?? undefined,
        addressLine1,
        addressLine2,
        countryId: INDIA_COUNTRY_ID,
        stateId: stateId ? Number(stateId) : undefined,
        cityId: cityId ? Number(cityId) : undefined,
        pinCode,
      });
      toast.success("Profile updated — you're all set to chat with an astrologer.");
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

        {loadingProfile ? (
          <div className="flex items-center justify-center rounded-3xl border border-border bg-card p-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-8">
            {/* Personal Details */}
            <section className="space-y-4">
              <h2 className="font-display text-base font-semibold flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Personal details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First name" value={firstName} onChange={setFirstName} placeholder="First name" />
                <Field label="Last name" value={lastName} onChange={setLastName} placeholder="Last name" />
              </div>
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Gender</label>
                <div className="flex gap-2">
                  {[
                    { id: 1, label: "Male" },
                    { id: 2, label: "Female" },
                    { id: 3, label: "Other" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGenderId(g.id)}
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                        genderId === g.id
                          ? "border-primary bg-primary/10 text-primary-deep font-medium"
                          : "border-input text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Astrological Details — required before chat is unlocked */}
            <section className="space-y-4 pt-6 border-t border-border">
              <h2 className="font-display text-base font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Astrological details
              </h2>
              <p className="text-xs text-muted-foreground -mt-2">
                Needed to start a live consultation with an astrologer.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date of birth" value={dob} onChange={setDob} type="date" />
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Time of birth
                  </label>
                  <input
                    type="time"
                    step="1"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Place of birth
                </label>
                <PlaceAutocomplete
                  value={pobText}
                  onChangeText={setPobText}
                  onSelect={handlePlaceSelect}
                  resolvedPlace={pobResolved}
                  placeholder="e.g. Jaipur, Rajasthan"
                />
              </div>
            </section>

            {/* Location Details */}
            <section className="space-y-4 pt-6 border-t border-border">
              <h2 className="font-display text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Location details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Address line 1"
                  value={addressLine1}
                  onChange={setAddressLine1}
                  placeholder="House no, street"
                />
                <Field
                  label="Address line 2"
                  value={addressLine2}
                  onChange={setAddressLine2}
                  placeholder="Landmark, area (optional)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Country
                  </label>
                  <input
                    disabled
                    value="India"
                    className="w-full rounded-xl border border-input bg-secondary/50 px-3 py-2.5 text-sm text-muted-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {loadingStates ? "Loading states..." : "State"}
                  </label>
                  <select
                    value={stateId}
                    disabled={loadingStates}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                  >
                    <option value="">Select state</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    {loadingCities ? "Loading cities..." : "City"}
                  </label>
                  <select
                    value={cityId}
                    disabled={loadingCities || cities.length === 0}
                    onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : "")}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                  >
                    <option value="">Select city</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Field
                label="PIN code"
                value={pinCode}
                onChange={(v) => setPinCode(v.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit PIN code"
              />
            </section>

            <Button
              className="w-full rounded-full bg-gradient-primary text-primary-foreground"
              disabled={saving || !firstName.trim() || !lastName.trim()}
              onClick={handleSave}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        )}
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