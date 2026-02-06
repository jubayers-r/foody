import { auth } from "@/lib/auth";
import { NextFunction, Request, Response } from "express";
import { UserRoles } from "generated/prisma/enums";

const authorize = (...roles: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        return res.status(403).json({
          success: false,
          message: "unauthorized access",
        });
      }

      if (!session?.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "email not verified",
        });
      }

      req.user = {
        id: session?.user.id!,
        email: session?.user.email!,
        name: session?.user.name!,
        role: session?.user.role!,
        emailVerified: session?.user.emailVerified!,
      };

      if (roles.length && !roles.includes(req.user.role as UserRoles)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resources!",
        });
      }
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
