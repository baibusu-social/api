import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '../../lib/prisma';
import logger from '../../lib/logger';
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
            message: z.string().describe('Success message confirming deletion'),
          }),
          404: z.object({
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
      const { uuid } = request.params;
      try {
        const insults = await db.insult.delete({
          where: { id: uuid },
        });
        const message = `Insult ${uuid} deleted successfully`;
        return reply.status(200).send({ message });
      } catch (error: any) {
        logger.error('Failed to delete insult:', error);
        // Handle record not found error
        if (error.code === 'P2025') {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Insult with id ${uuid} not found`,
          });
        }
        // Re-throw other errors
        throw error;
      }
    },
  );
}
