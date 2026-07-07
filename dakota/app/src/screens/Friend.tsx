import { Link, useNavigate, useParams } from 'react-router';
import { Avatar, Button, Card, Icon } from '@/components';
import { useCatalog } from '@/lib/queries';

export function FriendScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: catalog } = useCatalog();

  const friend = (catalog?.friends ?? []).find((f) => f.id === id);
  const horses = friend?.horses ?? [];
  const trend = friend?.trend ?? [];
  const thisWeek = trend.length > 0 ? trend[trend.length - 1] : 0;

  return (
    <div className="dk-screen">
      <div>
        <Link to="/circle" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← Circle
          </Button>
        </Link>
      </div>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={friend?.initials ?? ''} size={56} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}
            >
              {friend?.n ?? ''}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {friend ? `${friend.relation} · ${friend.discipline}` : ''}
            </span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {friend?.note ?? ''}
        </p>
      </Card>

      <Card style={{ padding: '16px 0 6px', display: 'flex', flexDirection: 'column' }}>
        <span className="dk-kicker" style={{ padding: '0 20px 6px' }}>
          Their horses
        </span>
        {horses.map((h, i) => (
          <div
            key={h.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minHeight: 44,
              padding: '10px 20px',
              borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                background: 'var(--surface-sunken)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="horse" size={16} color="var(--text-secondary)" />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{h.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{h.breed}</span>
            </div>
          </div>
        ))}
        {horses.length === 0 && (
          <span style={{ padding: '6px 20px 10px', fontSize: 13, color: 'var(--text-faint)' }}>
            No horses listed yet.
          </span>
        )}
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="dk-kicker">Sessions per week</span>
        <div
          style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 48 }}
          aria-hidden="true"
        >
          {trend.map((v, i) => (
            <span
              key={i}
              style={{
                width: 16,
                height: Math.max(2, v * 6),
                background: i === trend.length - 1 ? 'var(--accent-press)' : 'var(--accent-strong)',
                borderRadius: '3px 3px 0 0',
              }}
            />
          ))}
        </div>
        <span className="dk-mono" style={{ fontSize: 12, color: 'var(--text-faint)' }}>
          {trend.length > 0 ? `last ${trend.length} weeks · ${thisWeek} this week` : ''}
        </span>
      </Card>

      <div>
        <Button variant="ghost" size="md" onClick={() => navigate('/feed')}>
          Say something kind on the feed
        </Button>
      </div>
    </div>
  );
}
