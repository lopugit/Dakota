import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Avatar, Badge, BalanceMeter, Button, Card, Icon, Input, Tag, type BadgeTone } from '@/components';
import {
  useCatalog,
  useHorses,
  useLog,
  useLogSession,
  useProfile,
  useSharePost,
} from '@/lib/queries';
import { todayKey } from '@/lib/day';
import { hhmm, signed, valColor, valNote } from '@shared/derive';
import type { Exercise, LogSession } from '@shared/types';

const mono = { fontFamily: 'var(--font-mono)' } as const;

/** Level → badge tone, matching the Arena list. */
const LEVEL_TONE: Record<string, BadgeTone> = {
  Intro: 'green',
  Novice: 'throat',
  Elementary: 'solar',
  Medium: 'sacral',
  Advanced: 'root',
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '11px 0',
  borderTop: '1px solid var(--border-subtle)',
} as const;

/** Arena letter positions, nudged just inside the wall so they don't clip. */
function arenaLetters(arena: '20x40' | '20x60'): Array<[string, number, number]> {
  if (arena === '20x40') {
    return [
      ['A', 100, 390], ['C', 100, 16],
      ['K', 12, 360], ['E', 12, 200], ['H', 12, 40],
      ['F', 188, 360], ['B', 188, 200], ['M', 188, 40],
    ];
  }
  return [
    ['A', 100, 590], ['C', 100, 16],
    ['K', 12, 540], ['V', 12, 420], ['E', 12, 300], ['S', 12, 180], ['H', 12, 60],
    ['F', 188, 540], ['P', 188, 420], ['B', 188, 300], ['R', 188, 180], ['M', 188, 60],
  ];
}

function pathStart(d: string): [number, number] {
  const nums = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  return [nums[0] ?? 100, nums[1] ?? 200];
}

function ArenaDiagram({ ex }: { ex: Exercise }) {
  if (ex.arena === 'none') return null;
  const long = ex.arena === '20x60';
  const h = long ? 600 : 400;
  const letters = arenaLetters(ex.arena);
  // Centre line runs D → G (the K/F line to the H/M line).
  const dY = long ? 540 : 360;
  const gY = long ? 60 : 40;
  const [sx, sy] = pathStart((ex.paths ?? [''])[0]);
  return (
    <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <span className="dk-kicker" style={{ alignSelf: 'flex-start' }}>
        The route
      </span>
      <svg
        width="100%"
        style={{ maxWidth: 300, height: 'auto', display: 'block' }}
        viewBox={`0 0 200 ${h}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Route diagram"
      >
        <title>Route diagram</title>
        <defs>
          <marker
            id="dk-route-arrow"
            markerUnits="userSpaceOnUse"
            markerWidth="12"
            markerHeight="12"
            refX="9"
            refY="5"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="var(--accent-strong)" />
          </marker>
        </defs>
        <rect
          x="3"
          y="3"
          width="194"
          height={h - 6}
          rx="14"
          fill="var(--surface-sunken)"
          stroke="var(--border-strong)"
          strokeWidth="3"
        />
        <line
          x1="100"
          y1={dY}
          x2="100"
          y2={gY}
          stroke="var(--border-subtle)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        {letters.map(([l, x, y]) => (
          <text
            key={l}
            x={x}
            y={y}
            textAnchor="middle"
            fontSize="13"
            fontFamily="var(--font-mono)"
            fill="var(--text-faint)"
          >
            {l}
          </text>
        ))}
        {(ex.paths ?? []).map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--accent-strong)"
            strokeWidth="3.5"
            strokeLinecap="round"
            markerEnd="url(#dk-route-arrow)"
          />
        ))}
        {(ex.paths?.length ?? 0) > 0 && <circle cx={sx} cy={sy} r="6" fill="var(--accent-strong)" />}
      </svg>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)', alignSelf: 'flex-start' }}>
        Ridden as drawn — the dot marks where the figure begins.
      </p>
    </Card>
  );
}

function fmtDateShort(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function ExerciseDetailScreen() {
  const { id } = useParams();
  const { data: catalog } = useCatalog();
  const { data: horses } = useHorses();
  const { data: log } = useLog();
  const { data: profile } = useProfile();
  const logSession = useLogSession();
  const sharePost = useSharePost(profile?.name ?? '');

  const ex = (catalog?.exercises ?? []).find((e) => e.id === id);

  const [horseId, setHorseId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [minsStr, setMinsStr] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [logged, setLogged] = useState(false);
  const [shared, setShared] = useState(false);

  const herd = horses ?? [];
  const selHorse = horseId ?? herd[0]?.id ?? '';
  const minsValue = minsStr ?? String(ex?.mins ?? '');

  const save = () => {
    if (!ex || !selHorse) return;
    logSession.mutate({
      date: todayKey(),
      ex: ex.id,
      horse: selHorse,
      t: hhmm(new Date()),
      mins: Number(minsValue) > 0 ? Math.round(Number(minsValue)) : ex.mins,
      score,
      note: note.trim(),
    });
    setLogged(true);
  };

  const logAnother = () => {
    setScore(0);
    setMinsStr(null);
    setNote('');
    setLogged(false);
  };

  const share = () => {
    if (!ex) return;
    sharePost.mutate({ text: 'Schooled ' + ex.n + ' today.', ex: ex.id });
    setShared(true);
  };

  // Past attempts of this exercise, newest first.
  const horseName = new Map(herd.map((h) => [h.id, h.name]));
  const attempts: Array<{ date: string; s: LogSession }> = [];
  for (const key of Object.keys(log ?? {}).sort().reverse()) {
    for (const s of (log?.[key]?.sessions ?? []).filter((s) => s.ex === id)) {
      attempts.push({ date: key, s });
    }
    if (attempts.length >= 6) break;
  }
  const past = attempts.slice(0, 6);

  return (
    <div className="dk-screen">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link to="/arena" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← All exercises
          </Button>
        </Link>
      </div>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          {ex?.n ?? ''}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {ex && <Badge>{ex.discipline}</Badge>}
          {ex && <Badge tone={LEVEL_TONE[ex.level] ?? 'neutral'}>{ex.level}</Badge>}
        </div>
        <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)' }}>
          {ex ? `${ex.mins} min · ${ex.gaits.join(', ')}` : ''}
        </span>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {ex?.desc ?? ''}
        </p>
      </Card>

      {ex && <ArenaDiagram ex={ex} />}

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="dk-kicker" style={{ paddingBottom: 8 }}>
          What you're building
        </span>
        {(ex?.aims ?? []).map((aim, idx) => (
          <div
            key={idx}
            style={{ ...rowStyle, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}
          >
            <Icon name="check" size={16} color="var(--accent-strong)" style={{ flex: 'none', marginTop: 2 }} />
            <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-primary)' }}>{aim}</span>
          </div>
        ))}
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="dk-kicker" style={{ paddingBottom: 8 }}>
          How to ride it
        </span>
        {(ex?.steps ?? []).map((step, idx) => (
          <div key={idx} style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ ...mono, fontSize: 12, color: 'var(--text-faint)', width: 24, flex: 'none' }}>
                {idx + 1}
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-primary)', flex: 1 }}>
                {step.s}
              </span>
            </div>
            {step.note && (
              <span style={{ fontSize: 12, color: 'var(--text-faint)', paddingLeft: 32 }}>
                {step.note}
              </span>
            )}
          </div>
        ))}
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="dk-kicker" style={{ paddingBottom: 8 }}>
          Common faults
        </span>
        {(ex?.faults ?? []).map((fault, idx) => (
          <div key={idx} style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Icon name="flag" size={15} color="var(--warning)" style={{ flex: 'none', marginTop: 2 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{fault.f}</span>
            </div>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)', paddingLeft: 25 }}>
              {fault.fix}
            </span>
          </div>
        ))}
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span className="dk-kicker">Ride it today</span>
        {logged ? (
          <>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
              Logged — nice work today.
            </p>
            <div>
              <Button variant="ghost" size="sm" onClick={logAnother}>
                Log another
              </Button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {herd.map((h) => (
                <Tag key={h.id} active={h.id === selHorse} onClick={() => setHorseId(h.id)}>
                  {h.name}
                </Tag>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                type="range"
                className="dk-slider"
                min={-1}
                max={1}
                step={0.05}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                aria-label="How did the horse feel"
              />
              <div
                style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}
              >
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{valNote(score)}</span>
                <span style={{ ...mono, fontSize: 13, color: valColor(score) }}>{signed(score)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Input
                type="number"
                inputMode="numeric"
                min={1}
                value={minsValue}
                onChange={(e) => setMinsStr(e.target.value)}
                aria-label="Minutes ridden"
                style={{ width: 90, flex: 'none' }}
              />
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What improved, what needs work"
                aria-label="Session note"
                style={{ flex: 1 }}
              />
            </div>
            <div>
              <Button variant="primary" onClick={save} disabled={!ex || !selHorse}>
                Save session
              </Button>
            </div>
          </>
        )}
      </Card>

      {past.length > 0 && (
        <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className="dk-kicker" style={{ paddingBottom: 8 }}>
            How it's been going
          </span>
          {past.map(({ date, s }, idx) => (
            <div key={idx} style={rowStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', width: 56, flex: 'none' }}>
                  {fmtDateShort(date)}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>
                  {horseName.get(s.horse) ?? s.horse}
                </span>
                <span style={{ ...mono, fontSize: 12, color: valColor(s.score), flex: 'none' }}>
                  {signed(s.score)}
                </span>
                <div style={{ width: 80, flex: 'none' }}>
                  <BalanceMeter value={s.score} size="sm" showLabels={false} />
                </div>
              </div>
              {s.note && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 68 }}>
                  {s.note}
                </span>
              )}
            </div>
          ))}
        </Card>
      )}

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="dk-kicker" style={{ paddingBottom: 8 }}>
          Notes from other riders
        </span>
        {(ex?.comments ?? []).map((c, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '11px 0',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Avatar initials={c.who.slice(0, 2).toUpperCase()} size={28} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{c.who}</span>
              <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                {c.t}
              </span>
            </div>
          </div>
        ))}
        <div style={{ paddingTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          {shared ? (
            <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>Shared to your feed.</span>
          ) : (
            <Button variant="ghost" size="sm" onClick={share} disabled={!ex}>
              Share to feed
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
