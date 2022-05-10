import { Router } from "express";
import acceptSignature from "./routes/accept-signature";
import rejectSignature from "./routes/reject-signature.js";
import testSignature from "./routes/test-signature";
import sendSignature from "./routes/signature/send.js";

export default () => {
  const app = Router();
  sendSignature(app);
  acceptSignature(app);
  rejectSignature(app);
  testSignature(app);

  return app;
};
