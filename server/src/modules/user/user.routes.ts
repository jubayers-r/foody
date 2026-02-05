import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/me", userController.getMe);

export const userRoutes = router;
