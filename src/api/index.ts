import { Router } from "express";
import receiveSignature from "./routes/receive-signature";
import welcome from "./routes/welcome";

export default () => {
  const app = Router();
  receiveSignature(app);
  welcome(app);

  return app;
};
