import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '../../lib/prisma';
import logger from '../../lib/logger';
import { http4xxErrorSchema } from '../../structures/schemas/HTTP4xxError';
import { http5xxErrorSchema } from '../../structures/schemas/HTTP5xxError';

export async function listAllInsults(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/insults',
    {
      schema: {
        summary: 'List',
        description: 'Lists all available insults',
        tags: ['Insults'],
        response: {
          200: z.object({
            insults: z
              .array(
                z.object({
                  id: z.string().uuid().describe('Unique identifier for the insult'),
                  author: z.string().describe('The author of the insult'),
                  content: z.string().describe('The content of the insult'),
                }),
              )
              .describe('Array of insults'),
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
        const insults = await db.insult.findMany({
          select: {
            id: true,
            author: true,
            content: true,
          },
        });

        logger.info(`Retrieved ${insults.length} insults`);
        return reply.send({ insults });
      } catch (error: any) {
        // Log the error for debugging
        logger.error('Failed to retrieve insults:', error);

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
