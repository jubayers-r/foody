// // import { prisma } from "@/core/database";
// import AppError from "@/core/errors/AppError";
// // import { AuthUtils } from "@/modules/auth/auth.utils";
// // import type { USER_ROLE_ENUM } from "@/prisma/generated/enums";
// import type { NextFunction, Request, Response } from "express";
// import { HTTP_STATUS_CODES } from "../constants";
// import handleController from "../utils/controller.utils";

// // type UserRole = USER_ROLE_ENUM | "LOGGED_IN" | "SUBSCRIBED_BUSINESS_OWNER";
// type UserRole = "LOGGED_IN" | "SUBSCRIBED_BUSINESS_OWNER";

// /**
//  * Middleware to verify JWT access token and check user roles
//  * @param allowedRoles - Array of roles that are allowed to access the route.
//  *                       Use 'LOGGED_IN' to allow any authenticated user regardless of role.
//  *                       Use specific roles like 'SUPER_ADMIN', 'USER' to restrict by role.
//  */
// export const authorize = (...allowedRoles: UserRole[]) => {
//   return handleController(
//     async (req: Request, res: Response, next: NextFunction) => {
//       const start = process.hrtime.bigint();

//       // Extract token from Authorization header
//       const token = AuthUtils.token.decodeFromHeader(req.headers.authorization);

//       if (!token) {
//         throw new AppError(
//           "Access token is required. Please login.",
//           HTTP_STATUS_CODES.UNAUTHORIZED,
//           { signOut: true },
//         );
//       }

//       // Verify token
//       const decoded = AuthUtils.token.decodeFromHeader(
//         req.headers.authorization,
//       );

//       if (!decoded) {
//         throw new AppError(
//           "User no longer exists. Please login again.",
//           HTTP_STATUS_CODES.UNAUTHORIZED,
//           { signOut: true },
//         );
//       }

//       req.user = {
//         id: decoded.id,
//         email: decoded.email,
//         role: decoded.role,
//       };

//       // Check if user role is allowed
//       // 'LOGGED_IN' is a special value that allows any authenticated user
//       const isLoggedInOnly =
//         allowedRoles.length === 1 && allowedRoles[0] === "LOGGED_IN";
//       const hasRoleRestrictions = allowedRoles.length > 0 && !isLoggedInOnly;

//       if (hasRoleRestrictions && !allowedRoles.includes(decoded.role)) {
//         throw new AppError(
//           "You do not have permission to access this resource.",
//           HTTP_STATUS_CODES.FORBIDDEN,
//           { requiredRole: allowedRoles, userRole: decoded.role },
//         );
//       }
//       const end = process.hrtime.bigint();
//       console.log(`JWT verify took ${Number(end - start) / 1_000_000} ms`);

//       next();
//     },
//   );
// };

// /**
//  * Middleware to verify account is verified
//  */
// export const requireVerifiedAccount = handleController(
//   async (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       throw new AppError(
//         "Authentication required",
//         HTTP_STATUS_CODES.UNAUTHORIZED,
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: req.user.id },
//       select: { isAccountVerified: true },
//     });

//     if (!user?.isAccountVerified) {
//       throw new AppError(
//         "Please verify your account to access this resource",
//         HTTP_STATUS_CODES.FORBIDDEN,
//       );
//     }

//     next();
//   },
// );

// export const attachUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const token = req.headers.authorization;

//   if (token) {
//     try {
//       const user = AuthUtils.token.decodeFromHeader(token);

//       if (user) {
//         req.user = {
//           id: user.id,
//           email: user.email,
//           role: user.role,
//         };
//       }
//     } catch {
//       // Silently ignore any errors - don't block the request
//     }
//   }

//   return next();
// };
