import rateLimit from "express-rate-limit";
import type { RateLimitRequestHandler } from "express-rate-limit";
import type { Request, Response } from "express";

/**
 * Helper: build a consistent JSON 429 response.
 */
const rateLimitHandler = (message: string) =>
  (_req: Request, res: Response) => {
    const retryAfter = Math.ceil(
      parseInt(res.getHeader("RateLimit-Reset") as string || "0", 10) -
        Date.now() / 1000
    );
    res.status(429).json({
      success: false,
      message,
      retryAfter: retryAfter > 0 ? retryAfter : null,
    });
  };

/**
 * Helper: create a limiter with shared defaults.
 */
function createLimiter(
  windowMs: number,
  max: number,
  message: string
): RateLimitRequestHandler {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,   // Return RateLimit-* headers (RFC 6585)
    legacyHeaders: false,     // Disable X-RateLimit-* legacy headers
    handler: rateLimitHandler(message),
    // Use req.ip which respects trust proxy set in index.ts
    keyGenerator: (req: Request) => req.ip ?? "unknown",
  });
}

// ─── Auth-specific limiters ───────────────────────────────────────────────────

/**
 * Login: 10 attempts per 15 minutes per IP.
 * Brute-force protection for credential stuffing attacks.
 */
export const loginLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts. Please wait 15 minutes before trying again."
);

/**
 * Registration: 5 accounts per hour per IP.
 * Prevents mass account creation / spam signups.
 */
export const registerLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Too many accounts created from this IP. Please try again after an hour."
);

/**
 * Password reset: 5 requests per hour per IP.
 * Prevents email flooding and reset-token enumeration.
 */
export const passwordResetLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "Too many password reset requests. Please wait an hour before trying again."
);

/**
 * OAuth: 20 attempts per 15 minutes per IP.
 * OAuth flows are slightly less sensitive but still need protection.
 */
export const oauthLimiter = createLimiter(
  15 * 60 * 1000,
  20,
  "Too many OAuth requests. Please wait 15 minutes before trying again."
);

// ─── General API limiter ──────────────────────────────────────────────────────

/**
 * General API: 200 requests per 15 minutes per IP.
 * Applied globally to all /api/* routes as a baseline safety net.
 */
export const generalApiLimiter = createLimiter(
  15 * 60 * 1000,
  200,
  "Too many requests from this IP. Please slow down and try again later."
);
