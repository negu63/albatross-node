import { Request, Response, Router } from "express";
import fs from "fs";
import { decryptWithECDH } from "../../lib/ecdh.js";
import middlewares from "../middlewares/index.js";

const route = Router();

export default (app: Router) => {
  app.use("/signature", route);

  route.post(
    "/accept",
    middlewares.isValidSignature,
    async (req: Request, res: Response) => {
      // Decrypt data
      const data = JSON.parse(
        await decryptWithECDH(
          req.body.encryptedData,
          process.env.PRIVATE_KEY!,
          process.env.PUBLIC_KEY!
        )
      );

      // Create friends directory
      const friendsDir = `./friends`;
      if (!fs.existsSync(friendsDir)) {
        fs.mkdirSync(friendsDir);
      }

      // Move signature to friends directory
      const publicKey = data.publicKey;
      const signatureFile = `${publicKey}.json`;
      const signaturePath = `./signatures/${signatureFile}`;
      if (fs.existsSync(signaturePath)) {
        fs.renameSync(signaturePath, `${friendsDir}/${signatureFile}`);
        res.status(200).json({ message: "Acceptance complete." });
      } else {
        res.status(500).json({ message: "Failed to Acceptance." });
      }
    }
  );
};
