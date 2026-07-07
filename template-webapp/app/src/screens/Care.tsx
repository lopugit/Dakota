import { Link } from 'react-router';
import { Avatar, BalanceMeter, Card, Icon } from '@/components';
import { useCatalog } from '@/lib/queries';

export function CareScreen() {
  const { data: catalog } = useCatalog();

  return (
    <div className="mb-screen">
      <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
        {(catalog?.friends ?? []).map((f) => (
          <Link
            key={f.id}
            to={`/care/${f.id}`}
            className="mb-row mb-hoverable"
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
            <Avatar initials={f.initials} size={38} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{f.n}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {f.relation} · {f.constitution}
              </span>
            </div>
            <div style={{ width: 100, flex: 'none' }}>
              <BalanceMeter value={f.bal} size="sm" showLabels={false} />
            </div>
            <Icon name="chevron-right" size={16} color="var(--text-faint)" />
          </Link>
        ))}
      </Card>
    </div>
  );
}
