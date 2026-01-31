import { config } from "@/config";
import AppError from "@/core/errors/AppError";
import handleZodError from "@/core/errors/handleZodError";
import { logger } from "@/core/logger";
import {
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import chalk from "chalk";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

// Get HH:MM:SS timestamp
export const getTimeStamp = () => new Date().toTimeString().split(" ")[0];

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const time = getTimeStamp();

  // Default values
  let statusCode = 500;
  let message = "Something went wrong!";
  let data: Record<string, any> = {};
  let errorDetails: Record<string, any> = {};

  // Helper: add dev details
  const addDevDetails = (details: Record<string, any>) => {
    if (config.server.isDev) {
      errorDetails = { ...errorDetails, ...details };
    }
  };

  // Handle AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    data = err.data || {};
    addDevDetails({ stack: err.stack });
  }
  // Zod validation
  else if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode || 400;
    message = simplified.message;
    errorDetails = simplified.errorDetails || {};
  }
  // Prisma Errors
  else if (err?.code?.startsWith("P")) {
    const code = err.code;
    switch (code) {
      case "P2002": // Unique constraint
        statusCode = 409;
        message = `A record with this ${(err.meta?.target || []).join(", ") || "field"} already exists.`;
        data = {
          conflictField: err.meta?.target,
          conflictType: "unique_constraint",
        };
        addDevDetails({ code, meta: err.meta });
        break;
      case "P2003": // Foreign key
        statusCode = 400;
        message = `Invalid ${err.meta?.field_name || "reference"}. The referenced record does not exist.`;
        data = {
          invalidField: err.meta?.field_name,
          constraintType: "foreign_key",
        };
        addDevDetails({ code, meta: err.meta });
        break;
      case "P2011": // Not null
        statusCode = 400;
        message = `${err.meta?.field_name || "Field"} is required and cannot be empty.`;
        data = {
          missingField: err.meta?.field_name,
          constraintType: "not_null",
        };
        addDevDetails({ code, meta: err.meta });
        break;
      case "P2025": // Record not found
        statusCode = 404;
        message = `The requested record was not found. ${(err.meta?.cause || "").trim()}`;
        data = { recordNotFound: true };
        addDevDetails({ code, cause: err.meta?.cause });
        break;
      default: // Other Prisma errors
        statusCode = 400;
        message = "Database operation failed.";
        data = { errorCode: code };
        addDevDetails({ code, meta: err.meta });
    }
  } else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data format. Please check your input.";
    addDevDetails({ prismaError: err.message });
  } else if (err instanceof PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "An unexpected database error occurred. Please try again.";
    addDevDetails({ error: err.message });
  }
  // JSON parse errors
  else if (err?.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON format in request body.";
    data = {
      parseError: true,
      hint: "Check for missing quotes, commas, or invalid characters",
    };
    addDevDetails({ body: err.body, providedBody: req.body });
  }
  // JWT errors
  else if (
    err instanceof Error &&
    ["TokenExpiredError", "JsonWebTokenError"].includes(err.name)
  ) {
    statusCode = 401;
    message =
      err.name === "TokenExpiredError"
        ? "Your session has expired. Please log in again."
        : "Invalid authentication token. Please log in again.";
    data = {
      tokenExpired: err.name === "TokenExpiredError",
      tokenInvalid: err.name === "JsonWebTokenError",
      signOut: true,
      accessTokenExpired: err.name === "TokenExpiredError",
    };
    addDevDetails({ stack: err.stack, error: err.message });
  }
  // Generic error
  else if (err instanceof Error) {
    statusCode = (err as any)?.statusCode || 500;
    message = err.message || message;
    addDevDetails({ name: err.name, stack: err.stack });
  }
  // Unknown
  else {
    addDevDetails({ error: err, type: typeof err });
  }

  // Build response
  const response: Record<string, any> = { success: false, statusCode, message };
  if (Object.keys(data).length) response.data = data;
  if (config.server.isDev && Object.keys(errorDetails).length) {
    response.errorDetails = errorDetails;
    response.requestBody = req.body;
    response.requestPath = req.path;
    response.requestMethod = req.method;
  }

  res.status(statusCode).json(response);

  // Logging (pretty, colorized)
  const logColor =
    statusCode >= 500
      ? chalk.red
      : statusCode >= 400
        ? chalk.yellow
        : chalk.cyan;
  const logData = {
    statusCode,
    message,
    ...(Object.keys(data).length && { data }),
    ...(config.server.isDev && { errorDetails }),
  };

  if (statusCode == 401) {
    delete logData.errorDetails?.stack;
  }

  if (statusCode >= 500) {
    logger.error(message, req.method, req.path, logData);
  } else {
    logger.warn(message, req.method, req.path, logData);
  }
};

export default errorMiddleware;
