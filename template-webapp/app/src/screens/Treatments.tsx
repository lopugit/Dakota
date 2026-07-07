import { Link } from 'react-router';
import { Badge, Card, Icon, Input, Tag } from '@/components';
import { useCatalog } from '@/lib/queries';
import { useSticky } from '@/lib/useSticky';
import { patternTone } from '@shared/derive';

export function TreatmentsScreen() {
  const { data: catalog } = useCatalog();
  const [q, setQ] = useSticky('treat.q', '');
  const [sys, setSys] = useSticky('treat.sys', 'All');

  const ql = q.trim().toLowerCase();
  const rows = (catalog?.ailments ?? []).filter(
    (a) =>
      (sys === 'All' || a.system === sys) &&
      (!ql ||
        a.n.toLowerCase().includes(ql) ||
        a.signs.join(' ').toLowerCase().includes(ql)),
  );

  return (
    <div className="mb-screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input
          placeholder="Search ailments — try cold hands, bloating, sleep"
          aria-label="Search ailments"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(catalog?.ailmentSystems ?? []).map((s) => (
            <Tag key={s} active={s === sys} onClick={() => setSys(s)}>
              {s}
            </Tag>
          ))}
        </div>

        <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
          {rows.map((a) => {
            const tone = patternTone(a.pattern);
            return (
              <Link
                key={a.id}
                to={`/treatments/${a.id}`}
                className="mb-row mb-hoverable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '13px 0',
                  borderTop: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {a.n}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.system}</span>
                </div>
                <Badge tone={tone === 'neutral' ? undefined : tone}>{a.pattern}</Badge>
                <Icon name="chevron-right" size={16} color="var(--text-faint)" />
              </Link>
            );
          })}
        </Card>

        {!!catalog && rows.length === 0 && (
          <Card style={{ padding: '24px 20px' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Nothing found — try a body system or a simpler word.
            </span>
          </Card>
        )}

        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>
          Gentle kitchen support, not medical advice. Persistent or severe symptoms deserve a
          practitioner's care.
        </p>
      </div>
    </div>
  );
}
