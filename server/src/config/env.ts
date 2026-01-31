import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  // server config
  PROJECT_NAME: z.string(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default(5000),
  DATABASE_URL: z.url(),

  // JWT config
  JWT_SECRET: z.string().min(32),

  // Redis config
  REDIS_URL: z.string().optional(),

  // Provider keys
  STRIPE_SECRET_KEY: z.string().optional(),

  // email config
  EMAIL_HOST: z.string().min(1),
  EMAIL_PORT: z.string().min(1),
  EMAIL_SECURE: z.string().min(1),
  EMAIL_USER: z.string().min(1),
  EMAIL_PASSWORD: z.string().min(1),
  EMAIL_FROM: z.string().min(1),

  // admin config
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string().min(6),

  // Server URLs
  BASE_URL_SERVER_DEV: z.url().default("http://localhost:5000"),
  BASE_URL_SERVER_PROD: z.url().default("http://localhost:5000"),

  // firebase config
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.issues);
  // process.exit(1); // Stop the app immediately
}

export const env = _env.data!;
