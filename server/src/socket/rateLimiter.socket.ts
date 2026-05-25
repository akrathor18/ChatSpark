/**
 * Lightweight in-memory Socket.io throttle utility.
 *
 * Creates an independent rate-limiter per event type.
 * Keyed by socket.id so each connection has its own counter.
 *
 * Usage:
 *   const msgThrottle = createSocketThrottle(5, 3000); // 5 calls per 3 s
 *   if (msgThrottle.isThrottled(socket.id)) { ... }
 *   msgThrottle.cleanup(socket.id); // call on disconnect
 */

interface WindowEntry {
  count: number;
  resetAt: number;
}

export interface SocketThrottle {
  /** Returns true if this socket has exceeded the limit for the current window. */
  isThrottled(socketId: string): boolean;
  /** Remove state for a disconnected socket to prevent memory leaks. */
  cleanup(socketId: string): void;
  /** Milliseconds until the current window resets (0 if not throttled). */
  retryAfterMs(socketId: string): number;
}

export function createSocketThrottle(
  maxCalls: number,
  windowMs: number
): SocketThrottle {
  const store = new Map<string, WindowEntry>();

  function getEntry(socketId: string): WindowEntry {
    const now = Date.now();
    let entry = store.get(socketId);

    if (!entry || now >= entry.resetAt) {
      // Start a fresh window
      entry = { count: 0, resetAt: now + windowMs };
      store.set(socketId, entry);
    }

    return entry;
  }

  return {
    isThrottled(socketId: string): boolean {
      const entry = getEntry(socketId);
      entry.count++;
      return entry.count > maxCalls;
    },

    retryAfterMs(socketId: string): number {
      const entry = store.get(socketId);
      if (!entry) return 0;
      const remaining = entry.resetAt - Date.now();
      return remaining > 0 ? remaining : 0;
    },

    cleanup(socketId: string): void {
      store.delete(socketId);
    },
  };
}

// ─── Pre-built throttles for each protected event ────────────────────────────

/** send_message: max 5 messages per 3 seconds per socket */
export const sendMessageThrottle = createSocketThrottle(5, 3_000);

/** typing: max 10 events per 5 seconds per socket */
export const typingThrottle = createSocketThrottle(10, 5_000);

/** register_user: max 3 registrations per 60 seconds per socket */
export const registerUserThrottle = createSocketThrottle(3, 60_000);
