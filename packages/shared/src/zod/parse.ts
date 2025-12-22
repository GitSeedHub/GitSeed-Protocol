import { z } from 'zod';
import { ValidationError } from '../errors/validation.js';

export function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown, message = 'Invalid payload'): T {
  const res = schema.safeParse(input);
  if (!res.success) throw new ValidationError(message, res.error.issues);
  return res.data;
}
