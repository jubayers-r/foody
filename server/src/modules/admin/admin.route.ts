import authorize from "@/middleware/authorize.middleware";
import { Router } from "express";
import { UserRoles } from "generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", authorize(UserRoles.ADMIN), adminController.getAllUser);
router.patch(
  "/users/:id",
  authorize(UserRoles.ADMIN),
  adminController.getAllUser,
);

export const adminRoute = router;
