import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Application } from "express";
import { auth } from "./lib/auth";
import { adminRoute } from "./modules/admin/admin.route";
import { userRoute } from "./modules/user/user.routes";

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

apiV1.use("/users", userRoute);
apiV1.use("/admin", adminRoute);

export default app;
