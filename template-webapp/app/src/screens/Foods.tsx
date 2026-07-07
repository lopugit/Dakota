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

export function FoodsScreen() {
  const { data: catalog } = useCatalog();
  const [q, setQ] = useSticky('foods.q', '');
  const [cat, setCat] = useSticky('foods.cat', 'All');

  const ql = q.trim().toLowerCase();
  const matches = (s: string) => !ql || s.toLowerCase().includes(ql);

  const chips = ['All', 'Meals', ...(catalog?.cats ?? [])];

  const mealRows =
    cat === 'All' || cat === 'Meals'
      ? (catalog?.meals ?? []).filter(
          (m) => matches(m.n) || m.ingredients.some((i) => matches(i.n)),
        )
      : [];
  const foodRows =
    cat === 'Meals'
      ? []
      : (catalog?.foods ?? []).filter((f) => (cat === 'All' || f.cat === cat) && matches(f.n));

  const noResults = !!catalog && mealRows.length === 0 && foodRows.length === 0;

  return (
    <div className="mb-screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input
          placeholder="Search foods and meals — try pumpkin soup"
          aria-label="Search foods and meals"
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

        {mealRows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="mb-kicker">Meals</span>
            <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
              {mealRows.map((m) => (
                <Link key={m.id} to={`/meals/${m.id}`} className="mb-row mb-hoverable" style={rowStyle}>
                  <div
                    style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {m.n}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {m.time} · {m.season}
                    </span>
                  </div>
                  <div style={{ width: 110, flex: 'none' }}>
                    <BalanceMeter value={m.yy} size="sm" showLabels={false} />
                  </div>
                  <Icon name="chevron-right" size={16} color="var(--text-faint)" />
                </Link>
              ))}
            </Card>
          </div>
        )}

        {foodRows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="mb-kicker">Foods</span>
            <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
              {foodRows.map((f) => (
                <Link key={f.id} to={`/foods/${f.id}`} className="mb-row mb-hoverable" style={rowStyle}>
                  <div
                    style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {f.n}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.cat}</span>
                  </div>
                  <div style={{ width: 110, flex: 'none' }}>
                    <BalanceMeter value={f.yy} size="sm" showLabels={false} />
                  </div>
                  <Icon name="chevron-right" size={16} color="var(--text-faint)" />
                </Link>
              ))}
            </Card>
          </div>
        )}

        {noResults && (
          <Card style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>Nothing here for “{q}”</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Try another spelling or a broader word — the compass grows with every release.
            </span>
          </Card>
        )}

        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>
          Left is yin 陰 · right is yang 陽 · centre is balance
        </p>
      </div>
    </div>
  );
}
