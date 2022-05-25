import { Router } from "express";
import signSignature from "./routes/signatures/sign";
import getSignature from "./routes/signatures/get";
import querySignature from "./routes/signatures/query";
import shareSignature from "./routes/signatures/share";
import getPublicKey from "./routes/key/get"

export default () => {
  const app = Router();

  signSignature(app);
  getSignature(app);
  querySignature(app)
  shareSignature(app)

  getPublicKey(app)

  return app;
};
