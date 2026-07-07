import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Badge, BalanceMeter, Button, Card, Icon, IconButton } from '@/components';
import { useCatalog, useLog } from '@/lib/queries';
import { getDay, todayKey, useDayAvg, useMealById } from '@/lib/day';
import { dateKey } from '@shared/mb-data';
import { signed, valColor, valNote } from '@shared/derive';

const mono = { fontFamily: 'var(--font-mono)' } as const;

/** Month offset (in months) from the current month to the month containing `key`. */
function monthOffsetFor(key: string, now: Date): number {
  const [y, m] = key.split('-').map(Number);
  return (y - now.getFullYear()) * 12 + (m - 1 - now.getMonth());
}

export function DiaryScreen() {
  const { data: catalog } = useCatalog();
  const { data: log } = useLog();
  const mealById = useMealById();
  const avgFor = useDayAvg();
  const [searchParams, setSearchParams] = useSearchParams();

  const now = new Date();
  const tKey = todayKey();
  const selDay = searchParams.get('d') || tKey;
  const [monthOffset, setMonthOffset] = useState(() => monthOffsetFor(selDay, now));

  const selectDay = (key: string) => setSearchParams({ d: key });

  const mBase = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthLabel = mBase.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDow = (mBase.getDay() + 6) % 7;
  const daysInMonth = new Date(mBase.getFullYear(), mBase.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((firstDow + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < cellCount; i++) {
    const d = new Date(mBase.getFullYear(), mBase.getMonth(), i - firstDow + 1);
    const k = dateKey(d);
    const avg = avgFor(k);
    cells.push({
      key: k,
      num: d.getDate(),
      inMonth: d.getMonth() === mBase.getMonth(),
      dot: avg == null ? 'transparent' : valColor(avg),
      selected: k === selDay,
      isToday: k === tKey,
    });
  }

  const selData = getDay(log, selDay);
  const selAvg = avgFor(selDay);
  const [sy, sm, sd] = selDay.split('-').map(Number);
  const selDate = new Date(sy, sm - 1, sd);
  const selPractices = selData.practices.map(
    (id) => (catalog?.practices ?? []).find((p) => p.id === id)?.n ?? id,
  );

  return (
    <div className="mb-screen">
      {/* Calendar */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
        >
          <IconButton aria-label="Previous month" onClick={() => setMonthOffset((o) => o - 1)}>
            <Icon name="chevron-left" size={18} />
          </IconButton>
          <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 20, fontWeight: 500 }}>
            {monthLabel}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMonthOffset(0);
                selectDay(tKey);
              }}
            >
              Today
            </Button>
            <IconButton aria-label="Next month" onClick={() => setMonthOffset((o) => o + 1)}>
              <Icon name="chevron-right" size={18} />
            </IconButton>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--text-faint)',
          }}
        >
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((c) => (
            <button
              key={c.key}
              type="button"
              className="mb-row mb-hoverable"
              onClick={() => selectDay(c.key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                minHeight: 48,
                padding: '4px 0',
                border: `1px solid ${c.isToday ? 'var(--focus-ring)' : 'transparent'}`,
                borderRadius: 10,
                background: c.selected ? 'var(--surface-sunken)' : 'transparent',
              }}
            >
              <span
                style={{
                  ...mono,
                  fontSize: 12,
                  color: c.inMonth ? 'var(--text-primary)' : 'var(--text-faint)',
                }}
              >
                {c.num}
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot }} />
            </button>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>
          Dot colour is the day's average — violet toward yin, red toward yang, green at centre.
        </p>
      </Card>

      {/* Day detail */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 22, fontWeight: 500 }}>
            {selDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <span style={{ ...mono, fontSize: 13, color: 'var(--text-secondary)' }}>
            {selAvg == null ? 'nothing logged' : signed(selAvg)}
          </span>
        </div>
        {selAvg != null && <BalanceMeter value={selAvg} label={valNote(selAvg)} />}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="mb-kicker" style={{ paddingBottom: 6 }}>
            Check-ins
          </span>
          {selData.checkins.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '9px 0',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', width: 44, flex: 'none' }}
              >
                {c.t}
              </span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: valColor(c.v),
                  flex: 'none',
                }}
              />
              <span style={{ ...mono, fontSize: 13, width: 48, flex: 'none' }}>{signed(c.v)}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>
                {c.note || ''}
              </span>
            </div>
          ))}
          {selData.checkins.length === 0 && (
            <p style={{ margin: '4px 0 8px', fontSize: 13, color: 'var(--text-muted)' }}>
              No check-ins this day.
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="mb-kicker" style={{ paddingBottom: 6 }}>
            Meals
          </span>
          {selData.meals.map((m, i) => {
            const meal = mealById(m.id);
            return (
              <Link
                key={i}
                to={`/meals/${m.id}`}
                className="mb-row mb-hoverable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderTop: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <span
                  style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', width: 44, flex: 'none' }}
                >
                  {m.t}
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 14 }}>{meal?.n ?? m.id}</span>
                <div style={{ width: 110, flex: 'none' }}>
                  <BalanceMeter value={meal?.yy ?? 0} size="sm" showLabels={false} />
                </div>
              </Link>
            );
          })}
          {selData.meals.length === 0 && (
            <p style={{ margin: '4px 0 8px', fontSize: 13, color: 'var(--text-muted)' }}>
              No meals logged this day.
            </p>
          )}
        </div>
        {selPractices.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="mb-kicker">Practices kept</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selPractices.map((n) => (
                <Badge key={n} tone="green">
                  {n}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
