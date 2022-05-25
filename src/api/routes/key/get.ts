import { Request, Response, Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/key", route);

  route.get("/", async (req: Request, res: Response) => {
    try {
      res.status(200).json({ publicKey: process.env.PUBLIC_KEY });
    } catch (error) {
      res.status(500).send();
    }
  });
};
