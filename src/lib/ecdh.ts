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
  return CryptoJS.AES.encrypt(
    data,
    await hexECDHKey(privateA, publicB)
  ).toString();
}

async function decryptWithECDH(
  encryptedData: string,
  privateA: string,
  publicB: string
) {
  return CryptoJS.AES.decrypt(
    encryptedData,
    await hexECDHKey(privateA, publicB)
  ).toString(CryptoJS.enc.Utf8);
}

export { hexECDHKey, encryptWithECDH, decryptWithECDH };
