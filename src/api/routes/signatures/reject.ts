import { Request, Response, Router } from "express";
import fs from "fs";
import { decryptWithECDH } from "../../../lib/ecdh.js";
import middlewares from "../../middlewares/index.js";

const route = Router();

export default (app: Router) => {
  app.use("/signature", route);

  route.delete(
    "/",
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

      // Remove signature
      const publicKey = data.publicKey;
      const signatureFile = `${publicKey}.json`;
      const signaturePath = `./signatures/${signatureFile}`;
      if (fs.existsSync(signaturePath)) {
        fs.rmSync(signaturePath);
        res.status(200).json({ message: "Rejection complete." });
      } else {
        res.status(500).json({ message: "Failed to rejection." });
      }
    }
  );
};
