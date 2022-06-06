import * as secp from "@noble/secp256k1";
import { Crypto } from "@peculiar/webcrypto";

async function encryptWithECDH(
  data: string,
  privateA: string,
  publicB: string
) {
  const crypto = new Crypto();
  const key = await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest(
      "SHA-256",
      secp.getSharedSecret(privateA, publicB)
    ),
    "AES-CBC",
    false,
    ["encrypt", "decrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    Buffer.from(data)
  );
  return (
    Buffer.from(iv).toString("hex") +
    Buffer.from(encryptedData).toString("base64")
  );
}

async function decryptWithECDH(
  encryptedData: string,
  privateA: string,
  publicB: string
) {
  const crypto = new Crypto();
  const key = await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest(
      "SHA-256",
      secp.getSharedSecret(privateA, publicB)
    ),
    "AES-CBC",
    false,
    ["encrypt", "decrypt"]
  );
  const iv = Buffer.from(encryptedData.slice(0, 32), "hex");
  const decrpytedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    Buffer.from(encryptedData.slice(32), "base64")
  );
  return Buffer.from(decrpytedData).toString('utf-8');
}

export { encryptWithECDH, decryptWithECDH };
