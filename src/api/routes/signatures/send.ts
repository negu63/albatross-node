import { decryptWithECDH } from "../../../lib/ecdh";
import getCurrentDate from "../../../lib/getCurrentDate";
import { Request, Response, Router } from "express";
import middlewares from "../../middlewares";
import { Signature } from "../../../interfaces/Signature";
import fs from "fs";
import { JSONFile, Low } from "lowdb";

const route = Router();

export default (app: Router) => {
  app.use("/signature", route);

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

      // Get signature sender's IP
      let senderIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

      if (typeof senderIP === "string") {
        senderIP = senderIP.split(":").pop()!;
      } else if (typeof senderIP === "object") {
        senderIP = senderIP[0];
      } else {
        return res.status(500);
      }

      // IP validation
      if (data.ip !== senderIP) {
        return res.sendStatus(403);
      }

      // Create directory
      if (!fs.existsSync("./signatures")) {
        fs.mkdirSync("./signatures");
      }

      // Save the signature
      const adapter = new JSONFile<Signature>(`signatures/${publicB}.json`);
      const db = new Low(adapter);
      await db.read();
      db.data ||= {
        version: 0,
        sig: "",
        publicKey: "",
        encryptedData: "",
        createAt: "",
      };
      db.data.version = 1;
      db.data.sig = req.headers.authorization;
      db.data.publicKey = req.body.publicKey;
      db.data.encryptedData = req.body.encryptedData;
      db.data.createAt = getCurrentDate();
      await db.write();

      return res.sendStatus(200);
    }
  );
};
