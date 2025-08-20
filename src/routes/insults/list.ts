import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '../../lib/prisma';
import { listInsultsResponseSchema } from '../../structures/schemas/ResponseMessage';
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
          200: listInsultsResponseSchema,
          '4xx': http4xxErrorSchema,
          '5xx': http5xxErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const insults = await db.insult.findMany({
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
