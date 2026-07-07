import { useState } from 'react';
import { Link } from 'react-router';
import { Avatar, Badge, BalanceMeter, Button, Card, Icon, Input, Tag } from '@/components';
import { useCatalog, useHorses, useLog, useLogSession, useMarkPractice, useSaveCheckin } from '@/lib/queries';
import { getDay, todayKey, useDayAvg, useHorseById } from '@/lib/day';
import {
  careDueSoon,
  dateKey,
  dayNote,
  dueLabel,
  hhmm,
  signed,
  valColor,
  valNote,
} from '@shared/derive';

const mono = { fontFamily: 'var(--font-mono)' } as const;

/** Southern-hemisphere season from the month (0–11), with one line of husbandry advice. */
function seasonInfo(month: number): { name: string; icon: string; line: string } {
  if (month === 11 || month <= 1) {
    return {
      name: 'High summer',
      icon: 'sun',
      line: 'Ride early, hose off after, and keep shade and clean water within easy reach.',
    };
  }
  if (month <= 4) {
    return {
      name: 'Autumn',
      icon: 'cloud-sun',
      line: 'The grass flushes again as the nights cool — watch waistlines and ease the rugs back on.',
    };
  }
  if (month <= 7) {
    return {
      name: 'Winter',
      icon: 'wind',
      line: 'Mud season — check rugs morning and night, and keep hay up to them.',
    };
  }
  return {
    name: 'Spring',
    icon: 'sprout',
    line: 'Spring grass is rich — introduce it slowly and keep an eye out for early laminitis signs.',
  };
}

export function TodayScreen() {
  const { data: catalog } = useCatalog();
  const { data: log } = useLog();
  const { data: horses } = useHorses();
  const horseById = useHorseById();
  const avgFor = useDayAvg();
  const saveCheckin = useSaveCheckin();
  const logSession = useLogSession();
  const markPractice = useMarkPractice();

  // Check-in form
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkinHorse, setCheckinHorse] = useState<string | null>(null);
  const [checkinVal, setCheckinVal] = useState(0);
  const [checkinNote, setCheckinNote] = useState('');

  // Session picker + form
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickQ, setPickQ] = useState('');
  const [openEx, setOpenEx] = useState<string | null>(null);
  const [sessHorse, setSessHorse] = useState<string | null>(null);
  const [sessScore, setSessScore] = useState(0);
  const [sessMins, setSessMins] = useState('');
  const [sessNote, setSessNote] = useState('');

  const now = new Date();
  const tKey = todayKey();
  const today = getDay(log, tKey);
  const todayAvg = avgFor(tKey);
  const todayVal = todayAvg == null ? 0 : todayAvg;

  const herd = horses ?? [];
  const season = seasonInfo(now.getMonth());
  const careRows = careDueSoon(herd, now, 14);

  const pickQl = pickQ.toLowerCase();
  const pickRows = (catalog?.exercises ?? []).filter(
    (ex) => !pickQl || ex.n.toLowerCase().includes(pickQl),
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

  const checkinHorseId = checkinHorse ?? herd[0]?.id ?? null;
  const sessHorseId = sessHorse ?? herd[0]?.id ?? null;

  const saveCheckinNow = () => {
    if (!checkinHorseId) return;
    saveCheckin.mutate({
      date: tKey,
      horse: checkinHorseId,
      t: hhmm(new Date()),
      v: checkinVal,
      note: checkinNote.trim(),
    });
    setCheckinOpen(false);
    setCheckinNote('');
    setCheckinVal(0);
  };

  const openExercise = (id: string, mins: number) => {
    if (openEx === id) {
      setOpenEx(null);
      return;
    }
    setOpenEx(id);
    setSessScore(0);
    setSessMins(String(mins));
    setSessNote('');
  };

  const saveSessionNow = (exId: string, defaultMins: number) => {
    if (!sessHorseId) return;
    logSession.mutate({
      date: tKey,
      ex: exId,
      horse: sessHorseId,
      t: hhmm(new Date()),
      mins: Number(sessMins) > 0 ? Math.round(Number(sessMins)) : defaultMins,
      score: sessScore,
      note: sessNote.trim(),
    });
    setPickerOpen(false);
    setOpenEx(null);
    setPickQ('');
  };

  const careTone = (inDays: number) =>
    inDays < 0 ? 'var(--danger)' : inDays <= 7 ? 'var(--warning)' : 'var(--text-muted)';

  return (
    <div className="dk-screen">
      {/* Season banner */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
        <Icon name={season.icon} size={20} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{season.name}</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{season.line}</span>
        </div>
        <Icon name="horse" size={26} color="var(--text-faint)" />
      </Card>

      {/* Care due soon */}
      {careRows.length > 0 && (
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 6 }}>
            <span className="dk-kicker">Care coming up</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {careRows.slice(0, 4).map((d, i) => (
              <Link
                key={d.horse.id + d.type + i}
                to={`/horses/${d.horse.id}`}
                className="dk-row dk-hoverable"
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
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: careTone(d.inDays),
                    flex: 'none',
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{d.horse.name}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, minWidth: 0 }}>
                  {d.label}
                </span>
                <span style={{ ...mono, fontSize: 12, color: careTone(d.inDays) }}>
                  {dueLabel(d.inDays)}
                </span>
                <Icon name="chevron-right" size={16} color="var(--text-faint)" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Energy today */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 20 }}>
        <div
          style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}
        >
          <span className="dk-kicker">Energy today</span>
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
          <span className="dk-kicker">Check-ins</span>
          <Button variant="primary" size="sm" onClick={() => setCheckinOpen((o) => !o)}>
            Check in now
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
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {herd.map((h) => (
                <Tag
                  key={h.id}
                  active={h.id === checkinHorseId}
                  onClick={() => setCheckinHorse(h.id)}
                >
                  {h.name}
                </Tag>
              ))}
            </div>
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
              aria-label="How did the horse feel"
              className="dk-slider"
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                color: 'var(--text-muted)',
              }}
            >
              <span>Flat</span>
              <span>centre</span>
              <span>Hot</span>
            </div>
            <Input
              placeholder="A word about how they were (optional)"
              value={checkinNote}
              onChange={(e) => setCheckinNote(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={() => setCheckinOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={saveCheckinNow}>
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
              <span style={{ fontSize: 13, fontWeight: 600, flex: 'none' }}>
                {horseById(c.horse)?.name ?? ''}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, minWidth: 0 }}>
                {c.note || ''}
              </span>
            </div>
          ))}
          {today.checkins.length === 0 && (
            <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              No check-ins yet today. Ten seconds at the gate counts.
            </p>
          )}
        </div>
      </Card>

      {/* Sessions today */}
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
          <span className="dk-kicker">Training · {today.sessions.length}</span>
          <Button variant="secondary" size="sm" onClick={() => setPickerOpen((o) => !o)}>
            Log a session
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
              placeholder="Search exercises — try serpentine"
              value={pickQ}
              onChange={(e) => setPickQ(e.target.value)}
              aria-label="Search exercises"
            />
            <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 300, overflowY: 'auto' }}>
              {pickRows.map((ex) => (
                <div key={ex.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <button
                    type="button"
                    className="dk-row dk-hoverable"
                    onClick={() => openExercise(ex.id, ex.mins)}
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
                    <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: 'var(--text-primary)', textAlign: 'left' }}>
                      {ex.n}
                    </span>
                    <span style={{ ...mono, fontSize: 11, color: 'var(--text-muted)' }}>
                      {ex.mins} min
                    </span>
                    <Badge>{ex.level}</Badge>
                  </button>
                  {openEx === ex.id && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        padding: '12px 6px 14px',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {herd.map((h) => (
                          <Tag
                            key={h.id}
                            active={h.id === sessHorseId}
                            onClick={() => setSessHorse(h.id)}
                          >
                            {h.name}
                          </Tag>
                        ))}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                        }}
                      >
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          {valNote(sessScore)}
                        </span>
                        <span style={{ ...mono, fontSize: 13 }}>{signed(sessScore)}</span>
                      </div>
                      <input
                        type="range"
                        min={-1}
                        max={1}
                        step={0.05}
                        value={sessScore}
                        onChange={(e) => setSessScore(Number(e.target.value))}
                        aria-label="How did the horse feel"
                        className="dk-slider"
                      />
                      <Input
                        type="number"
                        min={1}
                        value={sessMins}
                        onChange={(e) => setSessMins(e.target.value)}
                        aria-label="Session minutes"
                      />
                      <Input
                        placeholder="What improved, what needs work"
                        value={sessNote}
                        onChange={(e) => setSessNote(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Button variant="ghost" size="sm" onClick={() => setOpenEx(null)}>
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => saveSessionNow(ex.id, ex.mins)}
                        >
                          Save session
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {pickRows.length === 0 && (
                <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  No exercises match that search.
                </p>
              )}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {today.sessions.map((s, i) => {
            const ex = (catalog?.exercises ?? []).find((e) => e.id === s.ex);
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
                  padding: '11px 0',
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
                <Avatar initials={horse?.initials ?? '··'} size={24} />
                <span style={{ flex: 1, minWidth: 0, fontSize: 14, color: 'var(--text-primary)' }}>
                  {ex?.n ?? s.ex}
                </span>
                <span style={{ ...mono, fontSize: 11, color: 'var(--text-muted)' }}>
                  {s.mins} min
                </span>
                <div style={{ width: 90, flex: 'none' }}>
                  <BalanceMeter value={s.score} size="sm" showLabels={false} />
                </div>
                <Icon name="chevron-right" size={16} color="var(--text-faint)" />
              </Link>
            );
          })}
          {today.sessions.length === 0 && (
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
          <span className="dk-kicker">Today's practice</span>
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
          <span className="dk-kicker">This week</span>
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
              className="dk-row dk-hoverable"
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
