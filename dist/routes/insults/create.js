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

// src/routes/insults/create.ts
var create_exports = {};
__export(create_exports, {
  createInsult: () => createInsult
});
module.exports = __toCommonJS(create_exports);
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");
var import_zod4 = __toESM(require("zod"));

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var db = globalThis.prisma || new import_client.PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// src/structures/schemas/ResponseMessage.ts
var import_zod = require("zod");
var responseMessageSchema = import_zod.z.string().describe("A message describing the result of the request.");
var insultSchema = import_zod.z.object({
  id: import_zod.z.string(),
  author: import_zod.z.string(),
  content: import_zod.z.string()
});
var listInsultsResponseSchema = import_zod.z.object({
  insults: import_zod.z.array(insultSchema)
});

// src/structures/schemas/HTTP4xxError.ts
var import_zod2 = require("zod");
var http4xxErrorSchema = import_zod2.z.object({
  statusCode: import_zod2.z.number().describe("HTTP status code."),
  error: import_zod2.z.string().describe("HTTP status description."),
  message: responseMessageSchema
});

// src/structures/schemas/HTTP5xxError.ts
var import_zod3 = require("zod");
var http5xxErrorSchema = import_zod3.z.object({
  statusCode: import_zod3.z.number().describe("HTTP status code."),
  error: import_zod3.z.string().describe("HTTP status description."),
  message: responseMessageSchema
});

// src/routes/insults/create.ts
async function createInsult(app) {
  app.withTypeProvider().post(
    "/insults",
    {
      schema: {
        summary: "Create",
        description: "Create a new insult used by the discord bot.",
        tags: ["Insults"],
        body: import_zod4.default.object({
          author: import_zod4.default.string().max(50).describe("The author of the insult"),
          content: import_zod4.default.string().max(500).describe("The content of the insult")
        }),
        response: {
          200: import_zod4.default.object({
            message: responseMessageSchema
          }),
          "4xx": http4xxErrorSchema,
          "5xx": http5xxErrorSchema
        }
      }
    },
    async (request, reply) => {
      const { author, content } = request.body;
      const insults = await db.insult.create({
        data: {
          author,
          content
        }
      });
      return reply.status(201).send("insult created");
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createInsult
});
