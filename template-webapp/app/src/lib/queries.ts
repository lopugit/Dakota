// TanStack Query hooks. Every mutation is optimistic so interactions feel as
// instant as the prototype; errors roll back and refetch.
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import type { DayLog, FeedPost, Profile, UserLog } from '@shared/types';
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

const EMPTY_DAY: DayLog = { meals: [], checkins: [], practices: [] };

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

// ---- log mutations ----

export function useSaveCheckin() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.saveCheckin,
    onMutate: async (vars) => {
      const prev = await snapshot<UserLog>(qc, keys.log);
      patchDay(qc, vars.date, (day) => ({
        ...day,
        checkins: [...day.checkins, { t: vars.t, v: vars.v, note: vars.note }],
      }));
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<UserLog>(qc, keys.log)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.log }),
  });
}

export function useLogMeal() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.logMeal,
    onMutate: async (vars) => {
      const prev = await snapshot<UserLog>(qc, keys.log);
      patchDay(qc, vars.date, (day) => ({
        ...day,
        meals: [...day.meals, { id: vars.id, t: vars.t }],
      }));
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<UserLog>(qc, keys.log)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.log }),
  });
}

export function useMarkPractice() {
  const qc = useQueryClient();
  const gate = useSignInGate();
  return useMutation({
    mutationFn: api.markPractice,
    onMutate: async (vars) => {
      const prev = await snapshot<UserLog>(qc, keys.log);
      patchDay(qc, vars.date, (day) =>
        day.practices.includes(vars.id)
          ? day
          : { ...day, practices: [...day.practices, vars.id] },
      );
      return { prev };
    },
    onError: (e, v, c) => {
      rollback<UserLog>(qc, keys.log)(e, v, c);
      gate(e);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.log }),
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
        ...(vars.meal ? { meal: vars.meal } : {}),
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
