import { LucideIcon } from "lucide-react"

export type ProfileFormData = {
  name: string
  username: string
  email: string
  bio: string
}

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

export interface SettingsState {
  notifications: boolean
  emailNotifications: boolean
  darkMode: boolean
  soundEnabled: boolean
  notificationVolume: number[]
  showOnlineStatus: boolean
  readReceipts: boolean
  twoFactorAuth: boolean
}
