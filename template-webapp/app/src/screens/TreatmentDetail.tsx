import { Link, useNavigate, useParams } from 'react-router';
import { Badge, Button, Card, Tag } from '@/components';
import { useCatalog } from '@/lib/queries';
import { patternTone } from '@shared/derive';

export function TreatmentDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: catalog } = useCatalog();

  const ailment = (catalog?.ailments ?? []).find((a) => a.id === id);
  const tone = ailment ? patternTone(ailment.pattern) : 'neutral';

  const eatRow = (e: NonNullable<typeof ailment>['eat'][number], key: number) => {
    const inner = (
      <>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{e.n}</span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.why}</span>
      </>
    );
    const style = {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '11px 0',
      borderTop: '1px solid var(--border-subtle)',
      textDecoration: 'none',
      color: 'inherit',
      width: '100%',
      boxSizing: 'border-box',
    } as const;
    return e.ref ? (
      <Link key={key} to={`/meals/${e.ref}`} className="mb-row mb-hoverable" style={style}>
        {inner}
      </Link>
    ) : (
      <div key={key} style={style}>
        {inner}
      </div>
    );
  };

  return (
    <div className="mb-screen">
      <div>
        <Link to="/treatments" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← All ailments
          </Button>
        </Link>
      </div>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            {ailment?.n ?? ''}
          </span>
          {ailment && (
            <Badge tone={tone === 'neutral' ? undefined : tone}>{ailment.pattern}</Badge>
          )}
          {ailment && <Badge>{ailment.system}</Badge>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(ailment?.signs ?? []).map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--text-faint)',
                  flex: 'none',
                  transform: 'translateY(-2px)',
                }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="mb-kicker" style={{ paddingBottom: 8 }}>
          Favour
        </span>
        {(ailment?.eat ?? []).map((e, i) => eatRow(e, i))}
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="mb-kicker" style={{ paddingBottom: 8 }}>
          Home remedies
        </span>
        {(ailment?.remedies ?? []).map((r, i) => (
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
            <span style={{ fontSize: 14, fontWeight: 500 }}>{r.n}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.how}</span>
          </div>
        ))}
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="mb-kicker">Supporting practices</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(ailment?.practices ?? []).map((pid) => {
              const p = (catalog?.practices ?? []).find((x) => x.id === pid);
              return (
                <Tag key={pid} onClick={() => navigate(`/practices?open=${pid}`)}>
                  {p?.n ?? pid}
                </Tag>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="mb-kicker">Ease off</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(ailment?.avoid ?? []).map((x, i) => (
              <Badge key={i}>{x}</Badge>
            ))}
          </div>
        </div>
        <p
          style={{
            margin: 0,
            paddingTop: 4,
            borderTop: '1px solid var(--border-subtle)',
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          {ailment?.note ?? ''}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)' }}>
          Kitchen support, not a diagnosis. See a practitioner for anything persistent or severe.
        </p>
      </Card>
    </div>
  );
}
