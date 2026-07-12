// TanStack Query hooks. Every mutation is optimistic so interactions feel
// instant; errors roll back and refetch.
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import type {
  DayLog, Farm, FeedPost, Horse, Paddocks, Profile, Ride, UserLog,
} from '@shared/types';
import { EMPTY_DAY, dateKey } from '@shared/derive';
import { api } from './api';
import { setSampleMode } from './sample';

/**
 * Signed-out visitors browse the live circle read-only — any write the server
 * refuses with 401 rolls back optimistically and lands on the sign-in page.
 */
function useSignInGate() {
  const navigate = useNavigate();
  return useCallback(
    (err: unknown) => {
      if (err instanceof Error && err.message.includes(': 401')) navigate('/auth');
    },
    [navigate],
  );
}

export const keys = {
  catalog: ['catalog'] as const,
  log: ['log'] as const,
  profile: ['profile'] as const,
  feed: ['feed'] as const,
  horses: ['horses'] as const,
  rides: ['rides'] as const,
  paddocks: ['paddocks'] as const,
  auth: ['auth'] as const,
};

export function useCatalog() {
  return useQuery({ queryKey: keys.catalog, queryFn: api.catalog, staleTime: Infinity });
}

export function useLog() {
  return useQuery({ queryKey: keys.log, queryFn: api.log, staleTime: 30_000 });
}

export function useProfile() {
  return useQuery({ queryKey: keys.profile, queryFn: api.profile, staleTime: 30_000 });
}

export function useFeed() {
  return useQuery({ queryKey: keys.feed, queryFn: api.feed, staleTime: 30_000 });
}

export function useHorses() {
  return useQuery({ queryKey: keys.horses, queryFn: api.horses, staleTime: 30_000 });
}

export function useRides() {
  return useQuery({ queryKey: keys.rides, queryFn: api.rides, staleTime: 30_000 });
}

export function usePaddocks() {
  return useQuery({ queryKey: keys.paddocks, queryFn: api.paddocks, staleTime: 30_000 });
}

// ---- auth ----

export function useAuth() {
  return useQuery({ queryKey: keys.auth, queryFn: api.authMe, staleTime: 60_000 });
}

/** Login/signup/logout/data-source changes swap the whole data context — refetch everything. */
function useAuthMutation<TVars, TResult>(fn: (vars: TVars) => Promise<TResult>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries(),
  });
}

export const useSignup = () => useAuthMutation(api.signup);
export const useLogin = () => useAuthMutation(api.login);
export const useLogout = () => useAuthMutation(api.logout);

export function useSetDataSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.setDataSource,
    onSuccess: (_res, dataSource) => {
      // Mirror to the device cookie so signing out keeps the same view.
      setSampleMode(dataSource === 'demo');
      qc.invalidateQueries();
    },
  });
}

// ---- optimistic helpers ----

async function snapshot<T>(qc: QueryClient, key: readonly unknown[]): Promise<T | undefined> {
  await qc.cancelQueries({ queryKey: key });
  return qc.getQueryData<T>(key as unknown[]);
}

function patchDay(qc: QueryClient, date: string, patch: (day: DayLog) => DayLog): void {
  qc.setQueryData<UserLog>(keys.log as unknown as unknown[], (old) => {
    const log = old ?? {};
    const day = log[date] ?? EMPTY_DAY;
    return { ...log, [date]: patch(day) };
  });
}

interface Ctx<T> {
  prev: T | undefined;
}

function rollback<T>(qc: QueryClient, key: readonly unknown[]) {
  return (_err: unknown, _vars: unknown, ctx: Ctx<T> | undefined) => {
    if (ctx?.prev !== undefined) qc.setQueryData(key as unknown[], ctx.prev);
  };
}

/** Shared shape for day-log mutations: optimistic patch + rollback + gate. */
function useDayMutation<TVars>(
  fn: (vars: TVars) => Promise<{ ok: true }>,
  apply: (day: DayLog, vars: TVars) => DayLog,
) {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: fn,
    onMutate: async (vars: TVars & { date: string }) => {
      const prev = await snapshot<UserLog>(qc, keys.log);
      patchDay(qc, vars.date, (day) => apply(day, vars));
      return { prev };
    },
    onError: (e: unknown, v: TVars & { date: string }, c: Ctx<UserLog> | undefined) => {
      rollback<UserLog>(qc, keys.log)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.log }),
  });
}

// ---- log mutations ----

export const useSaveCheckin = () =>
  useDayMutation(api.saveCheckin, (day, vars) => ({
    ...day,
    checkins: [...day.checkins, { horse: vars.horse, t: vars.t, v: vars.v, note: vars.note }],
  }));

export const useLogSession = () =>
  useDayMutation(api.logSession, (day, vars) => ({
    ...day,
    sessions: [
      ...day.sessions,
      { ex: vars.ex, horse: vars.horse, t: vars.t, mins: vars.mins, score: vars.score, note: vars.note },
    ],
  }));

export const useMarkPractice = () =>
  useDayMutation(api.markPractice, (day, vars) =>
    day.practices.includes(vars.id)
      ? day
      : { ...day, practices: [...day.practices, vars.id] },
  );

export const useLogCare = () =>
  useDayMutation(api.logCare, (day, vars) => ({
    ...day,
    care: [...day.care, { horse: vars.horse, type: vars.type, t: vars.t, note: vars.note }],
  }));

// ---- horses ----

export function useAddHorse() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.addHorse,
    onError: gate,
    onSettled: () => qc.invalidateQueries({ queryKey: keys.horses }),
  });
}

export function useUpdateHorse() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Omit<Horse, 'id'>> }) =>
      api.updateHorse(id, patch),
    onMutate: async ({ id, patch }) => {
      const prev = await snapshot<Horse[]>(qc, keys.horses);
      qc.setQueryData<Horse[]>(keys.horses as unknown as unknown[], (old) =>
        (old ?? []).map((h) => (h.id === id ? { ...h, ...patch, care: { ...h.care, ...patch.care } } : h)),
      );
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<Horse[]>(qc, keys.horses)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.horses }),
  });
}

// ---- rides ----

export function useSaveRide() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.saveRide,
    onMutate: async (vars) => {
      const prev = await snapshot<Ride[]>(qc, keys.rides);
      const optimistic: Ride = { id: 'optimistic-' + vars.startedAt, ...vars };
      qc.setQueryData<Ride[]>(keys.rides as unknown as unknown[], (old) => [
        optimistic,
        ...(old ?? []),
      ]);
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<Ride[]>(qc, keys.rides)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.rides }),
  });
}

// ---- farms & paddocks ----

export function useMoveHorse() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.moveHorse,
    onMutate: async (vars) => {
      const prev = await snapshot<Paddocks>(qc, keys.paddocks);
      qc.setQueryData<Paddocks>(keys.paddocks as unknown as unknown[], (old) => {
        if (!old) return old;
        return {
          farms: old.farms.map((f) => {
            const horses = { ...f.horses };
            delete horses[vars.horse];
            if (f.id !== vars.farm) return { ...f, horses };
            // The horse may be coming over from another farm — name that paddock.
            const from =
              f.horses[vars.horse] ??
              old.farms.find((x) => x.horses[vars.horse])?.horses[vars.horse] ??
              '';
            horses[vars.horse] = vars.to;
            return {
              ...f,
              horses,
              moves: [
                { horse: vars.horse, from, to: vars.to, at: dateKey(new Date()) },
                ...f.moves,
              ].slice(0, 200),
            };
          }),
        };
      });
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<Paddocks>(qc, keys.paddocks)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.paddocks }),
  });
}

/** Painting mutation — replaces one farm's whole layout, optimistically. */
export function useSaveFarm() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.saveFarm,
    onMutate: async (farm: Farm) => {
      const prev = await snapshot<Paddocks>(qc, keys.paddocks);
      qc.setQueryData<Paddocks>(keys.paddocks as unknown as unknown[], (old) => {
        if (!old) return old;
        return { farms: old.farms.map((f) => (f.id === farm.id ? farm : f)) };
      });
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<Paddocks>(qc, keys.paddocks)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.paddocks }),
  });
}

export function useAddFarm() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.addFarm,
    // Land the created farm in the cache immediately so callers can switch to
    // it before the refetch settles.
    onSuccess: (farm: Farm) => {
      qc.setQueryData<Paddocks>(keys.paddocks as unknown as unknown[], (old) =>
        old && !old.farms.some((f) => f.id === farm.id)
          ? { farms: [...old.farms, farm] }
          : old,
      );
    },
    onError: gate,
    onSettled: () => qc.invalidateQueries({ queryKey: keys.paddocks }),
  });
}

export function useDeleteFarm() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.deleteFarm,
    onMutate: async (vars: { id: string }) => {
      const prev = await snapshot<Paddocks>(qc, keys.paddocks);
      qc.setQueryData<Paddocks>(keys.paddocks as unknown as unknown[], (old) => {
        if (!old) return old;
        return { farms: old.farms.filter((f) => f.id !== vars.id) };
      });
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<Paddocks>(qc, keys.paddocks)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.paddocks }),
  });
}

// ---- feed mutations ----

export function useToggleLike() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.setLike,
    onMutate: async (vars) => {
      const prev = await snapshot<FeedPost[]>(qc, keys.feed);
      qc.setQueryData<FeedPost[]>(keys.feed as unknown as unknown[], (old) =>
        (old ?? []).map((p) => (p.id === vars.postId ? { ...p, liked: vars.liked } : p)),
      );
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<FeedPost[]>(qc, keys.feed)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.feed }),
  });
}

export function useAddComment(displayName: string) {
  const qc = useQueryClient();
  const gate = useSignInGate();
  const who = (displayName || 'You').trim();
  return useMutation({
    mutationFn: api.addComment,
    onMutate: async (vars) => {
      const prev = await snapshot<FeedPost[]>(qc, keys.feed);
      qc.setQueryData<FeedPost[]>(keys.feed as unknown as unknown[], (old) =>
        (old ?? []).map((p) =>
          p.id === vars.postId ? { ...p, comments: [...p.comments, { who, t: vars.t }] } : p,
        ),
      );
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<FeedPost[]>(qc, keys.feed)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.feed }),
  });
}

export function useSharePost(displayName: string) {
  const qc = useQueryClient();
  const gate = useSignInGate();
  const who = (displayName || 'You').trim();
  return useMutation({
    mutationFn: api.sharePost,
    onMutate: async (vars) => {
      const prev = await snapshot<FeedPost[]>(qc, keys.feed);
      const optimistic: FeedPost = {
        id: 'optimistic-' + Math.random().toString(36).slice(2),
        who,
        initials: who.slice(0, 2).toUpperCase(),
        time: 'Now',
        text: vars.text,
        ...(vars.ex ? { ex: vars.ex } : {}),
        ...(vars.ride ? { ride: vars.ride } : {}),
        likes: 0,
        comments: [],
        liked: false,
      };
      qc.setQueryData<FeedPost[]>(keys.feed as unknown as unknown[], (old) => [
        optimistic,
        ...(old ?? []),
      ]);
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<FeedPost[]>(qc, keys.feed)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.feed }),
  });
}

// ---- profile mutations ----

export function useUpdateProfile() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.updateProfile,
    onMutate: async (patch) => {
      const prev = await snapshot<Profile>(qc, keys.profile);
      if (prev) qc.setQueryData<Profile>(keys.profile as unknown as unknown[], { ...prev, ...patch });
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<Profile>(qc, keys.profile)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.profile }),
  });
}

export function useCompleteLesson() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.completeLesson,
    onMutate: async (lessonId) => {
      const prev = await snapshot<Profile>(qc, keys.profile);
      if (prev) {
        qc.setQueryData<Profile>(keys.profile as unknown as unknown[], {
          ...prev,
          lessonsDone: { ...prev.lessonsDone, [lessonId]: true },
        });
      }
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<Profile>(qc, keys.profile)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.profile }),
  });
}
