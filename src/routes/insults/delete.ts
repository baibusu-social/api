import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '../../lib/prisma';
import { responseMessageSchema } from '../../structures/schemas/ResponseMessage';
import { http4xxErrorSchema } from '../../structures/schemas/HTTP4xxError';
import { http5xxErrorSchema } from '../../structures/schemas/HTTP5xxError';

export async function deleteInsult(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/insults/:uuid',
    {
      schema: {
        summary: 'Delete',
        description: 'Delete insult based on uuid',
        tags: ['Insults'],
        params: z.object({
          uuid: z.string().uuid(),
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
      const { uuid } = request.params;
      const insults = await db.insult.delete({
        where: { id: uuid },
      });

      const message = `${uuid} deleted`;
      return reply.send({ message });
    },
  );
}
