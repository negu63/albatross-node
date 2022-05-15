import { Request, Response, Router } from "express";
import { encryptWithECDH } from "../../../lib/ecdh.js";
import generateSignature from "../../../lib/generateSignature.js";
import middlewares from "../../middlewares/index.js";

const route = Router();

export default (app: Router) => {
  app.use("/signature", route);

  route.get(
    "/",
    middlewares.isValidSignature,
    middlewares.isFriend,
    async (req: Request, res: Response) => {
      // Generate signature
      const encryptedData = await encryptWithECDH(
        JSON.stringify({ ip: process.env.PUBLIC_IP }),
        process.env.PRIVATE_KEY,
        req.body.publicKey
      );
      const sig = await generateSignature(
        encryptedData,
        process.env.PRIVATE_KEY
      );

      res.setHeader("Authorization", sig);
      res.status(200).json({
        publicKey: process.env.PUBLIC_KEY,
        encryptedData,
      });
    }
  );
};
