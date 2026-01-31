import type { Request, Response } from "express";
import sendResponse from "../utils/responses.utils";

const notFoundMiddleware = (
  req: Request,
  res: Response,
) => {
  sendResponse(res, {
    statusCode: 404,
    success: false,
    message: "Not Found",
    data: {
      path: req.originalUrl,
      method: req.method,
      time: new Date().toISOString(),
    },
  });
};

export default notFoundMiddleware;
