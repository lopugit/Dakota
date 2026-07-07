import { Link } from 'react-router';
import { Badge, Card, Icon, Input, Tag, type BadgeTone } from '@/components';
import { useCatalog } from '@/lib/queries';
import { useSticky } from '@/lib/useSticky';
import type { Level } from '@shared/types';

const LEVEL_TONE: Record<Level, BadgeTone> = {
  Intro: 'green',
  Novice: 'heart',
  Elementary: 'throat',
  Medium: 'third-eye',
  Advanced: 'crown',
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '12px 0',
  minHeight: 44,
  borderTop: '1px solid var(--border-subtle)',
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
} as const;

export function ArenaScreen() {
  const { data: catalog } = useCatalog();
  const [q, setQ] = useSticky('arena.q', '');
  const [discipline, setDiscipline] = useSticky('arena.discipline', 'All');
  const [level, setLevel] = useSticky('arena.level', 'All');

  const ql = q.trim().toLowerCase();
  const matches = (s: string) => !ql || s.toLowerCase().includes(ql);

  const disciplineChips = ['All', ...(catalog?.disciplines ?? [])];
  const levelChips = ['All', ...(catalog?.levels ?? [])];

  const rows = (catalog?.exercises ?? []).filter(
    (e) =>
      (discipline === 'All' || e.discipline === discipline) &&
      (level === 'All' || e.level === level) &&
      (matches(e.n) || matches(e.desc)),
  );

  const noResults = !!catalog && rows.length === 0;

  return (
    <div className="dk-screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input
          placeholder="Search exercises — try serpentine"
          aria-label="Search exercises"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {disciplineChips.map((d) => (
            <Tag key={d} active={d === discipline} onClick={() => setDiscipline(d)}>
              {d}
            </Tag>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {levelChips.map((l) => (
            <Tag key={l} active={l === level} onClick={() => setLevel(l)}>
              {l}
            </Tag>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="dk-kicker">Exercises · {rows.length}</span>
          {noResults ? (
            <Card style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                {ql ? `Nothing here for “${q.trim()}”` : 'Nothing matches those filters'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Try another spelling, or widen the discipline and level filters.
              </span>
            </Card>
          ) : (
            <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
              {rows.map((e) => (
                <Link key={e.id} to={`/arena/${e.id}`} className="dk-row dk-hoverable" style={rowStyle}>
                  <div
                    style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {e.n}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                      {e.gaits.join(' · ')}
                    </span>
                  </div>
                  <Badge tone={LEVEL_TONE[e.level]}>{e.level}</Badge>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      flex: 'none',
                    }}
                  >
                    {e.mins} min
                  </span>
                  <Icon name="chevron-right" size={16} color="var(--text-faint)" />
                </Link>
              ))}
            </Card>
          )}
        </div>

        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>
          Diagrams are drawn for a 20 × 40 m arena unless marked
        </p>
      </div>
    </div>
  );
}
