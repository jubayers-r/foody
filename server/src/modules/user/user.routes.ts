import authorize from "@/middleware/authorize.middleware";
import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.get("/me", authorize(), userController.getMe);

export const userRoute = router;
