import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '../../lib/prisma';
import { responseMessageSchema } from '../../structures/schemas/ResponseMessage';
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
          200: z.object({
            message: responseMessageSchema,
          }),
          '4xx': http4xxErrorSchema,
          '5xx': http5xxErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { author, content } = request.body;

      const insults = await db.insult.create({
        data: {
          author,
          content,
        },
      });

      return reply.status(201).send('insult created');
    },
  );
}
