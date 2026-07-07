import { Link } from 'react-router';
import { Badge, Card, Icon, Input, Tag } from '@/components';
import { useCatalog } from '@/lib/queries';
import { useSticky } from '@/lib/useSticky';
import { urgencyTone } from '@shared/derive';

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

export function HealthScreen() {
  const { data: catalog } = useCatalog();
  const [q, setQ] = useSticky('health.q', '');
  const [sys, setSys] = useSticky('health.sys', 'All');

  const ql = q.trim().toLowerCase();
  const matches = (s: string) => !ql || s.toLowerCase().includes(ql);

  const systemChips = ['All', ...(catalog?.ailmentSystems ?? [])];

  const rows = (catalog?.ailments ?? []).filter(
    (a) =>
      (sys === 'All' || a.system === sys) &&
      (matches(a.n) || matches(a.signs.join(' '))),
  );

  const noResults = !!catalog && rows.length === 0;

  return (
    <div className="dk-screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input
          placeholder="Search — try laminitis"
          aria-label="Search conditions"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {systemChips.map((s) => (
            <Tag key={s} active={s === sys} onClick={() => setSys(s)}>
              {s}
            </Tag>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="dk-kicker">Conditions · {rows.length}</span>
          {noResults ? (
            <Card style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                {ql ? `Nothing here for “${q.trim()}”` : 'Nothing matches that system'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Try another spelling, a sign you can see, or widen the system filter.
              </span>
            </Card>
          ) : (
            <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
              {rows.map((a) => (
                <Link key={a.id} to={`/health/${a.id}`} className="dk-row dk-hoverable" style={rowStyle}>
                  <div
                    style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {a.n}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text-faint)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {a.signs[0]}
                    </span>
                  </div>
                  <Badge tone={urgencyTone(a.urgency)}>{a.urgency}</Badge>
                  <Icon name="chevron-right" size={16} color="var(--text-faint)" />
                </Link>
              ))}
            </Card>
          )}
        </div>

        <Card
          style={{
            padding: '14px 16px',
            background: 'var(--accent-tint)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <Icon
            name="stethoscope"
            size={18}
            color="var(--accent-text)"
            style={{ flex: 'none', marginTop: 1 }}
          />
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            This is a paddock reference, not a diagnosis. When in doubt, ring the vet — no good
            vet minds a false alarm.
          </p>
        </Card>
      </div>
    </div>
  );
}
