import { Request, Response, Router } from "express";
import { decryptWithECDH } from "../../../lib/ecdh.js";
import { JSONFile, Low } from "lowdb";
import { Signature } from "../../../interfaces/Signature.js";

const route = Router();

export default (app: Router) => {
  app.use("/signatures", route);

  route.post("/share", async (req: Request, res: Response) => {
    try {
      // Decrypt Data
      const publicB = req.body.publicKey;
      const reqData: Signature = JSON.parse(
        await decryptWithECDH(
          req.body.encryptedData,
          process.env.PRIVATE_KEY!,
          publicB
        )
      );

      const sigPath = `signatures/${reqData.publicKey}.json`;

      const adapter = new JSONFile<Signature>(sigPath);
      const db = new Low(adapter);
      await db.read();
      db.data ||= {
        version: 0,
        sig: "",
        ip: process.env.PUBLIC_IP,
        publicKey: "",
        createAt: "",
      };
      db.data = reqData;
      await db.write();

      res.status(200).send();
    } catch (error) {
      res.status(500).send();
    }
  });
};
