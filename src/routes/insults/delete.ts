import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { db } from '../../lib/prisma';

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
