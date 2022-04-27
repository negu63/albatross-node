import * as secp from "@noble/secp256k1";
import { TextEncoder } from "util";

async function hashMessage(message: string) {
  const enc = new TextEncoder();
  return secp.utils.bytesToHex(await secp.utils.sha256(enc.encode(message)));
}

export default hashMessage;
