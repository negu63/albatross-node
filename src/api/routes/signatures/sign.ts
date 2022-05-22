import { decryptWithECDH } from "../../../lib/ecdh";
import getCurrentDate from "../../../lib/getCurrentDate";
import { Request, Response, Router } from "express";
import middlewares from "../../middlewares";
import { Signature } from "../../../interfaces/Signature";
import fs from "fs";
import { JSONFile, Low } from "lowdb";
import * as secp from "@noble/secp256k1";
import hashMessage from "../../../lib/hashMessage";

const route = Router();

export default (app: Router) => {
  app.use("/signatures", route);

  route.post(
    "/",
    middlewares.isValidSignature,
    async (req: Request, res: Response) => {
      // Decrypt data
      const publicB = req.body.publicKey;
      const data = JSON.parse(
        await decryptWithECDH(
          req.body.encryptedData,
          process.env.PRIVATE_KEY!,
          publicB
        )
      );

      // Verify signature
      const isValid = secp.verify(
        data.sig,
        await hashMessage(process.env.PUBLIC_IP),
        data.publicKey
      );

      if (isValid) {
        // Create directory
        if (!fs.existsSync("./signatures")) {
          fs.mkdirSync("./signatures");
        }

        // Save the signature
        const adapter = new JSONFile<Signature>(
          `signatures/${data.publicKey}.json`
        );
        const db = new Low(adapter);
        await db.read();
        db.data ||= {
          version: 0,
          sig: "",
          ip: process.env.PUBLIC_IP,
          publicKey: "",
          createAt: "",
        };
        db.data.version = data.version;
        db.data.sig = data.sig;
        db.data.publicKey = data.publicKey;
        db.data.createAt = getCurrentDate();
        await db.write();

        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    }
  );
};
