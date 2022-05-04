import { Router } from "express";
import receiveSignature from "./routes/receive-signature";
import acceptSignature from "./routes/accept-signature";

export default () => {
  const app = Router();
  receiveSignature(app);
  acceptSignature(app);

  return app;
};
