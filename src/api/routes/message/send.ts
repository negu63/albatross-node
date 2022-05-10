import { decryptWithECDH } from "../../../lib/ecdh";
import { Request, Response, Router } from "express";
import middlewares from "../../middlewares";
import fs from "fs";
import { Adapter, JSONFile, Low } from "lowdb";
import { Message } from "../../../interfaces/Message.js";
import { ChatInfo } from "../../../interfaces/Chat.js";

const route = Router();

export default (app: Router) => {
  app.use("/message", route);

  route.post(
    "/",
    middlewares.isValidSignature,
    async (req: Request, res: Response) => {
      // Decrypt data
      const publicB = req.body.publicKey;
      const data: Message = JSON.parse(
        await decryptWithECDH(
          req.body.encryptedData,
          process.env.PRIVATE_KEY!,
          publicB
        )
      );

      // First Message
      // Make chat directory & Generate info file
      const chatsPath = `chats/${data.roomHash}`;
      const infoAdapter = new JSONFile<ChatInfo>(`${chatsPath}/info.json`);
      const infoDB = new Low(infoAdapter);
      if (!fs.existsSync(chatsPath)) {
        fs.mkdirSync(chatsPath);
        await infoDB.read();
        infoDB.data ||= {
          roomHash: "",
          members: [],
          messageCount: 0,
          recent: null,
        };
        infoDB.data.roomHash = data.roomHash;
        infoDB.data.members.push(data.publicKey);
        infoDB.data.recent = data;
        await infoDB.write();
      }

      // Save message
      const messageFileCount = fs.readdirSync(chatsPath).length;
      let messageAdapter: Adapter<Message[]>;
      await infoDB.read();

      if (messageFileCount === 1 || infoDB.data.messageCount % 100 === 0) {
        messageAdapter = new JSONFile<Message[]>(
          `${chatsPath}/${messageFileCount - 1}.json`
        );
      } else {
        messageAdapter = new JSONFile<Message[]>(
          `${chatsPath}/${messageFileCount - 2}.json`
        );
      }

      const messageDB = new Low<Message[]>(messageAdapter);
      await messageDB.read();
      messageDB.data ||= [];
      messageDB.data.push(data);
      await messageDB.write();

      infoDB.data.messageCount++;
      await infoDB.write();

      return res.sendStatus(200);
    }
  );
};
