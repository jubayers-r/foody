import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  // This is your SERVER path
  baseURL: "http://localhost:5000/api/v1/auth",

  // ADD THIS SECTION:
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string", // Enums are stored as strings in JS/TS
        required: true,
        defaultValue: "CUSTOMER", // Safety fallback
        input: true, // Allows the frontend to pass 'role' during sign-up
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
        input: false, // Prevents users from making themselves 'ACTIVE' manually if suspended
      },
      isDeleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
});
