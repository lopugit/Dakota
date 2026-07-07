import { useState } from 'react';
import { Link } from 'react-router';
import { BalanceMeter, Button, Card, Icon, Input } from '@/components';
import { useCatalog, useLog, useLogMeal, useMarkPractice, useSaveCheckin } from '@/lib/queries';
import { getDay, todayKey, useDayAvg, useMealById } from '@/lib/day';
import { dateKey } from '@shared/mb-data';
import { dayNote, hhmm, signed, valColor, valNote } from '@shared/derive';

const mono = { fontFamily: 'var(--font-mono)' } as const;

export function TodayScreen() {
  const { data: catalog } = useCatalog();
  const { data: log } = useLog();
  const mealById = useMealById();
  const avgFor = useDayAvg();
  const saveCheckin = useSaveCheckin();
  const logMeal = useLogMeal();
  const markPractice = useMarkPractice();

  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkinVal, setCheckinVal] = useState(0);
  const [checkinNote, setCheckinNote] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickQ, setPickQ] = useState('');

  const now = new Date();
  const tKey = todayKey();
  const today = getDay(log, tKey);
  const todayAvg = avgFor(tKey);
  const todayVal = todayAvg == null ? 0 : todayAvg;

  const pickQl = pickQ.toLowerCase();
  const pickRows = (catalog?.meals ?? []).filter(
    (m) => !pickQl || m.n.toLowerCase().includes(pickQl),
  );

  const practices = catalog?.practices ?? [];
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const practiceToday = practices.length ? practices[dayOfYear % practices.length] : null;
  const practiceDone = practiceToday ? today.practices.includes(practiceToday.id) : false;

  const weekCols = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const k = dateKey(d);
    const avg = avgFor(k);
    weekCols.push({
      key: k,
      letter: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      dot: avg == null ? 'var(--border-subtle)' : valColor(avg),
      vStr: avg == null ? '·' : signed(avg),
      isToday: i === 0,
    });
  }

  const saveNow = () => {
    saveCheckin.mutate({ date: tKey, t: hhmm(new Date()), v: checkinVal, note: checkinNote.trim() });
    setCheckinOpen(false);
    setCheckinNote('');
    setCheckinVal(0);
  };

  return (
    <div className="mb-screen">
      {/* Season banner */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
        <Icon name="sun" size={20} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>High summer — fire season</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Lighter cooking, bigger greens, gentle salt. Save the baking for autumn.
          </span>
        </div>
        <span
          style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 26, color: 'var(--text-faint)' }}
        >
          陽
        </span>
      </Card>

      {/* Balance today */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 20 }}>
        <div
          style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}
        >
          <span className="mb-kicker">Balance today</span>
          <span style={{ ...mono, fontSize: 13, color: 'var(--text-secondary)' }}>
            {todayAvg == null ? '··' : signed(todayVal)}
          </span>
        </div>
        <BalanceMeter value={todayVal} label={dayNote(todayVal)} />
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            margin: '2px 0 0',
            paddingTop: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <span className="mb-kicker">Check-ins</span>
          <Button variant="primary" size="sm" onClick={() => setCheckinOpen((o) => !o)}>
            Rate my balance now
          </Button>
        </div>
        {checkinOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 14,
              background: 'var(--surface-sunken)',
              borderRadius: 10,
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {valNote(checkinVal)}
              </span>
              <span style={{ ...mono, fontSize: 13 }}>{signed(checkinVal)}</span>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.05}
              value={checkinVal}
              onChange={(e) => setCheckinVal(Number(e.target.value))}
              aria-label="Balance right now"
              className="mb-slider"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                color: 'var(--text-muted)',
              }}
            >
              <span>Yin 陰</span>
              <span>centre</span>
              <span>陽 Yang</span>
            </div>
            <Input
              placeholder="A word about why (optional)"
              value={checkinNote}
              onChange={(e) => setCheckinNote(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setCheckinOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={saveNow}>
                Save check-in
              </Button>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {today.checkins.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
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
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, minWidth: 0 }}>
                {c.note || ''}
              </span>
            </div>
          ))}
          {today.checkins.length === 0 && (
            <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              No check-ins yet today. The first one takes ten seconds.
            </p>
          )}
        </div>
      </Card>

      {/* Meals */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingBottom: 8,
          }}
        >
          <span className="mb-kicker">Meals · {today.meals.length}</span>
          <Button variant="secondary" size="sm" onClick={() => setPickerOpen((o) => !o)}>
            Log a meal
          </Button>
        </div>
        {pickerOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 12,
              background: 'var(--surface-sunken)',
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <Input
              placeholder="Search meals — try pumpkin soup"
              value={pickQ}
              onChange={(e) => setPickQ(e.target.value)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 240, overflowY: 'auto' }}>
              {pickRows.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="mb-row mb-hoverable"
                  onClick={() => {
                    logMeal.mutate({ date: tKey, id: m.id, t: hhmm(new Date()) });
                    setPickerOpen(false);
                    setPickQ('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '9px 6px',
                    borderTop: '1px solid var(--border-subtle)',
                    borderRadius: 6,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: 'var(--text-primary)' }}>
                    {m.n}
                  </span>
                  <span style={{ ...mono, fontSize: 11, color: 'var(--text-muted)' }}>{m.time}</span>
                  <div style={{ width: 90, flex: 'none' }}>
                    <BalanceMeter value={m.yy} size="sm" showLabels={false} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {today.meals.map((m, i) => {
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
                  padding: '11px 0',
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
                <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: 'var(--text-primary)' }}>
                  {meal?.n ?? m.id}
                </span>
                <div style={{ width: 110, flex: 'none' }}>
                  <BalanceMeter value={meal?.yy ?? 0} size="sm" showLabels={false} />
                </div>
                <Icon name="chevron-right" size={16} color="var(--text-faint)" />
              </Link>
            );
          })}
          {today.meals.length === 0 && (
            <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              Nothing logged yet.
            </p>
          )}
        </div>
      </Card>

      {/* Today's practice */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'var(--surface-sunken)',
            flex: 'none',
          }}
        >
          <Icon name={practiceToday?.icon ?? 'sprout'} size={18} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
          <span className="mb-kicker">Today's practice</span>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{practiceToday?.n ?? ''}</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{practiceToday?.desc ?? ''}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <Button
            variant={practiceDone ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => {
              if (!practiceDone && practiceToday) {
                markPractice.mutate({ date: tKey, id: practiceToday.id });
              }
            }}
          >
            {practiceDone ? 'Done today' : 'Mark done'}
          </Button>
          <Link to="/practices" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" tabIndex={-1}>
              All practices
            </Button>
          </Link>
        </div>
      </Card>

      {/* This week */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="mb-kicker">This week</span>
          <Link to="/diary" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" tabIndex={-1}>
              Open diary
            </Button>
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {weekCols.map((c) => (
            <Link
              key={c.key}
              to={`/diary?d=${c.key}`}
              className="mb-row mb-hoverable"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '8px 2px',
                border: `1px solid ${c.isToday ? 'var(--border-strong)' : 'transparent'}`,
                borderRadius: 10,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.letter}</span>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot }} />
              <span style={{ ...mono, fontSize: 10, color: 'var(--text-faint)' }}>{c.vStr}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
