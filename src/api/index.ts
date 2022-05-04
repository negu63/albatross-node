import { Router } from "express";
import receiveSignature from "./routes/receive-signature";
import acceptSignature from "./routes/accept-signature";
import welcome from "./routes/welcome";

export default () => {
  const app = Router();
  receiveSignature(app);
  acceptSignature(app);
  welcome(app);

  return app;
};
