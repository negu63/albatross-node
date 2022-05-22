import { Request, Response, Router } from "express";
import fs from "fs";
import { decryptWithECDH, encryptWithECDH } from "../../../lib/ecdh.js";
import { JSONFile, Low } from "lowdb";
import { Signature } from "../../../interfaces/Signature.js";
import { NodeInfo } from "../../../interfaces/NodeInfo.js";
import axios from "axios";

const route = Router();

export default (app: Router) => {
  app.use("/signatures", route);

  route.get("/", async (req: Request, res: Response) => {
    try {
      // Decrypt Data
      const publicB = req.body.publicKey;
      const reqData = JSON.parse(
        await decryptWithECDH(
          req.body.encryptedData,
          process.env.PRIVATE_KEY!,
          publicB
        )
      );

      // Find signature
      const sigPath = `signatures/${reqData.queryPublicKey}.json`;
      const isExist = fs.existsSync(sigPath);

      if (isExist) {
        const adapter = new JSONFile<Signature>(sigPath);
        const db = new Low(adapter);
        await db.read();

        const encryptedData = await encryptWithECDH(
          JSON.stringify(db.data),
          process.env.PRIVATE_KEY,
          reqData.publicKey
        );

        res
          .status(200)
          .json({ publicKey: process.env.PUBLIC_KEY, encryptedData });
      } else {
        // Query signature
        res.status(303).send();
        const data = {
          ip: process.env.PUBLIC_IP,
          publicKey: process.env.PUBLIC_KEY,
          queryPublicKey: reqData.queryPublicKey,
        };

        const adapter = new JSONFile<NodeInfo[]>("node-info.json");
        const db = new Low(adapter);
        await db.read();

        db.data.forEach(async (nodeInfo) => {
          const encryptedData = await encryptWithECDH(
            JSON.stringify(data),
            process.env.PRIVATE_KEY,
            nodeInfo.publicKey
          );

          await axios.post(
            `http://${nodeInfo.ip}:3000/api/signatures/query`,
            JSON.stringify({
              publicKey: process.env.PUBLIC_KEY,
              encryptedData,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        });
      }
    } catch (error) {
      res.status(500).send();
    }
  });
};
