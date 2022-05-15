import { Request, Response, Router } from "express";
import { decryptWithECDH, encryptWithECDH } from "../../../lib/ecdh";
import generateSignature from "../../../lib/generateSignature";
import middlewares from "../../middlewares";
import axios from "axios";

const route = Router();

export default (app: Router) => {
  app.use("/signature", route);

  route.post(
    "/relay",
    middlewares.isValidSignature,
    async (req: Request, res: Response) => {
      // Decrypt data
      const publicB = req.body.publicKey ?? process.env.PUBLIC_KEY;
      const data = JSON.parse(
        await decryptWithECDH(
          req.body.encryptedData,
          process.env.PRIVATE_KEY!,
          publicB
        )
      );

      const encryptedData = await encryptWithECDH(
        JSON.stringify({ ip: process.env.PUBLIC_IP }),
        process.env.PRIVATE_KEY,
        data.publicKey
      );
      const sig = await generateSignature(
        encryptedData,
        process.env.PRIVATE_KEY
      );
      return await axios
        .post(
          `http://${data.ip}:3000/api/signature`,
          JSON.stringify({
            publicKey: process.env.PUBLIC_KEY,
            encryptedData,
          }),
          {
            headers: { Authorization: sig, "Content-Type": "application/json" },
          }
        )
        .then((axiosRes) => {
          return res.sendStatus(axiosRes.status);
        })
        .catch((error) => {
          return res.sendStatus(500);
        });
    }
  );
};
