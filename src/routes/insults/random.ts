import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '../../lib/prisma';
import { listInsultsResponseSchema } from '../../structures/schemas/ResponseMessage';
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
          '4xx': http4xxErrorSchema,
          '5xx': http5xxErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const count = await db.insult.count();
      const skip = Math.floor(Math.random() * count);

      const insults = await db.insult.findFirst({
        skip,
        select: {
          id: true,
          author: true,
          content: true,
        },
      });

      return reply.send({ insults });
    },
  );
}
