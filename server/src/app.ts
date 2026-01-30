import express, { Application } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

const app: Application = express();
const apiV1 = express.Router();
app.use("/api/v1/", apiV1);

apiV1.all("/auth/{*any}", toNodeHandler(auth));
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
);

export default app;
