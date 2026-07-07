import { useState } from 'react';
import { Avatar, Badge, Button, Card, Icon, Tag } from '@/components';
import { useHorses, useMoveHorse, usePaddocks } from '@/lib/queries';
import type { BadgeTone } from '@/components';
import type { Grass, Paddock } from '@shared/types';

const mono = { fontFamily: 'var(--font-mono)' } as const;

const GRASS_FILL: Record<Grass, string> = {
  lush: 'var(--scale-centre-soft)',
  good: 'var(--surface-sunken)',
  short: 'var(--scale-hot1-soft)',
  'eaten down': 'var(--scale-hot2-soft)',
  resting: 'transparent',
};

// Grass reads as grass: green tones for growth, warm tones for wear.
const GRASS_TONE: Record<Grass, BadgeTone> = {
  lush: 'heart',
  good: 'success',
  short: 'solar',
  'eaten down': 'sacral',
  resting: 'neutral',
};

const GRASS_ORDER: Grass[] = ['lush', 'good', 'short', 'eaten down', 'resting'];

function fmtDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function PaddocksScreen() {
  const { data: land } = usePaddocks();
  const { data: horses } = useHorses();
  const moveHorse = useMoveHorse();
  const [moving, setMoving] = useState<string | null>(null);

  const paddocks = land?.paddocks ?? [];
  const gates = land?.gates ?? [];
  const locations = land?.horses ?? {};
  const moves = (land?.moves ?? []).slice(0, 8);
  const herd = horses ?? [];

  const horsesIn = (paddockId: string) => herd.filter((h) => locations[h.id] === paddockId);
  const paddockName = (id: string) => paddocks.find((p) => p.id === id)?.n ?? id;
  const horseName = (id: string) => herd.find((h) => h.id === id)?.name ?? id;
  const movingHorse = herd.find((h) => h.id === moving);

  const handleMoveHere = (to: string) => {
    if (!moving) return;
    moveHorse.mutate({ horse: moving, to });
    setMoving(null);
  };

  return (
    <div className="dk-screen">
      {/* ---- property map ---- */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span className="dk-kicker">The property</span>
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label="Map of the paddocks showing grass condition, gates and where each horse is"
          style={{
            width: '100%',
            maxWidth: 420,
            aspectRatio: '1 / 1',
            alignSelf: 'center',
            display: 'block',
            // Long paddock names near the boundary may extend past the
            // 0–100 grid — let them spill into the card padding, not clip.
            overflow: 'visible',
          }}
        >
          {paddocks.map((p: Paddock) => (
            <g key={p.id}>
              <polygon
                points={p.shape}
                fill={GRASS_FILL[p.grass]}
                stroke="var(--border-strong)"
                strokeWidth={0.8}
                strokeDasharray={p.grass === 'resting' ? '2 2' : undefined}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={p.label[0]}
                y={p.label[1]}
                textAnchor="middle"
                style={{ fontSize: 4, fontWeight: 600, fill: 'var(--text-secondary)' }}
              >
                {p.n}
              </text>
              <text
                x={p.label[0]}
                y={p.label[1] + 4.5}
                textAnchor="middle"
                style={{ fontSize: 3, fill: 'var(--text-faint)' }}
              >
                {p.acres} ac
              </text>
            </g>
          ))}
          {gates.map((g) => (
            <rect
              key={g.id}
              x={g.x - 1.5}
              y={g.y - 0.8}
              width={3}
              height={1.6}
              rx={0.4}
              fill="var(--accent-strong)"
            />
          ))}
          {paddocks.map((p) =>
            horsesIn(p.id).map((h, i) => {
              const cx = p.label[0] + 6 + i * 7;
              const cy = p.label[1] + 8;
              return (
                <g key={h.id}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="var(--surface-card)"
                    stroke="var(--accent-strong)"
                    strokeWidth={0.6}
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      fontSize: 3.2,
                      fontWeight: 600,
                      fill: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {h.initials}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 14px',
            justifyContent: 'center',
          }}
        >
          {GRASS_ORDER.map((g) => (
            <span
              key={g}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  flex: 'none',
                  background: GRASS_FILL[g],
                  border: g === 'resting' ? '1px dashed var(--border-strong)' : '1px solid var(--border-subtle)',
                }}
              />
              {g}
            </span>
          ))}
        </div>
      </Card>

      {/* ---- move flow + paddock rows ---- */}
      <Card style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 14 }}>
          <span className="dk-kicker">Move a horse</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {herd.map((h) => (
              <Tag
                key={h.id}
                active={moving === h.id}
                onClick={() => setMoving(moving === h.id ? null : h.id)}
              >
                {h.name}
              </Tag>
            ))}
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>
            {movingHorse
              ? `Pick a new paddock for ${movingHorse.name} below.`
              : 'Choose a horse, then tap the paddock they should go to.'}
          </span>
        </div>

        {paddocks.map((p) => {
          const occupants = horsesIn(p.id);
          const showMove = !!moving && locations[moving] !== p.id;
          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                minHeight: 44,
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{p.n}</span>
                  <Badge tone={GRASS_TONE[p.grass]}>{p.grass}</Badge>
                </div>
                <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>
                  {p.acres} acres · {p.water}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                {occupants.length > 0 ? (
                  <span style={{ display: 'inline-flex', gap: 4 }}>
                    {occupants.map((h) => (
                      <Avatar key={h.id} initials={h.initials} size={24} />
                    ))}
                  </span>
                ) : (
                  <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>empty</span>
                )}
                {showMove && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleMoveHere(p.id)}
                    aria-label={`Move ${movingHorse?.name ?? 'the horse'} to ${p.n}`}
                  >
                    Move here
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </Card>

      {/* ---- rotation history ---- */}
      <Card style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
        <span className="dk-kicker" style={{ paddingBottom: 10 }}>
          Recent moves
        </span>
        {moves.length === 0 && (
          <span
            style={{
              fontSize: 13,
              color: 'var(--text-faint)',
              padding: '12px 0',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            No moves recorded yet.
          </span>
        )}
        {moves.map((m, i) => (
          <div
            key={`${m.horse}-${m.at}-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 0',
              minHeight: 44,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', width: 56, flex: 'none' }}>
              {fmtDate(m.at)}
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 500, flex: 'none' }}>{horseName(m.horse)}</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                color: 'var(--text-muted)',
                minWidth: 0,
                flexWrap: 'wrap',
              }}
            >
              <span>{m.from ? paddockName(m.from) : 'new'}</span>
              <Icon name="arrow-right" size={12} color="var(--text-faint)" />
              <span>{paddockName(m.to)}</span>
            </span>
          </div>
        ))}
      </Card>

      <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-faint)', textAlign: 'center' }}>
        Grass states are edited by your future self — rotation keeps paddocks alive.
      </p>
    </div>
  );
}
