// Wisdom — paddock reference tables under one screen with sub-tabs.
import { Badge, Card, Icon, Tag } from '@/components';
import { useCatalog } from '@/lib/queries';
import { useSticky } from '@/lib/useSticky';
import type { Marking, SignalRow } from '@shared/types';

const mono = { fontFamily: 'var(--font-mono)' } as const;

const TABS = [
  { id: 'breeds', label: 'Breeds' },
  { id: 'gaits', label: 'Gaits' },
  { id: 'markings', label: 'Markings' },
  { id: 'ages', label: 'Ages' },
  { id: 'signals', label: 'Signals' },
  { id: 'condition', label: 'Condition' },
  { id: 'glossary', label: 'Glossary' },
];

const MARKING_KICKERS: Record<Marking['kind'], string> = {
  face: 'On the face',
  leg: 'On the legs',
  coat: 'Coat colors',
};

const listCard = { padding: '4px 20px', display: 'flex', flexDirection: 'column' } as const;

const noteStyle = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.55,
  color: 'var(--text-secondary)',
} as const;

const introStyle = { margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-muted)' } as const;

/** Group rows by a key, preserving first-seen order. */
function groupBy<T, K extends string>(rows: T[], key: (row: T) => K): [K, T[]][] {
  const groups = new Map<K, T[]>();
  for (const row of rows) {
    const k = key(row);
    const bucket = groups.get(k);
    if (bucket) bucket.push(row);
    else groups.set(k, [row]);
  }
  return [...groups.entries()];
}

export function WisdomScreen() {
  const { data: catalog } = useCatalog();
  const [tab, setTab] = useSticky('wisdom.tab', 'breeds');

  const markingGroups = groupBy(catalog?.markings ?? [], (m) => m.kind);
  const signalGroups = groupBy<SignalRow, string>(catalog?.signals ?? [], (s) => s.part);
  const glossary = [...(catalog?.glossary ?? [])].sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="dk-screen">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {TABS.map((t) => (
          <Tag key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </Tag>
        ))}
      </div>

      {tab === 'breeds' && (
        <Card style={listCard}>
          {(catalog?.breeds ?? []).map((b) => (
            <div
              key={b.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                padding: '12px 0',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>{b.n}</span>
              <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                {b.origin} · {b.height}
              </span>
              <span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                {b.temperament}
              </span>
              <p style={noteStyle}>{b.note}</p>
            </div>
          ))}
        </Card>
      )}

      {tab === 'gaits' && (
        <Card style={listCard}>
          {(catalog?.gaits ?? []).map((g) => (
            <div
              key={g.n}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                padding: '12px 0',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{g.n}</span>
                <Badge>{g.beats}</Badge>
                <span
                  style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}
                >
                  {g.speed}
                </span>
              </div>
              <p style={noteStyle}>{g.note}</p>
            </div>
          ))}
        </Card>
      )}

      {tab === 'markings' &&
        markingGroups.map(([kind, rows]) => (
          <div key={kind} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="dk-kicker">{MARKING_KICKERS[kind]}</span>
            <Card style={listCard}>
              {rows.map((m) => (
                <div
                  key={m.n}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: '11px 0',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.n}</span>
                  <p style={noteStyle}>{m.note}</p>
                </div>
              ))}
            </Card>
          </div>
        ))}

      {tab === 'ages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={introStyle}>Rough equivalences — ponies age slower, hard lives age faster.</p>
          <Card style={listCard}>
            {(catalog?.ages ?? []).map((a) => (
              <div
                key={a.horse}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  padding: '11px 0',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ ...mono, fontSize: 13, width: 64, flex: 'none' }}>
                    {a.horse} yo
                  </span>
                  <Icon name="arrow-right" size={14} color="var(--text-faint)" />
                  <span style={{ ...mono, fontSize: 13 }}>≈ {a.human} human years</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{a.stage}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === 'signals' &&
        signalGroups.map(([part, rows]) => (
          <div key={part} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="dk-kicker">{part}</span>
            <Card style={listCard}>
              {rows.map((s) => (
                <div
                  key={s.signal}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: '11px 0',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.signal}</span>
                  <p style={noteStyle}>{s.meaning}</p>
                </div>
              ))}
            </Card>
          </div>
        ))}

      {tab === 'condition' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={introStyle}>Body condition scoring, 0–5. Three is the working ideal.</p>
          <Card style={listCard}>
            {(catalog?.condition ?? []).map((c) => (
              <div
                key={c.score}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '12px 0',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{
                    ...mono,
                    width: 28,
                    height: 28,
                    flex: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: 13,
                    background: c.score === 3 ? 'var(--accent-tint)' : 'var(--surface-sunken)',
                    color: c.score === 3 ? 'var(--accent-text)' : 'var(--text-secondary)',
                  }}
                >
                  {c.score}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{c.label}</span>
                  <p style={noteStyle}>{c.note}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab === 'glossary' && (
        <Card style={listCard}>
          {glossary.map((g) => (
            <div
              key={g.term}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: '11px 0',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>{g.term}</span>
              <p style={noteStyle}>{g.def}</p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
