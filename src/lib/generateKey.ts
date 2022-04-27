import * as secp from "@noble/secp256k1";

function generateKey() {
  return secp.utils.bytesToHex(secp.utils.randomPrivateKey());
}

export default generateKey;
