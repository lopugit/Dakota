import { Link } from 'react-router';
import { BalanceMeter, Card, Icon, Input, Tag } from '@/components';
import { useCatalog } from '@/lib/queries';
import { useSticky } from '@/lib/useSticky';

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '12px 0',
  borderTop: '1px solid var(--border-subtle)',
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
} as const;

export function FeedRoomScreen() {
  const { data: catalog } = useCatalog();
  const [q, setQ] = useSticky('feedroom.q', '');
  const [cat, setCat] = useSticky('feedroom.cat', 'All');

  const ql = q.trim().toLowerCase();
  const matches = (s: string) => !ql || s.toLowerCase().includes(ql);

  const chips = ['All', ...(catalog?.feedCats ?? [])];
  const rows = (catalog?.feeds ?? []).filter(
    (f) => (cat === 'All' || f.cat === cat) && matches(f.n),
  );
  const noResults = !!catalog && rows.length === 0;

  return (
    <div className="dk-screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Card
          style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}
        >
          <Icon name="wheat" size={18} color="var(--text-muted)" style={{ flex: 'none', marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-muted)' }}>
            Every feed sits somewhere between cooling and heating. Hot horses calm down when the
            fizz comes out of the bin; flat horses often need more energy, not more leg.
          </p>
        </Card>

        <Input
          placeholder="Search the feed room"
          aria-label="Search the feed room"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((c) => (
            <Tag key={c} active={c === cat} onClick={() => setCat(c)}>
              {c}
            </Tag>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="dk-kicker">Feeds · {rows.length}</span>
          {noResults ? (
            <Card style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                {ql ? `Nothing here for “${q.trim()}”` : 'Nothing in this bin yet'}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Try another spelling or a broader word — the feed room grows with every release.
              </span>
            </Card>
          ) : (
            <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
              {rows.map((f) => (
                <Link
                  key={f.id}
                  to={`/feedroom/${f.id}`}
                  className="dk-row dk-hoverable"
                  style={rowStyle}
                >
                  <div
                    style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {f.n}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{f.cat}</span>
                  </div>
                  <div style={{ width: 90, flex: 'none' }}>
                    <BalanceMeter value={f.heat} size="sm" showLabels={false} />
                  </div>
                  <Icon name="chevron-right" size={16} color="var(--text-faint)" />
                </Link>
              ))}
            </Card>
          )}
        </div>

        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>
          Left is cooling · right is heating · centre is steady
        </p>
      </div>
    </div>
  );
}
