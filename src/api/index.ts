import { Router } from "express";
import sendSignature from "./routes/signature/send.js";
import sendSignatureRelay from "./routes/signature/send-relay";
import acceptSignature from "./routes/signature/accept";
import rejectSignature from "./routes/signature/reject.js";
import getSignature from "./routes/signature/get.js";
import listSignature from "./routes/signature/list.js";
import sendMessage from "./routes/message/send.js";

export default () => {
  const app = Router();

  sendSignature(app);
  sendSignatureRelay(app);
  acceptSignature(app);
  rejectSignature(app);
  getSignature(app)
  listSignature(app);

  sendMessage(app);
  return app;
};
