
import { Router } from "express";

type ModuleRoute = {
  route: Router;
  path: string;
};

const globalRouter = Router();

const moduleRoutes: ModuleRoute[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => globalRouter.use(route.path, route.route));

export default globalRouter;
