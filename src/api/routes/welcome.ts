import { Request, Response, Router } from "express";
import middlewares from "../middlewares";

const route = Router();

export default (app: Router) => {
  app.use("/welcome", route);

  route.get("/", middlewares.isValid, (req: Request, res: Response) => {
    res.send("welcome!");
  });
};
