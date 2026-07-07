// One horse's world — identity, care due dates, lineage, recent work, energy trend.
import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { Avatar, BalanceMeter, Button, Card, Icon } from '@/components';
import { useHorses, useLog, useLogCare, useRides, useUpdateHorse } from '@/lib/queries';
import { dateKey, todayKey, useExerciseById } from '@/lib/day';
import { fmtKm, fmtMin } from '@/lib/geo';
import {
  CARE_LABELS,
  careDue,
  dueLabel,
  handsLabel,
  hhmm,
  horseAge,
  signed,
  valColor,
} from '@shared/derive';
import type { HorseCare, LogSession } from '@shared/types';

type RoutineCareType = 'farrier' | 'worming' | 'dental' | 'vaccination';

const CARE_TYPES: RoutineCareType[] = ['farrier', 'worming', 'dental', 'vaccination'];

const CARE_ICONS: Record<RoutineCareType, string> = {
  farrier: 'horse',
  worming: 'shield-check',
  dental: 'search',
  vaccination: 'syringe',
};

const CARE_FIELDS: Record<RoutineCareType, 'lastFarrier' | 'lastWorming' | 'lastDental' | 'lastVaccination'> = {
  farrier: 'lastFarrier',
  worming: 'lastWorming',
  dental: 'lastDental',
  vaccination: 'lastVaccination',
};

function careWithDone(care: HorseCare, type: RoutineCareType): HorseCare {
  const today = todayKey();
  switch (type) {
    case 'farrier':
      return { ...care, lastFarrier: today };
    case 'worming':
      return { ...care, lastWorming: today };
    case 'dental':
      return { ...care, lastDental: today };
    case 'vaccination':
      return { ...care, lastVaccination: today };
  }
}

const parseKey = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const fmtLong = (iso: string): string =>
  parseKey(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const fmtShort = (iso: string): string =>
  parseKey(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

function dueColor(inDays: number): string {
  if (inDays < 0) return 'var(--danger)';
  if (inDays <= 7) return 'var(--warning)';
  return 'var(--text-muted)';
}

function LineageBox({ name }: { name?: string }) {
  return (
    <span
      style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 12,
        fontFamily: 'var(--font-mono)',
        color: name ? undefined : 'var(--text-faint)',
        whiteSpace: 'nowrap',
      }}
    >
      {name ?? 'Unknown'}
    </span>
  );
}

export function HorseDetailScreen() {
  const { id } = useParams();
  const { data: horses } = useHorses();
  const { data: log } = useLog();
  const { data: rides } = useRides();
  const exerciseById = useExerciseById();
  const logCare = useLogCare();
  const updateHorse = useUpdateHorse();

  const horse = (horses ?? []).find((h) => h.id === id);

  const due = useMemo(() => (horse ? careDue(horse.care, new Date()) : []), [horse]);
  const missing = horse ? CARE_TYPES.filter((t) => !horse.care[CARE_FIELDS[t]]) : [];

  const recentSessions = useMemo(() => {
    if (!log || !id) return [];
    const out: Array<{ date: string; s: LogSession }> = [];
    const keys = Object.keys(log).sort().reverse();
    for (const key of keys) {
      const day = log[key];
      for (let i = day.sessions.length - 1; i >= 0; i--) {
        if (day.sessions[i].horse === id) out.push({ date: key, s: day.sessions[i] });
      }
      if (out.length >= 5) break;
    }
    return out.slice(0, 5);
  }, [log, id]);

  const recentRides = (rides ?? []).filter((r) => r.horse === id).slice(0, 3);

  const trend = useMemo(() => {
    const now = new Date();
    const days: Array<{ key: string; avg: number | null }> = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = dateKey(d);
      const day = log?.[key];
      const vals: number[] = [];
      (day?.checkins ?? []).forEach((c) => {
        if (c.horse === id) vals.push(c.v);
      });
      (day?.sessions ?? []).forEach((s) => {
        if (s.horse === id) vals.push(s.score);
      });
      days.push({
        key,
        avg: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null,
      });
    }
    return days;
  }, [log, id]);

  const trendVals = trend.filter((d) => d.avg !== null).map((d) => d.avg as number);
  const trendMean = trendVals.length
    ? trendVals.reduce((a, b) => a + b, 0) / trendVals.length
    : null;

  const markDone = (type: RoutineCareType) => {
    if (!horse) return;
    logCare.mutate({
      date: todayKey(),
      horse: horse.id,
      type,
      t: hhmm(new Date()),
      note: '',
    });
    updateHorse.mutate({ id: horse.id, patch: { care: careWithDone(horse.care, type) } });
  };

  const back = (
    <div>
      <Link to="/horses" style={{ textDecoration: 'none' }}>
        <Button variant="ghost" size="sm" tabIndex={-1}>
          ← All horses
        </Button>
      </Link>
    </div>
  );

  if (horses && !horse) {
    return (
      <div className="dk-screen">
        {back}
        <Card style={{ padding: 20 }}>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
            This horse isn't in your paddock.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="dk-screen">
      {back}

      {/* Header */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={horse?.initials ?? ''} size={56} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
              }}
            >
              {horse?.name ?? ''}
            </span>
            {horse && (
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {horse.breed} · {horse.sex} · {horseAge(horse.born, new Date())} yo ·{' '}
                {handsLabel(horse.hands)}
                {horse.weightKg !== undefined && (
                  <>
                    {' · '}
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{horse.weightKg} kg</span>
                  </>
                )}
              </span>
            )}
            {horse && (
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {horse.color} · {horse.markings}
              </span>
            )}
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          {horse?.temperament ?? ''}
        </p>
        {(horse?.regNo || horse?.microchip) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {horse?.regNo && (
              <span
                style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}
              >
                Reg no {horse.regNo}
              </span>
            )}
            {horse?.microchip && (
              <span
                style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}
              >
                Microchip {horse.microchip}
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Care & due dates */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="dk-kicker" style={{ paddingBottom: 6 }}>
          Care &amp; due dates
        </span>
        {due.map((row) => (
          <div
            key={row.type}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              minHeight: 44,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Icon name={CARE_ICONS[row.type as RoutineCareType]} size={18} color="var(--text-muted)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{row.label}</span>
              {row.last && (
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                  last {fmtLong(row.last)}
                </span>
              )}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: dueColor(row.inDays),
                whiteSpace: 'nowrap',
              }}
            >
              {dueLabel(row.inDays)}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markDone(row.type as RoutineCareType)}
            >
              Done today
            </Button>
          </div>
        ))}
        {missing.map((type) => (
          <div
            key={type}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              minHeight: 44,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Icon name={CARE_ICONS[type]} size={18} color="var(--text-faint)" />
            <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1 }}>
              No {CARE_LABELS[type].toLowerCase()} recorded yet
            </span>
            <Button variant="secondary" size="sm" onClick={() => markDone(type)}>
              Done today
            </Button>
          </div>
        ))}
      </Card>

      {/* Lineage & ownership */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span className="dk-kicker">Lineage</span>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 14, width: 'max-content' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <LineageBox name={horse?.name} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                gap: 10,
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: 14,
              }}
            >
              <LineageBox name={horse?.sire} />
              <LineageBox name={horse?.dam} />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 6,
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: 14,
              }}
            >
              <LineageBox name={horse?.sireSire} />
              <LineageBox name={horse?.sireDam} />
              <LineageBox name={horse?.damSire} />
              <LineageBox name={horse?.damDam} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="dk-kicker" style={{ paddingBottom: 6 }}>
            Ownership
          </span>
          {(horse?.ownership ?? []).map((o, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '10px 0',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {o.from}–{o.to ?? 'now'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{o.owner}</span>
              {o.note && (
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{o.note}</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Recent work */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="dk-kicker" style={{ paddingBottom: 6 }}>
          Recent work
        </span>
        {recentSessions.length === 0 && recentRides.length === 0 && (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
            No work logged yet.
          </p>
        )}
        {recentSessions.map(({ date, s }, i) => {
          const ex = exerciseById(s.ex);
          return (
            <div
              key={date + '-' + i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: '12px 0',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fmtShort(date)}
                </span>
                <Link
                  to={`/arena/${s.ex}`}
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--accent-text)',
                    textDecoration: 'none',
                    flex: 1,
                  }}
                >
                  {ex?.n ?? 'Session'}
                </Link>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: valColor(s.score),
                  }}
                >
                  {signed(s.score)}
                </span>
              </div>
              <BalanceMeter value={s.score} size="sm" showLabels={false} />
              {s.note && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.note}</span>
              )}
            </div>
          );
        })}
        {recentRides.length > 0 && (
          <span className="dk-kicker" style={{ paddingTop: 10, paddingBottom: 2 }}>
            Recent rides
          </span>
        )}
        {recentRides.map((r) => (
          <Link
            key={r.id}
            to={`/rides/${r.id}`}
            className="dk-hoverable"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 0',
              minHeight: 44,
              borderTop: '1px solid var(--border-subtle)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Icon name="route" size={18} color="var(--text-muted)" />
            <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{r.name}</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}
            >
              {fmtKm(r.km)} · {fmtMin(r.min)}
            </span>
            <Icon name="chevron-right" size={16} color="var(--text-faint)" />
          </Link>
        ))}
      </Card>

      {/* Energy trend */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="dk-kicker">Energy trend, last 14 days</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' }}>
            {trend.map((d) => (
              <span
                key={d.key}
                title={
                  d.avg === null
                    ? `${fmtLong(d.key)} — no readings`
                    : `${fmtLong(d.key)} — ${signed(d.avg)}`
                }
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: d.avg === null ? 'var(--border-subtle)' : valColor(d.avg),
                }}
              />
            ))}
          </div>
          {trendMean !== null ? (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: valColor(trendMean),
                whiteSpace: 'nowrap',
              }}
            >
              {signed(trendMean)}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>
              No readings yet
            </span>
          )}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
          Each dot is a day's average of check-ins and session scores; the number is the
          fortnight's mean.
        </span>
      </Card>
    </div>
  );
}
