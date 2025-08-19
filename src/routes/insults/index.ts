import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createInsult } from './create';
import { listAllInsults } from './list';
import { deleteInsult } from './delete';

export async function insultRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();
  typedApp.register(createInsult);
  typedApp.register(listAllInsults);
  typedApp.register(deleteInsult);
}
