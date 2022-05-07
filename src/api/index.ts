import { Router } from "express";
import receiveSignature from "./routes/receive-signature";
import acceptSignature from "./routes/accept-signature";
import rejectSignature from "./routes/reject-signature.js";
import testSignature from "./routes/test-signature";

export default () => {
  const app = Router();
  receiveSignature(app);
  acceptSignature(app);
  rejectSignature(app);
  testSignature(app);

  return app;
};
