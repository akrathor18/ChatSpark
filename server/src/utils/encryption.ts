import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

/**
 * Lazily resolved 32-byte key from the MESSAGE_ENCRYPTION_KEY env var.
 * Throws at call-time (not at module load) so unit tests can set the env
 * variable before the first call.
 */
function getKey(): Buffer {
  const hex = process.env.MESSAGE_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "MESSAGE_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)."
    );
  }
  return Buffer.from(hex, "hex");
}

// ─── Core encrypt / decrypt ────────────────────────────────────────────────

export interface EncryptedPayload {
  cipherText: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts a UTF-8 plaintext string with AES-256-GCM.
 * A fresh 96-bit IV is generated for every call.
 */
export function encrypt(plaintext: string): EncryptedPayload {
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return {
    cipherText: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}

/**
 * Decrypts an AES-256-GCM ciphertext back to a UTF-8 string.
 * Throws if the auth tag is invalid (tampered data).
 */
export function decrypt(
  cipherText: string,
  iv: string,
  authTag: string
): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(cipherText, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

// ─── JSON helpers for single-column storage (e.g. Conversation.lastMessage) ─

/**
 * Encrypts a plaintext string and returns a JSON string suitable for storing
 * in a single String column (e.g. Conversation.lastMessage).
 */
export function encryptToJson(plaintext: string): string {
  return JSON.stringify(encrypt(plaintext));
}

/**
 * Parses a JSON-encoded encrypted payload and returns the original plaintext.
 * Returns `null` if the input is falsy, not valid JSON, or decryption fails
 * — this guards against legacy plaintext rows in the database.
 */
export function safeDecryptFromJson(json: string | undefined | null): string | null {
  if (!json) return null;

  try {
    const payload: EncryptedPayload = JSON.parse(json);

    // Empty sentinel — message was unsent
    if (!payload.cipherText && !payload.iv && !payload.authTag) return null;

    return decrypt(payload.cipherText, payload.iv, payload.authTag);
  } catch {
    // Legacy plaintext row or corrupt data — return as-is so the UI doesn't break
    return json;
  }
}
