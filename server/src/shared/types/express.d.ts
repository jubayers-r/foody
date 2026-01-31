import { USER_ROLE_ENUM } from "@/prisma/generated/enums";

// Define the shape of your user object
export type JwtUser = {
  id: string;
  email: string;
  // role: USER_ROLE_ENUM;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
      startTime?: bigint; // Use bigint if using process.hrtime.bigint()
    }
  }
}
