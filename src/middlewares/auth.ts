import type { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../env';

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers['x-api-key'] as string;
  const knownKey = env.APIKEY;

  if (apiKey !== knownKey) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
}
