import { Request, Response, Router } from "express";
import fs from "fs";
import { JSONFile, Low } from "lowdb";
import { Signature } from "../../../interfaces/Signature.js";
import { encryptWithECDH } from "../../../lib/ecdh.js";
import middlewares from "../../middlewares/index.js";

const route = Router();

export default (app: Router) => {
  app.use("/signature", route);

  route.get(
    "/all",
    middlewares.isValidSignature,
    async (req: Request, res: Response) => {
      // Generate signature list
      const signatureDir = `./signatures`;
      if (fs.existsSync(signatureDir)) {
        const signatures: string[] = [];
        const signatureFiles = fs.readdirSync(signatureDir);
        await Promise.all(
          signatureFiles.map(async (signatureFile) => {
            const signaturePath = `${signatureDir}/${signatureFile}`;
            // Read the signature
            const adapter = new JSONFile<Signature>(signaturePath);
            const db = new Low(adapter);
            await db.read();
            signatures.push(
              await encryptWithECDH(
                JSON.stringify(db.data),
                process.env.PRIVATE_KEY,
                process.env.PUBLIC_KEY
              )
            );
          })
        );
        res
          .status(200)
          .json({ message: "Fetch complete.", encryptedData: signatures });
      } else {
        res.status(500).json({ message: "Failed." });
      }
    }
  );
};
