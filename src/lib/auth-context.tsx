// src/lib/auth-context.tsx
// Client-side session state for logged-in users. The OTP verify/register
// calls hit the real KamleshKhyati Astro API (see api/auth.functions.ts) —
// this context just holds whatever comes back, persisted to localStorage so
// a refresh doesn't log you out.
//
// Wallet balance is still mock/local (per-browser, per-user) — there's no
// payment backend wired up yet, so "recharging" just credits a local number
// stored under a key scoped to that user's userId. Swap `mockCreditWallet`
// for a real API call once a payment backend exists.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface AstroViewUser {
  userId: string;
  mobileNo: string;
  name: string;
  email?: string;
  dob?: string;
  gender?: string;
  city?: string;
  token?: string;
}

interface AuthContextValue {
  user: AstroViewUser | null;
  isLoggedIn: boolean;
  walletBalance: number;
  login: (user: AstroViewUser) => void;
  updateUser: (patch: Partial<AstroViewUser>) => void;
  logout: () => void;
  mockCreditWallet: (amount: number) => void;
}

const STORAGE_KEY = "astroview_user";
const walletKeyFor = (userId: string) => `astroview_wallet_balance:${userId}`;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AstroViewUser | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client-only — SSR has no localStorage)
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(STORAGE_KEY);
      const parsedUser: AstroViewUser | null = rawUser ? JSON.parse(rawUser) : null;
      if (parsedUser) setUser(parsedUser);

      if (parsedUser) {
        const rawWallet = localStorage.getItem(walletKeyFor(parsedUser.userId));
        if (rawWallet) setWalletBalance(Number(rawWallet) || 0);
      }
    } catch {
      // ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user, hydrated]);

  // Reload wallet balance whenever the logged-in user changes (login,
  // logout, or switching accounts) so balances never leak between users.
  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      setWalletBalance(0);
      return;
    }
    try {
      const rawWallet = localStorage.getItem(walletKeyFor(user.userId));
      setWalletBalance(rawWallet ? Number(rawWallet) || 0 : 0);
    } catch {
      setWalletBalance(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, hydrated]);

  useEffect(() => {
    if (!hydrated || !user) return;
    localStorage.setItem(walletKeyFor(user.userId), String(walletBalance));
  }, [walletBalance, hydrated, user]);

  const login = (newUser: AstroViewUser) => setUser(newUser);
  const updateUser = (patch: Partial<AstroViewUser>) =>
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  const logout = () => setUser(null);
  const mockCreditWallet = (amount: number) => setWalletBalance((prev) => prev + amount);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        walletBalance,
        login,
        updateUser,
        logout,
        mockCreditWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
