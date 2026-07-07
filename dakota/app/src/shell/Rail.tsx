import { Link } from 'react-router';
import { Icon, ThemeToggle } from '@/components';
import { RAIL_GROUPS, byId } from './nav';

export function Rail({ activeTab, dateStr }: { activeTab: string; dateStr: string }) {
  return (
    <aside
      style={{
        flex: 'none',
        width: 240,
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: '28px 14px 20px',
        background: 'var(--surface-card)',
        borderRight: '1px solid var(--border-subtle)',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px' }}>
        <span
          className="dk-wordmark"
          style={{ fontSize: 21, color: 'var(--text-primary)' }}
        >
          Dakota
        </span>
        <span className="dk-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {dateStr}
        </span>
      </div>
      <nav aria-label="Main" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {RAIL_GROUPS.map((grp, gi) => (
          <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {grp.h && (
              <span
                className="dk-kicker"
                style={{ padding: '0 12px 4px', color: 'var(--text-faint)' }}
              >
                {grp.h}
              </span>
            )}
            {grp.items.map((id) => {
              const d = byId[id];
              const active = id === activeTab;
              return (
                <Link
                  key={id}
                  to={d.path}
                  aria-current={active ? 'page' : undefined}
                  className="dk-hoverable"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    minHeight: 40,
                    padding: '8px 12px',
                    boxSizing: 'border-box',
                    border: 'none',
                    borderRadius: 10,
                    background: active ? 'var(--surface-sunken)' : 'transparent',
                    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    textAlign: 'left',
                    textDecoration: 'none',
                    transition: 'color 120ms ease-out',
                  }}
                >
                  <Icon name={d.icon} size={18} strokeWidth={active ? 2 : 1.75} />
                  <span>{d.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
