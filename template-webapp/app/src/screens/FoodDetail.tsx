import { Link, useNavigate, useParams } from 'react-router';
import { Badge, BalanceMeter, Button, Card, Tag } from '@/components';
import { useCatalog } from '@/lib/queries';
import { signed, valNote } from '@shared/derive';

const SHOWN_METHODS = ['Raw', 'Blanched', 'Steamed', 'Sautéed', 'Long-simmered', 'Pickled'];

export function FoodDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: catalog } = useCatalog();

  const food = (catalog?.foods ?? []).find((f) => f.id === id);
  const cookRows = food
    ? (catalog?.cookMethods ?? []).filter((c) => SHOWN_METHODS.includes(c.m))
    : [];
  const inMeals = food
    ? (catalog?.meals ?? []).filter((m) => m.ingredients.some((i) => i.ref === food.id))
    : [];

  if (catalog && !food) {
    return (
      <div className="mb-screen">
        <div>
          <Link to="/foods" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" tabIndex={-1}>
              ← All foods
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-screen">
      <div>
        <Link to="/foods" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← All foods
          </Button>
        </Link>
      </div>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            {food?.n ?? ''}
          </span>
          {food && <Badge>{food.cat}</Badge>}
        </div>
        <BalanceMeter value={food?.yy ?? 0} label={food ? valNote(food.yy) : undefined} />
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {food?.note ?? ''}
        </p>
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="mb-kicker" style={{ paddingBottom: 6 }}>
          How preparation moves it
        </span>
        {cookRows.map((c) => {
          const val = Math.max(-1, Math.min(1, (food?.yy ?? 0) + c.shift));
          return (
            <div
              key={c.m}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: '12px 0',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{c.m}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {c.shift === 0 ? '±0.00' : signed(c.shift)}
                </span>
              </div>
              <BalanceMeter value={val} size="sm" showLabels={false} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.note}</span>
            </div>
          );
        })}
      </Card>

      {inMeals.length > 0 && (
        <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="mb-kicker">In meals</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {inMeals.map((m) => (
              <Tag key={m.id} onClick={() => navigate(`/meals/${m.id}`)}>
                {m.n}
              </Tag>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
