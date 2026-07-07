import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Button, Card } from '@/components';
import { useProfile, useRides, useSharePost } from '@/lib/queries';
import { useHorseById } from '@/lib/day';
import { fmtKm, fmtKmh, fmtMin, trackToSvg } from '@/lib/geo';

/** '2026-06-14' → 'Sunday 14 June 2026' (local, no timezone drift). */
function writtenDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span className="dk-kicker">{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20 }}>{value}</span>
    </div>
  );
}

export function RideDetailScreen() {
  const { id } = useParams();
  const { data: rides } = useRides();
  const { data: profile } = useProfile();
  const horseById = useHorseById();
  const share = useSharePost(profile?.name ?? '');
  const [shared, setShared] = useState(false);

  const ride = (rides ?? []).find((r) => r.id === id);
  const horse = ride ? horseById(ride.horse) : undefined;
  const subtitle = ride
    ? [writtenDate(ride.date), horse?.name].filter(Boolean).join(' · ')
    : '';
  const track = trackToSvg(ride?.points ?? [], 320, 200);

  const back = (
    <div>
      <Link to="/rides" style={{ textDecoration: 'none' }}>
        <Button variant="ghost" size="sm" tabIndex={-1}>
          ← All rides
        </Button>
      </Link>
    </div>
  );

  // Rides are loaded but this id isn't one of them — offer the way back.
  if (rides && !ride) {
    return <div className="dk-screen">{back}</div>;
  }

  const onShare = () => {
    if (!ride) return;
    share.mutate({
      text: ride.note || 'Out on ' + ride.name + '.',
      ride: { name: ride.name, km: ride.km, min: ride.min },
    });
    setShared(true);
  };

  return (
    <div className="dk-screen">
      {back}

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          {ride?.name ?? ''}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>{subtitle}</span>
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="dk-kicker">Track</span>
        {rides === undefined ? (
          <div style={{ height: 200 }} />
        ) : track ? (
          <>
            <svg
              width="100%"
              viewBox={`0 0 ${track.w} ${track.h}`}
              role="img"
              aria-label={`GPS track for ${ride?.name ?? 'this ride'}`}
            >
              <path
                d={track.path}
                fill="none"
                stroke="var(--accent-strong)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx={track.start[0]} cy={track.start[1]} r={5} fill="var(--scale-centre)" />
              <circle cx={track.end[0]} cy={track.end[1]} r={5} fill="var(--scale-hot3)" />
            </svg>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-faint)',
              }}
            >
              <span
                aria-hidden="true"
                style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--scale-centre)' }}
              />
              <span>start</span>
              <span>·</span>
              <span
                aria-hidden="true"
                style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--scale-hot3)' }}
              />
              <span>finish</span>
            </div>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
            No GPS trace saved for this ride.
          </p>
        )}
      </Card>

      <Card style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <StatTile label="Distance" value={ride ? fmtKm(ride.km) : '—'} />
        <StatTile label="Time" value={ride ? fmtMin(ride.min) : '—'} />
        <StatTile label="Average" value={ride ? fmtKmh(ride.avgKmh) : '—'} />
        <StatTile label="Top speed" value={ride ? fmtKmh(ride.maxKmh) : '—'} />
      </Card>

      {ride && ride.note !== '' && (
        <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="dk-kicker">Notes</span>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {ride.note}
          </p>
        </Card>
      )}

      <div style={{ display: 'flex', alignItems: 'center', minHeight: 36 }}>
        {shared ? (
          <span style={{ fontSize: 13, color: 'var(--text-faint)', padding: '0 12px' }}>
            Shared to your feed.
          </span>
        ) : (
          <Button variant="ghost" size="sm" onClick={onShare} disabled={!ride}>
            Share this ride
          </Button>
        )}
      </div>
    </div>
  );
}
