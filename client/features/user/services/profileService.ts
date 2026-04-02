import api from "@/api/axios";

export type UserProfile = {
  _id: string
  username: string
  name: string
  avatar: string
  bio: string
  joinedDate: string
  isOnline: boolean
  lastSeen: string | null
  privacySettings: {
    showOnlineStatus: boolean
  }
}

// ── Public API ─────────────────────────────────────────────────────────────
export const profileService = {
  /** Fetch a user profile by username. */
  async getProfile(username: string): Promise<UserProfile> {
    const user = await api.get(`/users/u/${username}`) as any;
    
    // Format the date for the UI
    const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return {
      ...user,
      joinedDate,
    };
  },

  /** Check whether the viewer already has a conversation with this user. */
  hasExistingConversation(_userId: string): boolean {
    // This could be integrated with conversation store if needed
    return false;
  },
}
