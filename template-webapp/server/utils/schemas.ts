import { z } from 'zod';

export const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');
export const hhmmSchema = z.string().regex(/^\d{2}:\d{2}$/, 'expected HH:MM');

export const checkinBody = z.object({
  date: dateKeySchema,
  t: hhmmSchema,
  v: z.number().min(-1).max(1),
  note: z.string().max(500).default(''),
});

export const logMealBody = z.object({
  date: dateKeySchema,
  id: z.string().min(1).max(100),
  t: hhmmSchema,
});

export const logPracticeBody = z.object({
  date: dateKeySchema,
  id: z.string().min(1).max(100),
});

export const feedPostBody = z.object({
  text: z.string().trim().min(1).max(2000),
  meal: z.string().max(100).optional(),
});

export const feedLikeBody = z.object({
  postId: z.string().min(1).max(100),
  liked: z.boolean(),
});

export const feedCommentBody = z.object({
  postId: z.string().min(1).max(100),
  t: z.string().trim().min(1).max(1000),
});

export const signupBody = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  password: z.string().min(8).max(200),
  name: z.string().trim().max(80).default(''),
});

export const loginBody = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  password: z.string().min(1).max(200),
});

export const dataSourceBody = z.object({
  dataSource: z.enum(['demo', 'prod']),
});

export const profilePutBody = z.object({
  name: z.string().max(80).optional(),
  birthYear: z.string().max(8).optional(),
  settings: z
    .object({
      reminders: z.boolean(),
      publicProfile: z.boolean(),
    })
    .optional(),
});
