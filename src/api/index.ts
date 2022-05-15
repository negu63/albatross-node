import { Router } from "express";
import sendSignature from "./routes/signature/send.js";
import acceptSignature from "./routes/signature/accept";
import rejectSignature from "./routes/signature/reject.js";
import listSignature from "./routes/signature/list.js";
import sendMessage from "./routes/message/send.js";

export default () => {
  const app = Router();

  sendSignature(app);
  acceptSignature(app);
  rejectSignature(app);
  listSignature(app);

  sendMessage(app);
  return app;
};
