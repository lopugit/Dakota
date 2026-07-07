import { Link, useNavigate, useParams } from 'react-router';
import { Avatar, Badge, BalanceMeter, Button, Card } from '@/components';
import { useCatalog, useLogMeal } from '@/lib/queries';
import { todayKey } from '@/lib/day';
import { hhmm, signed, valNote } from '@shared/derive';

const mono = { fontFamily: 'var(--font-mono)' } as const;

export function MealDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: catalog } = useCatalog();
  const logMeal = useLogMeal();

  const meal = (catalog?.meals ?? []).find((m) => m.id === id);
  const netEffect = meal ? meal.process.reduce((a, p) => a + p.e, 0) : 0;

  const logThis = () => {
    if (!meal) return;
    logMeal.mutate({ date: todayKey(), id: meal.id, t: hhmm(new Date()) });
    navigate('/');
  };

  const ingRow = (i: NonNullable<typeof meal>['ingredients'][number], key: number) => {
    const inner = (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>
            {i.n}
          </span>
          <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)' }}>{i.amt}</span>
          <div style={{ width: 100, flex: 'none' }}>
            <BalanceMeter value={i.yy} size="sm" showLabels={false} />
          </div>
        </div>
        {i.note && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{i.note}</span>}
      </>
    );
    const style = {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      padding: '11px 0',
      borderTop: '1px solid var(--border-subtle)',
      textDecoration: 'none',
      color: 'inherit',
      width: '100%',
      boxSizing: 'border-box',
    } as const;
    return i.ref ? (
      <Link key={key} to={`/foods/${i.ref}`} className="mb-row mb-hoverable" style={style}>
        {inner}
      </Link>
    ) : (
      <div key={key} style={style}>
        {inner}
      </div>
    );
  };

  return (
    <div className="mb-screen">
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
      >
        <Link to="/foods" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← All foods
          </Button>
        </Link>
        <Button variant="primary" size="sm" onClick={logThis}>
          Log this meal today
        </Button>
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
            {meal?.n ?? ''}
          </span>
          {meal && <Badge>{meal.time}</Badge>}
          {meal && <Badge>{meal.season}</Badge>}
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {meal?.desc ?? ''}
        </p>
        <div
          style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}
        >
          <span className="mb-kicker">Whole-meal balance</span>
          <span style={{ ...mono, fontSize: 13, color: 'var(--text-secondary)' }}>
            {meal ? signed(meal.yy) : ''}
          </span>
        </div>
        <BalanceMeter value={meal?.yy ?? 0} label={meal ? valNote(meal.yy) : undefined} />
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="mb-kicker" style={{ paddingBottom: 8 }}>
          Ingredients
        </span>
        {(meal?.ingredients ?? []).map((i, idx) => ingRow(i, idx))}
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="mb-kicker" style={{ paddingBottom: 8 }}>
          Process and order
        </span>
        {(meal?.process ?? []).map((p, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              padding: '11px 0',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ ...mono, fontSize: 12, color: 'var(--text-faint)', width: 16, flex: 'none' }}>
                {idx + 1}
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{p.s}</span>
              <span style={{ ...mono, fontSize: 12, color: 'var(--text-secondary)', flex: 'none' }}>
                {signed(p.e)}
              </span>
            </div>
            {p.note && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 28 }}>
                {p.note}
              </span>
            )}
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
            padding: '12px 0 2px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>Net effect of preparation</span>
          <span style={{ ...mono, fontSize: 13 }}>{meal ? signed(netEffect) : ''}</span>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-faint)' }}>
          The same shopping list cooked differently lands in a different place — the pot decides.
        </p>
      </Card>

      {(meal?.comments.length ?? 0) > 0 && (
        <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className="mb-kicker" style={{ paddingBottom: 8 }}>
            Notes from cooks
          </span>
          {(meal?.comments ?? []).map((c, idx) => (
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
        </Card>
      )}
    </div>
  );
}
