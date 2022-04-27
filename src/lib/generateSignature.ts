import * as secp from "@noble/secp256k1";
import hashMessage from "./hashMessage";

async function generateSignature(
  msg: string,
  privKey: string,
  extraEntropy = true
) {
  return secp.utils.bytesToHex(
    extraEntropy
      ? await secp.sign(await hashMessage(msg), privKey, {
          extraEntropy: true,
        })
      : await secp.sign(await hashMessage(msg), privKey)
  );
}

export default generateSignature;
