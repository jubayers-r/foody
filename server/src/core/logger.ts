import { config } from "@/config";
import chalk from "chalk";
import os from "os";
import util from "util";

const formatMessage = (
  level: string,
  message: string,
  method = "",
  path = "",
) => {
  const now = new Date();
  const time = chalk.gray(
    now
      .toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(",", ""),
  );

  // Center level within 9 chars
  const tag = `[${level.padStart(Math.floor((9 + level.length) / 2)).padEnd(9)}]`;
  const route = method ? `${method.padEnd(7)} ${path} - ` : "";

  return `${time} ${tag} ${route}${message}`;
};

// Helper to format objects/metadata
const formatMeta = (meta?: any) => {
  if (!meta || Object.keys(meta).length === 0) return "";
  // util.inspect adds colors and handles deep objects nicely
  return `\n${chalk.gray("│")} ${util.inspect(meta, { colors: true, depth: 2, compact: false })}`;
};

export const logger = {
  success: (msg: string, m?: string, p?: string, meta?: any) =>
    console.log(
      chalk.green(formatMessage("SUCCESS", msg, m, p)) + formatMeta(meta),
    ),

  error: (msg: string, m?: string, p?: string, meta?: any) =>
    console.error(
      chalk.red(formatMessage("ERROR", msg, m, p)) + formatMeta(meta),
    ),

  warn: (msg: string, m?: string, p?: string, meta?: any) =>
    console.warn(
      chalk.yellow(formatMessage("WARN", msg, m, p)) + formatMeta(meta),
    ),

  info: (msg: string, m?: string, p?: string, meta?: any) =>
    console.log(
      chalk.cyan(formatMessage("INFO", msg, m, p)) + formatMeta(meta),
    ),

  debug: (msg: string, m?: string, p?: string, meta?: any) =>
    console.log(
      chalk.magenta(formatMessage("DEBUG", msg, m, p)) + formatMeta(meta),
    ),
};

export const simpleLogger = {
  success: (msg: string, meta?: any) =>
    console.log(chalk.green(msg) + formatMeta(meta)),

  error: (msg: string, meta?: any) =>
    console.error(chalk.red(msg) + formatMeta(meta)),

  warn: (msg: string, meta?: any) =>
    console.warn(chalk.yellow(msg) + formatMeta(meta)),

  info: (msg: string, meta?: any) =>
    console.log(chalk.cyan(msg) + formatMeta(meta)),

  debug: (msg: string, meta?: any) =>
    console.log(chalk.magenta(msg) + formatMeta(meta)),
};

const getLocalIp = (): string => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;
    for (const alias of iface) {
      if (alias.family === "IPv4" && !alias.internal) return alias.address;
    }
  }
  return "127.0.0.1";
};

const PORT = config.server.port;

export const startUpLogger = (duration: string) => {
  const localIp = getLocalIp();

  simpleLogger.info(`Starting Project...\n`);
  simpleLogger.info(`- Project Name   : ${config.projectName || "N/A"}`);
  simpleLogger.info(`- Local URL      : http://localhost:${PORT}`);
  simpleLogger.info(`- Server URL     : http://${localIp}:${PORT}`);
  simpleLogger.success(`- Server Status  : ONLINE`);
  simpleLogger.info(`- Environment    : ${config.server.env.toUpperCase()}`);
  simpleLogger.info(`${chalk.magenta(`- Startup Time   : ${duration}ms`)}\n`);
  simpleLogger.success(`- Project Started Successfully!\n`);
};
