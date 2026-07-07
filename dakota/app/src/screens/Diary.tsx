import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { BalanceMeter, Button, Card, Icon, IconButton, Tag } from '@/components';
import { useCatalog, useLog } from '@/lib/queries';
import { dateKey, getDay, todayKey, useDayAvg, useExerciseById, useHorseById } from '@/lib/day';
import type { CareType } from '@shared/types';
import { CARE_LABELS, dayNote, signed, valColor } from '@shared/derive';

const mono = { fontFamily: 'var(--font-mono)' } as const;

const CARE_ICONS: Record<CareType, string> = {
  farrier: 'horse',
  vet: 'stethoscope',
  worming: 'shield-check',
  vaccination: 'syringe',
  dental: 'search',
  physio: 'activity',
  other: 'clipboard-list',
};

/** Month offset (in months) from the current month to the month containing `key`. */
function monthOffsetFor(key: string, now: Date): number {
  const [y, m] = key.split('-').map(Number);
  return (y - now.getFullYear()) * 12 + (m - 1 - now.getMonth());
}

export function DiaryScreen() {
  const { data: catalog } = useCatalog();
  const { data: log } = useLog();
  const exerciseById = useExerciseById();
  const horseById = useHorseById();
  const avgFor = useDayAvg();
  const [searchParams, setSearchParams] = useSearchParams();

  const now = new Date();
  const tKey = todayKey();
  const selDay = searchParams.get('d') || tKey;
  const [monthOffset, setMonthOffset] = useState(() => monthOffsetFor(selDay, now));

  const selectDay = (key: string) => setSearchParams({ d: key });

  const mBase = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthLabel = mBase.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
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
      future: k > tKey,
      dot: avg == null ? 'var(--border-subtle)' : valColor(avg),
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
  const restDay =
    selData.sessions.length === 0 &&
    selData.checkins.length === 0 &&
    selData.care.length === 0 &&
    selData.practices.length === 0;

  const emptyLine = (text: string) => (
    <p style={{ margin: '4px 0 8px', fontSize: 13, color: 'var(--text-muted)' }}>{text}</p>
  );

  return (
    <div className="dk-screen">
      {/* Calendar */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
        >
          <IconButton aria-label="Previous month" onClick={() => setMonthOffset((o) => o - 1)}>
            <Icon name="chevron-left" size={18} />
          </IconButton>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500 }}>
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
              className="dk-row dk-hoverable"
              onClick={() => selectDay(c.key)}
              aria-label={`Open ${c.key}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                minHeight: 48,
                padding: '4px 0',
                border: `1px solid ${c.selected ? 'var(--focus-ring)' : 'transparent'}`,
                borderRadius: 10,
                background: c.isToday ? 'var(--surface-sunken)' : 'transparent',
                opacity: c.future ? 0.45 : 1,
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
          Dot colour is the day's average — violet toward flat, red toward hot, green at centre.
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
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500 }}>
            {selDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
          <span style={{ ...mono, fontSize: 13, color: 'var(--text-secondary)' }}>
            {selAvg == null ? 'nothing logged' : signed(selAvg)}
          </span>
        </div>
        {selAvg != null && <BalanceMeter value={selAvg} label={dayNote(selAvg)} />}

        {restDay ? (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
            A rest day — horses need those too.
          </p>
        ) : (
          <>
            {/* Training */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="dk-kicker" style={{ paddingBottom: 6 }}>
                Training
              </span>
              {selData.sessions.map((s, i) => {
                const ex = exerciseById(s.ex);
                const horse = horseById(s.horse);
                return (
                  <Link
                    key={i}
                    to={`/arena/${s.ex}`}
                    className="dk-row dk-hoverable"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 44,
                      padding: '10px 0',
                      borderTop: '1px solid var(--border-subtle)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <span
                      style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', width: 44, flex: 'none' }}
                    >
                      {s.t}
                    </span>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14 }}>{ex?.n ?? s.ex}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {horse?.name ?? s.horse}
                        </span>
                      </div>
                      {s.note && (
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.note}</span>
                      )}
                    </div>
                    <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', flex: 'none' }}>
                      {s.mins} min
                    </span>
                    <div style={{ width: 90, flex: 'none' }}>
                      <BalanceMeter value={s.score} size="sm" showLabels={false} />
                    </div>
                  </Link>
                );
              })}
              {selData.sessions.length === 0 && emptyLine('No schooling this day.')}
            </div>

            {/* Check-ins */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="dk-kicker" style={{ paddingBottom: 6 }}>
                Check-ins
              </span>
              {selData.checkins.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    minHeight: 44,
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
                  <span style={{ fontSize: 13, flex: 'none' }}>{horseById(c.horse)?.name ?? c.horse}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, minWidth: 0 }}>
                    {c.note || ''}
                  </span>
                </div>
              ))}
              {selData.checkins.length === 0 && emptyLine('No check-ins this day.')}
            </div>

            {/* Care */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="dk-kicker" style={{ paddingBottom: 6 }}>
                Care
              </span>
              {selData.care.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    minHeight: 44,
                    padding: '9px 0',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <span style={{ width: 44, flex: 'none', display: 'flex', alignItems: 'center' }}>
                    <Icon name={CARE_ICONS[c.type]} size={18} color="var(--text-muted)" />
                  </span>
                  <span style={{ fontSize: 14, flex: 'none' }}>{CARE_LABELS[c.type]}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 'none' }}>
                    {horseById(c.horse)?.name ?? c.horse}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, minWidth: 0 }}>
                    {c.note || ''}
                  </span>
                </div>
              ))}
              {selData.care.length === 0 && emptyLine('No care logged this day.')}
            </div>

            {/* Practices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="dk-kicker">Practices kept</span>
              {selPractices.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selPractices.map((n) => (
                    <Tag key={n} active>
                      {n}
                    </Tag>
                  ))}
                </div>
              ) : (
                emptyLine('No practices kept this day.')
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
