import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Button, Card, Icon, Input, Tag } from '@/components';
import { useHorses, useRides, useSaveRide } from '@/lib/queries';
import { todayKey, useHorseById } from '@/lib/day';
import { fmtClock, fmtKm, fmtKmh, fmtMin, rideStats, trackToSvg } from '@/lib/geo';
import type { RidePoint } from '@shared/types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function writtenDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

function defaultRideName(now: Date): string {
  const h = now.getHours();
  const part = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  return `${part} ride`;
}

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
  minHeight: 56,
} as const;

const statLabelStyle = {
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-faint)',
} as const;

const statValueStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 18,
  color: 'var(--text-primary)',
} as const;

type Phase = 'idle' | 'tracking' | 'finished' | 'unavailable';

/** Pulsing red dot for the live "Recording" legend — SMIL, no extra CSS. */
function PulseDot() {
  return (
    <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden="true" style={{ flex: 'none' }}>
      <circle cx={5} cy={5} r={3.5} fill="var(--scale-hot3)">
        <animate attributeName="opacity" values="1;0.25;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function RidesScreen() {
  const { data: horses } = useHorses();
  const { data: rides } = useRides();
  const horseById = useHorseById();
  const saveRide = useSaveRide();

  const [phase, setPhase] = useState<Phase>('idle');
  const [horseSel, setHorseSel] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const pointsRef = useRef<RidePoint[]>([]);
  const startedAtRef = useRef(0);

  const horse = horseSel ?? horses?.[0]?.id ?? '';
  const horseName = horseById(horse)?.name ?? '';

  const stopSensors = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation?.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => stopSensors, []);

  const start = () => {
    if (!('geolocation' in navigator) || !navigator.geolocation) {
      setPhase('unavailable');
      return;
    }
    const startedAt = Date.now();
    startedAtRef.current = startedAt;
    pointsRef.current = [];
    setElapsed(0);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const t = (Date.now() - startedAtRef.current) / 1000;
        const pts = pointsRef.current;
        const last = pts[pts.length - 1];
        if (last && t - last.t < 3) return;
        pts.push({ la: pos.coords.latitude, ln: pos.coords.longitude, t });
      },
      () => {
        stopSensors();
        setPhase('unavailable');
      },
      { enableHighAccuracy: true, maximumAge: 2000 },
    );
    timerRef.current = window.setInterval(
      () => setElapsed((Date.now() - startedAt) / 1000),
      1000,
    );
    setPhase('tracking');
  };

  const finish = () => {
    stopSensors();
    setName(defaultRideName(new Date()));
    setNote('');
    setPhase('finished');
  };

  const reset = () => {
    stopSensors();
    pointsRef.current = [];
    setElapsed(0);
    setName('');
    setNote('');
    setPhase('idle');
  };

  const save = () => {
    saveRide.mutate({
      horse,
      name: name.trim() || defaultRideName(new Date()),
      date: todayKey(),
      startedAt: startedAtRef.current,
      ...rideStats(pointsRef.current),
      note: note.trim(),
      points: pointsRef.current,
    });
    reset();
  };

  const liveStats = rideStats(pointsRef.current);
  const liveTrack = phase === 'tracking' ? trackToSvg(pointsRef.current, 280, 140) : null;
  const rideList = rides ?? [];

  return (
    <div className="dk-screen">
      {/* ---- tracker card ---- */}
      <Card raised style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {phase === 'idle' && (
          <>
            <span className="dk-kicker">Track a ride</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(horses ?? []).map((h) => (
                <Tag key={h.id} active={h.id === horse} onClick={() => setHorseSel(h.id)}>
                  {h.name}
                </Tag>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
              Pick a horse, pocket the phone, and the trace draws itself.
            </p>
            <div>
              <Button
                variant="primary"
                onClick={start}
                disabled={!horse}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Icon name="play" size={16} />
                Start riding
              </Button>
            </div>
          </>
        )}

        {phase === 'unavailable' && (
          <>
            <span className="dk-kicker">Track a ride</span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
              GPS isn&rsquo;t available here. Rides track from a phone with location on — this
              screen will be ready when you are.
            </p>
          </>
        )}

        {phase === 'tracking' && (
          <>
            <span className="dk-kicker">{horseName ? `Riding ${horseName}` : 'Riding'}</span>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 44,
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                textAlign: 'center',
              }}
            >
              {fmtClock(elapsed)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ ...statValueStyle, fontSize: 16 }}>{fmtKm(liveStats.km)}</span>
                <span style={statLabelStyle}>Distance</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ ...statValueStyle, fontSize: 16 }}>{fmtKmh(liveStats.avgKmh)}</span>
                <span style={statLabelStyle}>Avg speed</span>
              </div>
            </div>
            {liveTrack && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg
                  width={liveTrack.w}
                  height={liveTrack.h}
                  viewBox={`0 0 ${liveTrack.w} ${liveTrack.h}`}
                  aria-hidden="true"
                  style={{
                    background: 'var(--surface-sunken)',
                    borderRadius: 12,
                    maxWidth: '100%',
                  }}
                >
                  <path
                    d={liveTrack.path}
                    fill="none"
                    stroke="var(--accent-strong)"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx={liveTrack.start[0]} cy={liveTrack.start[1]} r={3} fill="var(--text-faint)" />
                  <circle cx={liveTrack.end[0]} cy={liveTrack.end[1]} r={3.5} fill="var(--accent-strong)" />
                </svg>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: 12,
                color: 'var(--text-faint)',
              }}
            >
              <PulseDot />
              Recording
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="primary"
                onClick={finish}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Icon name="square" size={14} />
                Finish ride
              </Button>
            </div>
          </>
        )}

        {phase === 'finished' && (
          <>
            <span className="dk-kicker">Ride summary</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={statValueStyle}>{fmtKm(liveStats.km)}</span>
                <span style={statLabelStyle}>Distance</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={statValueStyle}>{fmtMin(liveStats.min)}</span>
                <span style={statLabelStyle}>Time</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={statValueStyle}>{fmtKmh(liveStats.avgKmh)}</span>
                <span style={statLabelStyle}>Avg speed</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={statValueStyle}>{fmtKmh(liveStats.maxKmh)}</span>
                <span style={statLabelStyle}>Top speed</span>
              </div>
            </div>
            <Input
              aria-label="Ride name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              aria-label="Ride note"
              placeholder="A note for later — how did it feel out there?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="primary" onClick={save}>
                Save ride
              </Button>
              <Button variant="ghost" onClick={reset}>
                Discard
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* ---- ride history ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="dk-kicker">Ride history · {rideList.length}</span>
        <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
          {rideList.map((r) => {
            const box = trackToSvg(r.points, 64, 40, 4);
            const rHorse = horseById(r.horse)?.name ?? 'Unknown horse';
            return (
              <Link key={r.id} to={`/rides/${r.id}`} className="dk-row dk-hoverable" style={rowStyle}>
                <span
                  style={{
                    width: 64,
                    height: 40,
                    borderRadius: 8,
                    background: 'var(--surface-sunken)',
                    flex: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {box && (
                    <svg width={64} height={40} viewBox="0 0 64 40" aria-hidden="true">
                      <path
                        d={box.path}
                        fill="none"
                        stroke="var(--text-faint)"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {r.name}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                    {writtenDate(r.date)} · {rHorse}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 1,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    flex: 'none',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>{fmtKm(r.km)}</span>
                  <span style={{ color: 'var(--text-faint)' }}>{fmtMin(r.min)}</span>
                </div>
                <Icon name="chevron-right" size={16} color="var(--text-faint)" />
              </Link>
            );
          })}
          {rideList.length === 0 && (
            <p style={{ margin: 0, padding: '20px 0', fontSize: 13, color: 'var(--text-muted)' }}>
              No rides yet. The first one only needs a phone in your pocket.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
