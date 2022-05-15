import { NextFunction, Request, Response } from "express";
import fs from "fs";

const isFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isExist = fs.existsSync(`./friends/${req.body.publicKey}.json`);
    if (!isExist) {
      return res.sendStatus(403);
    }

    return next();
  } catch (e) {
    return next(e);
  }
};

export default isFriend;
