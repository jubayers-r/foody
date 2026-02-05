import { Request, Response } from "express";
import { userService } from "./user.service";

const getMe = async (req: Request, res: Response) => {
  const result = await userService.getMe(req.params.id as string);
};

export const userController = { getMe };
