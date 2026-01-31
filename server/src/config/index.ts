import { env } from "./env";

export const config = {
  projectName: env.PROJECT_NAME,
  db: {
    url: env.DATABASE_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d",
  },
  server: {
    port: env.PORT,
    env: env.NODE_ENV,
    isDev: env.NODE_ENV === "development",
    baseUrl:
      env.NODE_ENV === "production"
        ? env.BASE_URL_SERVER_PROD
        : env.BASE_URL_SERVER_DEV,
    baseUrlDev: env.BASE_URL_SERVER_DEV,
    baseUrlProd: env.BASE_URL_SERVER_PROD,
  },
  email: {
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT),
    secure: env.EMAIL_SECURE === "true",
    user: env.EMAIL_USER,
    password: env.EMAIL_PASSWORD,
    from: env.EMAIL_FROM,
  },
  admin: {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  },
  firebase: {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  redis: {
    url: env.REDIS_URL,
  },
} as const; // 'as const' makes the config object read-only
