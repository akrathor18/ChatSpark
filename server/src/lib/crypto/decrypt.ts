import crypto from "crypto"

const algorithm = "aes-256-gcm"

const key = Buffer.from(
    process.env.MESSAGE_ENCRYPTION_KEY!,
    "hex"
)


export const decryptMessage = (
    cipherText: string,
    iv: string,
    authTag: string
) => {
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(iv, "hex")
    )

    decipher.setAuthTag(
        Buffer.from(authTag, "hex")
    )

    let decrypted = decipher.update(
        cipherText,
        "hex",
        "utf8"
    )

    decrypted += decipher.final("utf8")

    return decrypted
}