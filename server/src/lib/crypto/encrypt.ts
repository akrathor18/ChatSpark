import crypto from "crypto"

const algorithm = "aes-256-gcm"

const key = Buffer.from(
  process.env.MESSAGE_ENCRYPTION_KEY!,
  "hex"
)

export const encryptMessage = (text: string) => {
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(
    algorithm,
    key,
    iv
  )

  let encrypted = cipher.update(
    text,
    "utf8",
    "hex"
  )

  encrypted += cipher.final("hex")

  const authTag = cipher.getAuthTag()

  return {
    cipherText: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex")
  }
}