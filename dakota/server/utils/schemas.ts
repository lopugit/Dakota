import { z } from 'zod';

export const dateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');
export const hhmmSchema = z.string().regex(/^\d{2}:\d{2}$/, 'expected HH:MM');
const idSchema = z.string().min(1).max(100);

// ---- diary log ----

export const checkinBody = z.object({
  date: dateKeySchema,
  horse: idSchema,
  t: hhmmSchema,
  v: z.number().min(-1).max(1),
  note: z.string().max(500).default(''),
});

export const logSessionBody = z.object({
  date: dateKeySchema,
  ex: idSchema,
  horse: idSchema,
  t: hhmmSchema,
  mins: z.number().int().min(1).max(600),
  score: z.number().min(-1).max(1),
  note: z.string().max(1000).default(''),
});

export const logPracticeBody = z.object({
  date: dateKeySchema,
  id: idSchema,
});

export const careTypeSchema = z.enum([
  'farrier', 'vet', 'worming', 'vaccination', 'dental', 'physio', 'other',
]);

export const logCareBody = z.object({
  date: dateKeySchema,
  horse: idSchema,
  type: careTypeSchema,
  t: hhmmSchema,
  note: z.string().max(1000).default(''),
});

// ---- horses ----

const ownershipEntry = z.object({
  owner: z.string().trim().min(1).max(120),
  from: z.string().max(10),
  to: z.string().max(10).optional(),
  note: z.string().max(300).optional(),
});

const horseCareSchema = z.object({
  farrierWeeks: z.number().int().min(1).max(52),
  wormingWeeks: z.number().int().min(1).max(52),
  dentalMonths: z.number().int().min(1).max(36),
  vaccinationMonths: z.number().int().min(1).max(36),
  lastFarrier: dateKeySchema.optional(),
  lastWorming: dateKeySchema.optional(),
  lastDental: dateKeySchema.optional(),
  lastVaccination: dateKeySchema.optional(),
});

export const horseBody = z.object({
  name: z.string().trim().min(1).max(80),
  breed: z.string().trim().max(80).default(''),
  sex: z.enum(['mare', 'gelding', 'stallion', 'filly', 'colt']),
  born: z.string().regex(/^\d{4}$/, 'expected YYYY'),
  color: z.string().max(60).default(''),
  markings: z.string().max(200).default(''),
  hands: z.number().min(5).max(20),
  weightKg: z.number().min(50).max(1500).optional(),
  initials: z.string().trim().min(1).max(3),
  temperament: z.string().max(500).default(''),
  sire: z.string().max(80).optional(),
  dam: z.string().max(80).optional(),
  sireSire: z.string().max(80).optional(),
  sireDam: z.string().max(80).optional(),
  damSire: z.string().max(80).optional(),
  damDam: z.string().max(80).optional(),
  regNo: z.string().max(60).optional(),
  microchip: z.string().max(60).optional(),
  ownership: z.array(ownershipEntry).max(20).default([]),
  care: horseCareSchema,
});

export const horsePatchBody = horseBody.partial();

// ---- rides ----

export const rideBody = z.object({
  horse: idSchema,
  name: z.string().trim().min(1).max(120),
  date: dateKeySchema,
  startedAt: z.number().int().min(0),
  km: z.number().min(0).max(1000),
  min: z.number().min(0).max(6000),
  avgKmh: z.number().min(0).max(100),
  maxKmh: z.number().min(0).max(120),
  note: z.string().max(1000).default(''),
  points: z
    .array(z.object({ la: z.number().min(-90).max(90), ln: z.number().min(-180).max(180), t: z.number().min(0) }))
    .max(20_000)
    .default([]),
});

// ---- paddocks ----

export const paddockMoveBody = z.object({
  horse: idSchema,
  to: idSchema,
});

// ---- feed ----

export const feedPostBody = z.object({
  text: z.string().trim().min(1).max(2000),
  ex: z.string().max(100).optional(),
  ride: z
    .object({
      name: z.string().trim().min(1).max(120),
      km: z.number().min(0).max(1000),
      min: z.number().min(0).max(6000),
    })
    .optional(),
});

export const feedLikeBody = z.object({
  postId: idSchema,
  liked: z.boolean(),
});

export const feedCommentBody = z.object({
  postId: idSchema,
  t: z.string().trim().min(1).max(1000),
});

// ---- auth & profile ----

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
  yardName: z.string().max(120).optional(),
  since: z.string().max(8).optional(),
  settings: z
    .object({
      reminders: z.boolean(),
      publicProfile: z.boolean(),
    })
    .optional(),
});

export const thingtimeAuthBody = z
  .object({
    mode: z.enum(['signin', 'signup']),
    username: z.string().trim().min(1).max(80),
    password: z.string().min(1).max(200),
    email: z.string().trim().toLowerCase().email().max(120).optional(),
    name: z.string().trim().max(80).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.mode === 'signup') {
      if (!val.email) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['email'], message: 'Email is required to create a Thingtime account' });
      }
      if (val.password.length < 8) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['password'], message: 'Password must be at least 8 characters' });
      }
    }
  });
