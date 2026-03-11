/**
 * This service provides secure, environment-agnostic encryption and decryption
 * using the Web Crypto API (SubtleCrypto), which is available in both
 * Cloudflare Workers and modern Node.js environments.
 *
 * It uses AES-GCM, an authenticated encryption algorithm that ensures both
 * confidentiality and integrity of the data.
 */

import { Exception } from "./exception";

// The encryption algorithm and its parameters.
const ALGORITHM = "AES-GCM";
const IV_LENGTH_BYTES = 12; // 96 bits is the recommended IV length for AES-GCM.

/**
 * Memoized function to derive a cryptographic key from a secret string.
 * It uses SHA-256 to hash the secret into a 32-byte key, suitable for AES-256.
 * The key is cached in memory to avoid re-deriving it on every call.
 *
 * @param secret A high-entropy secret string from your environment variables.
 * @returns A promise that resolves to a CryptoKey.
 */
const getCryptoKey = async (secret: string): Promise<CryptoKey> => {
    if (!secret) {
        throw new Exception("SECRET_REQUIRED", {
            message: `secret is required, received empty`,
        });
    }

    const encoder = new TextEncoder();
    const secretData = encoder.encode(secret);
    const secretDigest = await crypto.subtle.digest("SHA-256", secretData);

    const key = await crypto.subtle.importKey(
        "raw",
        secretDigest,
        { name: ALGORITHM },
        false, // not extractable
        ["encrypt", "decrypt"],
    );

    return key;
};

/**
 * Encrypts a plaintext string into a single, URL-safe string.
 * This output string contains the encrypted data and the initialization vector (IV),
 * both of which are required for decryption.
 *
 * @param plaintext The string to encrypt.
 * @param secret The secret key from your environment variables (e.g., c.env.ENCRYPTION_SECRET).
 * @returns A promise resolving to the URL-safe encrypted token.
 */
export const encrypt = async (
    plaintext: string,
    secret: string,
): Promise<string> => {
    const key = await getCryptoKey(secret);
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));

    const encoder = new TextEncoder();
    const plaintextBuffer = encoder.encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
        { name: ALGORITHM, iv: iv },
        key,
        plaintextBuffer,
    );

    // Combine IV and ciphertext into one buffer: [iv, ciphertext]
    const combinedBuffer = new Uint8Array(iv.length + ciphertext.byteLength);
    combinedBuffer.set(iv, 0);
    combinedBuffer.set(new Uint8Array(ciphertext), iv.length);

    return Buffer.from(combinedBuffer.buffer).toString("base64url");
};

/**
 * Decrypts a token from the encrypt() function back to its original plaintext.
 *
 * @param encryptedToken The URL-safe encrypted token.
 * @param secret The secret key from your environment variables (e.g., c.env.ENCRYPTION_SECRET).
 * @returns A promise resolving to the original plaintext string
 */
export const decrypt = async (
    encryptedToken: string,
    secret: string,
): Promise<string> => {
    const key = await getCryptoKey(secret);
    const combinedBuffer = Buffer.from(encryptedToken, "base64url").buffer;

    // Extract the IV from the beginning of the buffer
    const iv = new Uint8Array(combinedBuffer.slice(0, IV_LENGTH_BYTES));
    const ciphertext = new Uint8Array(combinedBuffer.slice(IV_LENGTH_BYTES));

    if (iv.length !== IV_LENGTH_BYTES) {
        // Invalid token format
        throw new Exception("INVALID_TOKEN_FORMAT", {
            message: `expect iv length: ${IV_LENGTH_BYTES}, received: ${iv.length}`,
        });
    }

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: ALGORITHM, iv: iv },
        key,
        ciphertext,
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
};
