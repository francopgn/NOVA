"use client";
import * as React from "react";
import type { ProviderProfileDraft } from "@/lib/provider-profile";

interface ProviderProfileContextValue {
  profile: ProviderProfileDraft | null;
  onboarded: boolean;
  hydrated: boolean;
  saveProfile: (draft: ProviderProfileDraft) => void;
  resetProfile: () => void;
}

const ProviderProfileContext = React.createContext<ProviderProfileContextValue | null>(null);
const STORAGE_KEY = "sessio:provider-profile";

export function ProviderProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<ProviderProfileDraft | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    } finally {
      setHydrated(true);
    }
  }, []);

  const saveProfile = React.useCallback((draft: ProviderProfileDraft) => {
    setProfile(draft);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, []);

  const resetProfile = React.useCallback(() => {
    setProfile(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ProviderProfileContext.Provider value={{ profile, onboarded: !!profile, hydrated, saveProfile, resetProfile }}>
      {children}
    </ProviderProfileContext.Provider>
  );
}

export function useProviderProfile() {
  const ctx = React.useContext(ProviderProfileContext);
  if (!ctx) throw new Error("useProviderProfile must be used within ProviderProfileProvider");
  return ctx;
}
