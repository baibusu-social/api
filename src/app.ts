import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { FastifyJWT } from '@fastify/jwt';

import { env } from './env';
import logger from './lib/logger';
import Docs from './lib/docs';
import { auth } from './middlewares/auth';

// Import Routes
import { insultRoutes } from './routes/insults';

// Create the Fastify app
const app = Fastify({
  requestTimeout: 600000,
});

// Enable CORS to allow external connections to the API
app.register(cors, {
  origin: '*',
});

// Swagger documentation setup
app.register(fastifySwagger, { ...Docs, transform: jsonSchemaTransform });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Healthcheck
app.get('/healthcheck', (req, res) => {
  res.send({ message: 'Success' });
});

//app.addHook('preHandler', auth);
app.register(async (app) => {
  app.addHook('preHandler', auth);
  await app.register(insultRoutes);
});

const start = async () => {
  // Register Scalar
  await app.register(import('@scalar/fastify-api-reference'), {
    routePrefix: '/docs',
    configuration: {
      spec: {
        content: () => app.swagger(),
      },
    },
  });

  //  Start Server
  await app.listen({ port: env.PORT, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`Baibusu listening on port: ${address}`);
  });
};

start();
