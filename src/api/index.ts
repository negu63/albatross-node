import { Router } from "express";
import acceptSignature from "./routes/signature/accept";
import rejectSignature from "./routes/signature/reject.js";
import sendSignature from "./routes/signature/send.js";

export default () => {
  const app = Router();
  sendSignature(app);
  acceptSignature(app);
  rejectSignature(app);
  testSignature(app);

  return app;
};
