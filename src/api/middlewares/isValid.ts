import { NextFunction, Request, Response } from "express";

const isValid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return next();
  } catch (e) {
    return next(e);
  }
};

export default isValid;
