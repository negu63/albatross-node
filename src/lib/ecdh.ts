import * as secp from "@noble/secp256k1";
import CryptoJS from "crypto-js";

async function hexECDHKey(
  privateA: string,
  publicB: string,
  isCompressed = true
) {
  return secp.utils.bytesToHex(
    await secp.utils.sha256(
      secp.getSharedSecret(privateA, publicB, isCompressed)
    )
  );
}

async function encryptWithECDH(
  data: string,
  privateA: string,
  publicB: string
) {
  const iv = secp.utils.bytesToHex(secp.utils.randomBytes(16));
  return (
    iv +
    CryptoJS.AES.encrypt(
      data,
      CryptoJS.enc.Hex.parse(await hexECDHKey(privateA, publicB)),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
      }
    ).toString()
  );
}

async function decryptWithECDH(
  encryptedData: string,
  privateA: string,
  publicB: string
) {
  return CryptoJS.AES.decrypt(
    encryptedData.slice(32),
    CryptoJS.enc.Hex.parse(await hexECDHKey(privateA, publicB)),
    {
      iv: CryptoJS.enc.Hex.parse(encryptedData.slice(0, 32)),
    }
  ).toString(CryptoJS.enc.Utf8);
}

export { hexECDHKey, encryptWithECDH, decryptWithECDH };
