import { Link } from 'react-router';
import { Avatar, Card, Icon } from '@/components';
import { useCatalog } from '@/lib/queries';

/** 7-bar weekly-sessions sparkline; the current week reads at full strength. */
function TrendBars({ trend }: { trend: number[] }) {
  const bars = trend.slice(-7);
  const max = Math.max(1, ...bars);
  return (
    <div
      style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 18, flex: 'none' }}
      aria-hidden="true"
    >
      {bars.map((v, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: Math.max(2, Math.round((v / max) * 18)),
            borderRadius: 1,
            background: 'var(--accent-strong)',
            opacity: i === bars.length - 1 ? 1 : 0.7,
          }}
        />
      ))}
    </div>
  );
}

export function CircleScreen() {
  const { data: catalog } = useCatalog();
  const friends = catalog?.friends ?? [];

  return (
    <div className="dk-screen">
      <Card style={{ padding: '14px 20px 4px', display: 'flex', flexDirection: 'column' }}>
        <span className="dk-kicker" style={{ paddingBottom: 12 }}>
          Riders around you
        </span>
        {friends.map((f) => (
          <Link
            key={f.id}
            to={`/circle/${f.id}`}
            className="dk-row dk-hoverable"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '13px 0',
              borderTop: '1px solid var(--border-subtle)',
              textDecoration: 'none',
              color: 'inherit',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Avatar initials={f.initials} size={40} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{f.n}</span>
              <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                {f.relation} · {f.discipline}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.horses.map((h) => `${h.name} (${h.breed})`).join(', ')}
              </span>
            </div>
            <TrendBars trend={f.trend} />
            <Icon name="chevron-right" size={16} color="var(--text-faint)" />
          </Link>
        ))}
      </Card>
      <p
        style={{
          fontSize: 12.5,
          color: 'var(--text-faint)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        Your circle sees what you share to the feed — nothing else.
      </p>
    </div>
  );
}
