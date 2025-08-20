import { z } from 'zod';

export const responseMessageSchema = z.string().describe('A message describing the result of the request.');

const insultSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string(),
});

export const listInsultsResponseSchema = z.object({
  insults: z.array(insultSchema),
});
