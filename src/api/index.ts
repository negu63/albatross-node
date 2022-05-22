import { Router } from "express";
import signSignature from "./routes/signatures/sign";
import getSignature from "./routes/signatures/get";
import querySignature from "./routes/signatures/query";
import shareSignature from "./routes/signatures/share";

export default () => {
  const app = Router();

  signSignature(app);
  getSignature(app);
  querySignature(app)
  shareSignature(app)

  return app;
};
