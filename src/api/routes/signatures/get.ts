import { Request, Response, Router } from "express";
import middlewares from "../../middlewares/index.js";
import fs from "fs";
import { decryptWithECDH } from "../../../lib/ecdh.js";

const route = Router();

export default (app: Router) => {
  app.use("/signature", route);

  route.get(
    "/",
    middlewares.isValidSignature,
    async (req: Request, res: Response) => {
      // Decrypt Data
      const publicB = req.body.publicKey;
      const data = JSON.parse(
        await decryptWithECDH(
          req.body.encryptedData,
          process.env.PRIVATE_KEY!,
          publicB
        )
      );

      // Find signature
      const sigPath = `sinatures/${data.publicKey}.json`;
      const isExist = fs.existsSync(sigPath);
      if (isExist) {
        res.status(200).json({});
      } else {
        res.status(500);
      }
    }
  );
};
