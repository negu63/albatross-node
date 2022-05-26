import { Request, Response, Router } from "express";
import { decryptWithECDH } from "../../../lib/ecdh.js";
import { JSONFile, Low } from "lowdb";
import { ChatInfo } from "../../../interfaces/Chat.js";
import fs from "fs";

const route = Router();

export default (app: Router) => {
  app.use("/chats", route);

  route.post("/", async (req: Request, res: Response) => {
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

      const chatDir = `./chats/${reqData.publicKey}/info`;
      if (!fs.existsSync(chatDir)) {
        fs.mkdirSync(chatDir, { recursive: true });
      }

      const chatPath = `${chatDir}/${reqData.chatHash}.json`;
      const adapter = new JSONFile<ChatInfo>(chatPath);
      const db = new Low(adapter);
      await db.read();
      db.data ||= {
        chatHash: "",
        members: [],
        messageCount: 0,
      };
      db.data.chatHash = reqData.chatHash;
      db.data.members = [reqData.publicKey];
      await db.write();

      res.status(200).send();
    } catch (error) {
      res.status(500).send();
    }
  });
};
