"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_cors = __toESM(require("@fastify/cors"));
var import_swagger = __toESM(require("@fastify/swagger"));
var import_fastify_type_provider_zod6 = require("fastify-type-provider-zod");
var import_jwt = require("@fastify/jwt");

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
var import_pino = __toESM(require("pino"));
var import_dayjs = __toESM(require("dayjs"));
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

// src/lib/docs.ts
var readme = `
![](/meta.jpg)

# Welcome to the API docs

These are the official docs for the [Baibusu.social](https://api.baibusu.social) project.
On the sidebar you will find all available endpoints that the API has to offer.
This documentation is intended for reference as the majority of options require administrative authorization.

The default rate limit for the API is 100 requests per 1000ms.
`;
var docs_default = {
  openapi: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Baibusu API",
      description: readme
    },
    tags: [
      {
        name: "Insults",
        description: "Insult routes."
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key"
        }
      }
    }
  }
};

// src/middlewares/auth.ts
async function auth(request, reply) {
  const apiKey = request.headers["x-api-key"];
  const knownKey = env.APIKEY;
  if (apiKey !== knownKey) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}

// src/routes/insults/index.ts
var import_fastify_type_provider_zod5 = require("fastify-type-provider-zod");

// src/routes/insults/create.ts
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");
var import_zod5 = __toESM(require("zod"));

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var db = globalThis.prisma || new import_client.PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// src/structures/schemas/ResponseMessage.ts
var import_zod2 = require("zod");
var responseMessageSchema = import_zod2.z.string().describe("A message describing the result of the request.");
var insultSchema = import_zod2.z.object({
  id: import_zod2.z.string(),
  author: import_zod2.z.string(),
  content: import_zod2.z.string()
});
var listInsultsResponseSchema = import_zod2.z.object({
  insults: import_zod2.z.array(insultSchema)
});

// src/structures/schemas/HTTP4xxError.ts
var import_zod3 = require("zod");
var http4xxErrorSchema = import_zod3.z.object({
  statusCode: import_zod3.z.number().describe("HTTP status code."),
  error: import_zod3.z.string().describe("HTTP status description."),
  message: responseMessageSchema
});

// src/structures/schemas/HTTP5xxError.ts
var import_zod4 = require("zod");
var http5xxErrorSchema = import_zod4.z.object({
  statusCode: import_zod4.z.number().describe("HTTP status code."),
  error: import_zod4.z.string().describe("HTTP status description."),
  message: responseMessageSchema
});

// src/routes/insults/create.ts
async function createInsult(app2) {
  app2.withTypeProvider().post(
    "/insults",
    {
      schema: {
        summary: "Create",
        description: "Create a new insult used by the discord bot.",
        tags: ["Insults"],
        body: import_zod5.default.object({
          author: import_zod5.default.string().max(50).describe("The author of the insult"),
          content: import_zod5.default.string().max(500).describe("The content of the insult")
        }),
        response: {
          200: import_zod5.default.object({
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

// src/routes/insults/list.ts
var import_fastify_type_provider_zod2 = require("fastify-type-provider-zod");
var import_zod6 = require("zod");
async function listAllInsults(app2) {
  app2.withTypeProvider().get(
    "/insults",
    {
      schema: {
        summary: "List",
        description: "Lists all available insults",
        tags: ["Insults"],
        response: {
          200: listInsultsResponseSchema,
          "4xx": http4xxErrorSchema,
          "5xx": http5xxErrorSchema
        }
      }
    },
    async (request, reply) => {
      const insults = await db.insult.findMany({
        select: {
          id: true,
          author: true,
          content: true
        }
      });
      return reply.send({ insults });
    }
  );
}

// src/routes/insults/delete.ts
var import_fastify_type_provider_zod3 = require("fastify-type-provider-zod");
var import_zod7 = __toESM(require("zod"));
async function deleteInsult(app2) {
  app2.withTypeProvider().delete(
    "/insults/:uuid",
    {
      schema: {
        summary: "Delete",
        description: "Delete insult based on uuid",
        tags: ["Insults"],
        params: import_zod7.default.object({
          uuid: import_zod7.default.string().uuid()
        }),
        response: {
          200: import_zod7.default.object({
            message: responseMessageSchema
          }),
          "4xx": http4xxErrorSchema,
          "5xx": http5xxErrorSchema
        }
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

// src/routes/insults/random.ts
var import_fastify_type_provider_zod4 = require("fastify-type-provider-zod");
var import_zod8 = require("zod");
async function randomInsults(app2) {
  app2.withTypeProvider().get(
    "/insults/random",
    {
      schema: {
        summary: "Random",
        description: "Get's you a random insult.",
        tags: ["Insults"],
        response: {
          "4xx": http4xxErrorSchema,
          "5xx": http5xxErrorSchema
        }
      }
    },
    async (request, reply) => {
      const count = await db.insult.count();
      const skip = Math.floor(Math.random() * count);
      const insults = await db.insult.findFirst({
        skip,
        select: {
          id: true,
          author: true,
          content: true
        }
      });
      return reply.send({ insults });
    }
  );
}

// src/routes/insults/index.ts
async function insultRoutes(app2) {
  const typedApp = app2.withTypeProvider();
  typedApp.register(createInsult);
  typedApp.register(listAllInsults);
  typedApp.register(deleteInsult);
  typedApp.register(randomInsults);
}

// src/app.ts
var app = (0, import_fastify.default)({
  requestTimeout: 6e5
});
app.register(import_cors.default, {
  origin: "*"
});
app.register(import_swagger.default, { ...docs_default, transform: import_fastify_type_provider_zod6.jsonSchemaTransform, security: [{ ApiKeyAuth: [] }] });
app.setValidatorCompiler(import_fastify_type_provider_zod6.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod6.serializerCompiler);
app.get("/healthcheck", (req, res) => {
  res.send({ message: "Success" });
});
app.register(async (app2) => {
  app2.addHook("preHandler", auth);
  await app2.register(insultRoutes);
});
var start = async () => {
  await app.register(import("@scalar/fastify-api-reference"), {
    routePrefix: "/docs",
    configuration: {
      spec: {
        content: () => app.swagger()
      }
    }
  });
  await app.listen({ port: env.PORT, host: "0.0.0.0" }, function(err, address) {
    if (err) {
      logger_default.error(err);
      process.exit(1);
    }
    logger_default.info(`Baibusu listening on port: ${address}`);
  });
};
start();
