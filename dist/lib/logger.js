"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/lib/logger.ts
var logger_exports = {};
__export(logger_exports, {
  default: () => logger_default
});
module.exports = __toCommonJS(logger_exports);
var import_pino = __toESM(require("pino"));
var import_dayjs = __toESM(require("dayjs"));

// src/env.ts
var import_zod = require("zod");
var import_dotenv = require("dotenv");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test", override: true });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: import_zod.z.string().url().min(1),
  PORT: import_zod.z.coerce.number().default(3e3),
  LOG_LEVEL: import_zod.z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  APIKEY: import_zod.z.string()
});
var env = envSchema.parse(process.env);

// src/lib/logger.ts
var logger = (0, import_pino.default)({
  name: "API",
  level: env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    }
  },
  timestamp: () => `,"time":"${(0, import_dayjs.default)().format("HH:mm")}"`,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});
var logger_default = logger;
