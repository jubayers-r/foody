import type { Response } from "express";

export type TResponse<T> = {
  statusCode: number;
  success?: boolean;
  message?: string;
  data?: T | null;
};

const sendResponse = <T>(res: Response, response: TResponse<T>) => {
  // Logic: Use provided success boolean OR calculate from status code (200-299)
  const isSuccess =
    typeof response.success === "boolean"
      ? response.success
      : response.statusCode >= 200 && response.statusCode < 300;

  return res.status(response.statusCode).json({
    success: isSuccess,
    statusCode: response.statusCode,
    message: response.message,
    data: response.data,
  });
};

export default sendResponse;
