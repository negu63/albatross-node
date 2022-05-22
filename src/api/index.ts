import { Router } from "express";
import signSignature from "./routes/signatures/sign";

export default () => {
  const app = Router();

  signSignature(app);

  return app;
};
