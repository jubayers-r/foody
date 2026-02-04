import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";

const app: Application = express();
app.use(express.json());
const apiV1 = express.Router();
app.use("/api/v1/", apiV1);

apiV1.all("/auth/{*any}", toNodeHandler(auth));
app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL,
    credentials: true,
  }),
);

export default app;
