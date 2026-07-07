import { Link, useParams } from 'react-router';
import { Badge, Button, Card, Icon } from '@/components';
import { useCatalog } from '@/lib/queries';
import { urgencyTone } from '@shared/derive';

const sentence = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function AilmentDetailScreen() {
  const { id } = useParams();
  const { data: catalog } = useCatalog();

  const ailment = (catalog?.ailments ?? []).find((a) => a.id === id);
  const urgency = ailment?.urgency;
  const vetNow = urgency === 'vet now';
  const vetFirst = urgency === 'vet now' || urgency === 'vet soon';
  const tone = urgency ? urgencyTone(urgency) : 'neutral';

  const vetCard = (
    <Card
      style={{
        padding: 20,
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        ...(vetNow ? { background: 'var(--danger-soft)' } : {}),
      }}
    >
      <Icon
        name="stethoscope"
        size={20}
        color={vetNow ? 'var(--danger)' : 'var(--text-muted)'}
        style={{ flex: 'none', marginTop: 1 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="dk-kicker">When to call the vet</span>
        <span style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)' }}>
          {ailment?.vet ?? ''}
        </span>
      </div>
    </Card>
  );

  const careCard = (
    <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span className="dk-kicker" style={{ paddingBottom: 8 }}>
        What you can do
      </span>
      {(ailment?.care ?? []).map((c, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: '11px 0',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {c.n}
          </span>
          <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
            {c.how}
          </span>
        </div>
      ))}
    </Card>
  );

  return (
    <div className="dk-screen">
      <div>
        <Link to="/health" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← All conditions
          </Button>
        </Link>
      </div>

      <Card style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
          }}
        >
          {ailment?.n ?? ''}
        </span>
        {ailment && <Badge>{ailment.system}</Badge>}
        {ailment && urgency && (
          <Badge tone={tone === 'neutral' ? undefined : tone}>{sentence(urgency)}</Badge>
        )}
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="dk-kicker" style={{ paddingBottom: 8 }}>
          What you&rsquo;ll see
        </span>
        {(ailment?.signs ?? []).map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 0',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Icon name="eye" size={15} color="var(--text-faint)" style={{ flex: 'none' }} />
            <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              {s}
            </span>
          </div>
        ))}
      </Card>

      {vetFirst ? (
        <>
          {vetCard}
          {careCard}
        </>
      ) : (
        <>
          {careCard}
          {vetCard}
        </>
      )}

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="dk-kicker" style={{ paddingBottom: 8 }}>
          Keeping it away
        </span>
        {(ailment?.prevention ?? []).map((p, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 0',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Icon name="shield-check" size={15} color="var(--accent-strong)" style={{ flex: 'none' }} />
            <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              {p}
            </span>
          </div>
        ))}
      </Card>

      {ailment?.note && (
        <p
          style={{
            margin: 0,
            borderLeft: '3px solid var(--border-strong)',
            paddingLeft: 14,
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          {ailment.note}
        </p>
      )}
    </div>
  );
}
