// AES-GCM encryption/decryption using the Web Crypto API.
// Works natively in modern browsers and Node.js 15+ (no extra dependencies).
// The NEXT_PUBLIC_ENCRYPT_SECRET is intentionally shared with the client so it
// can encrypt before transmission — preventing plain-text credentials in the
// network tab. True transport security is provided by HTTPS.

const SALT = "portfolio-admin-salt";
const ITERATIONS = 100_000;

async function deriveKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(SALT),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/** Encrypt a JSON-serialisable object. Returns a base64 string (IV prepended). */
export async function encryptPayload(data: object, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(secret);
  const enc = new TextEncoder();

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(JSON.stringify(data))
  );

  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);

  // btoa works in both browser and Node.js 16+
  return btoa(String.fromCharCode(...combined));
}

/** Decrypt a base64 string produced by {@link encryptPayload}. */
export async function decryptPayload<T = unknown>(
  encrypted: string,
  secret: string
): Promise<T> {
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const key = await deriveKey(secret);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );

  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}
