import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '../../lib/prisma';
import logger from '../../lib/logger';
import { http4xxErrorSchema } from '../../structures/schemas/HTTP4xxError';
import { http5xxErrorSchema } from '../../structures/schemas/HTTP5xxError';

export async function createInsult(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/insults',
    {
      schema: {
        summary: 'Create',
        description: 'Create a new insult used by the discord bot.',
        tags: ['Insults'],
        body: z.object({
          author: z.string().max(50).describe('The author of the insult'),
          content: z.string().max(500).describe('The content of the insult'),
        }),
        response: {
          201: z.object({
            id: z.string().uuid().describe('Unique identifier for the insult'),
            author: z.string().describe('The author of the insult'),
            content: z.string().describe('The content of the insult'),
            createdAt: z.date().describe('When the insult was created'),
            updatedAt: z.date().describe('When the insult was last updated'),
          }),
          409: z.object({
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
      const { author, content } = request.body;

      try {
        const insults = await db.insult.create({
          data: {
            author,
            content,
          },
        });

        return reply.status(201).send(insults);
      } catch (error: any) {
        // Handle unique constraint violation
        logger.error('Creation of a duplicate insult was attempted.', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('content')) {
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            message: 'An insult with this content already exists',
          });
        }

        // Re-throw other errors
        throw error;
      }
    },
  );
}
