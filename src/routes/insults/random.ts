import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '../../lib/prisma';
import logger from '../../lib/logger';
import { http4xxErrorSchema } from '../../structures/schemas/HTTP4xxError';
import { http5xxErrorSchema } from '../../structures/schemas/HTTP5xxError';

export async function randomInsults(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/insults/random',
    {
      schema: {
        summary: 'Random',
        description: "Get's you a random insult.",
        tags: ['Insults'],
        response: {
          200: z.object({
            insults: z
              .object({
                id: z.string().uuid().describe('Unique identifier for the insult'),
                author: z.string().describe('The author of the insult'),
                content: z.string().describe('The content of the insult'),
              })
              .nullable()
              .describe('Random insult object, null if no insults exist'),
          }),
          404: z.object({
            statusCode: z.number(),
            error: z.string(),
            message: z.string(),
          }),
          503: z.object({
            statusCode: z.number(),
            error: z.string(),
            message: z.string(),
          }),
          '4xx': http4xxErrorSchema,
          '5xx': http5xxErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const count = await db.insult.count();

        // Handle case when no insults exist
        if (count === 0) {
          logger.warn('No insults found in database');
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'No insults available. Please add some insults first.',
          });
        }

        const skip = Math.floor(Math.random() * count);

        const insults = await db.insult.findFirst({
          skip,
          select: {
            id: true,
            author: true,
            content: true,
          },
        });

        // Handle case where findFirst returns null (shouldn't happen due to count check above)
        if (!insults) {
          logger.error('findFirst returned null despite count > 0');
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'No insult found. This might be a race condition.',
          });
        }

        logger.info(`Retrieved random insult with id: ${insults.id}`);
        return reply.send({ insults });
      } catch (error: any) {
        // Log the error for debugging
        logger.error('Failed to retrieve random insult:', error);

        // Handle database connection errors specifically
        if (error.code === 'P1001' || error.code === 'P1008' || error.code === 'P1017') {
          return reply.status(503).send({
            statusCode: 503,
            error: 'Service Unavailable',
            message: 'Database temporarily unavailable. Please try again later.',
          });
        }

        // Re-throw other errors to be handled by Fastify's error handler
        throw error;
      }
    },
  );
}
