import { Link, useParams } from 'react-router';
import { Badge, BalanceMeter, Button, Card, Icon } from '@/components';
import { useCatalog } from '@/lib/queries';
import { signed, valColor } from '@shared/derive';

/** One-line reading of where a feed sits on the cooling ↔ heating scale. */
function heatReading(heat: number): string {
  if (heat < -0.15) return 'A cooling feed — condition without the fizz';
  if (heat > 0.15) return 'A heating feed — energy that can light a fuse';
  return 'Sits near the centre — steady as they come';
}

const relatedRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '12px 0',
  minHeight: 44,
  borderTop: '1px solid var(--border-subtle)',
  textDecoration: 'none',
  color: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
} as const;

export function FeedItemDetailScreen() {
  const { id } = useParams();
  const { data: catalog } = useCatalog();

  const feeds = catalog?.feeds ?? [];
  const item = feeds.find((f) => f.id === id);
  const heat = item?.heat ?? 0;
  const related = item
    ? feeds.filter((f) => f.cat === item.cat && f.id !== item.id).slice(0, 4)
    : [];

  const back = (
    <div>
      <Link to="/feedroom" style={{ textDecoration: 'none' }}>
        <Button variant="ghost" size="sm" tabIndex={-1}>
          ← Feed room
        </Button>
      </Link>
    </div>
  );

  if (catalog && !item) {
    return (
      <div className="dk-screen">
        {back}
        <Card style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>That feed isn’t in the room</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Head back to the feed room and pick another bin.
          </span>
        </Card>
      </div>
    );
  }

  return (
    <div className="dk-screen">
      {back}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', minHeight: 30 }}>
        <span
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          {item?.n ?? ''}
        </span>
        {item && <Badge tone="neutral">{item.cat}</Badge>}
      </div>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span className="dk-kicker">On the scale</span>
          <span
            style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: valColor(heat) }}
          >
            {signed(heat)}
          </span>
        </div>
        <BalanceMeter value={heat} showLabels={false} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          <span>Cooling</span>
          <span>centre</span>
          <span>Heating</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: valColor(heat),
              flex: 'none',
            }}
          />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {item ? heatReading(heat) : ''}
          </span>
        </div>
      </Card>

      <Card style={{ padding: 20 }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {item?.note ?? ''}
        </p>
      </Card>

      {related.length > 0 && item && (
        <Card style={{ padding: '16px 20px 4px', display: 'flex', flexDirection: 'column' }}>
          <span className="dk-kicker" style={{ paddingBottom: 6 }}>
            Also in {item.cat}
          </span>
          {related.map((f) => (
            <Link
              key={f.id}
              to={`/feedroom/${f.id}`}
              className="dk-row dk-hoverable"
              style={relatedRowStyle}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}
              >
                {f.n}
              </span>
              <div style={{ width: 90, flex: 'none' }}>
                <BalanceMeter value={f.heat} size="sm" showLabels={false} />
              </div>
              <Icon name="chevron-right" size={16} color="var(--text-faint)" />
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
