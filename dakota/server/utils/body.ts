import { createError, readBody, type H3Event } from 'h3';
import type { z } from 'zod';

export async function readValidatedBodyZ<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T,
): Promise<z.infer<T>> {
  const raw = await readBody(event);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: parsed.error.flatten(),
    });
  }
  return parsed.data;
}
