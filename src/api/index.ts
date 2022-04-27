import { Router } from "express";
import welcome from "./routes/welcome";

export default () => {
  const app = Router();
  welcome(app);

  return app;
};
