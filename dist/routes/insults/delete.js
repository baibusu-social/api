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

// src/routes/insults/delete.ts
var delete_exports = {};
__export(delete_exports, {
  deleteInsult: () => deleteInsult
});
module.exports = __toCommonJS(delete_exports);
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");
var import_zod = __toESM(require("zod"));

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var db = globalThis.prisma || new import_client.PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// src/routes/insults/delete.ts
async function deleteInsult(app) {
  app.withTypeProvider().delete(
    "/insults/:uuid",
    {
      schema: {
        summary: "Delete",
        description: "Delete insult based on uuid",
        tags: ["Insults"],
        params: import_zod.default.object({
          uuid: import_zod.default.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const insults = await db.insult.delete({
        where: { id: uuid }
      });
      const message = `${uuid} deleted`;
      return reply.send({ message });
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deleteInsult
});
