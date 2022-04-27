import { NextFunction, Request, Response } from "express";
import * as secp from "@noble/secp256k1";
import hashMessage from "../../lib/hashMessage";

const isValidSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sig = req.headers.authorization;
    const publicB = req.body.publicKey;
    const msgHash = await hashMessage(req.body.encryptedData);

    const isValid = secp.verify(sig, msgHash, publicB);
    if (!isValid) {
      return res.sendStatus(403);
    }

    return next();
  } catch (e) {
    return next(e);
  }
};

export default isValidSignature;
