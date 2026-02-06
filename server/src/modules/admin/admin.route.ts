import authorize, { UserRole } from "@/middleware/authorize.middleware";
import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", authorize(UserRole.ADMIN), adminController.getAllUser);
router.patch(
  "/users/:id",
  authorize(UserRole.ADMIN),
  adminController.getAllUser,
);

export const adminRoute = router;
