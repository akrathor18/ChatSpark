// store/profileStore.ts
// Responsible for: client-side UI state (copied, loading flags, mount animation)
// Uses Zustand — install with: npm i zustand

import { create } from "zustand"
import { UserProfile } from "../services/profileService"

type ProfileState = {
  // Data
  user: UserProfile | null
  // Status
  isLoading: boolean
  notFound: boolean
  isMessageLoading: boolean
  // UI feedback
  copied: boolean
  mounted: boolean
}

type ProfileActions = {
  setUser: (user: UserProfile) => void
  setLoading: (v: boolean) => void
  setNotFound: (v: boolean) => void
  setMessageLoading: (v: boolean) => void
  setCopied: (v: boolean) => void
  setMounted: (v: boolean) => void
  reset: () => void
}

const initialState: ProfileState = {
  user: null,
  isLoading: true,
  notFound: false,
  isMessageLoading: false,
  copied: false,
  mounted: false,
}

export const useProfileStore = create<ProfileState & ProfileActions>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setNotFound: (notFound) => set({ notFound }),
  setMessageLoading: (isMessageLoading) => set({ isMessageLoading }),
  setCopied: (copied) => set({ copied }),
  setMounted: (mounted) => set({ mounted }),
  reset: () => set(initialState),
}))
