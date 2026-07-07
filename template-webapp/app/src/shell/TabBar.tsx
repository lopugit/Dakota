import { Link } from 'react-router';
import { Icon } from '@/components';
import { BAR_IDS, MORE_IDS, byId } from './nav';

const itemStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  minHeight: 52,
  padding: '4px 2px',
  border: 'none',
  borderRadius: 10,
  background: 'transparent',
  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
  fontFamily: 'inherit',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'color 120ms ease-out',
});

const dash = (active: boolean) => (
  <span
    style={{
      display: 'block',
      width: 16,
      height: 2,
      borderRadius: 1,
      background: active ? 'var(--text-primary)' : 'transparent',
    }}
  />
);

export function TabBar({
  activeTab,
  onMore,
  moreButtonRef,
}: {
  activeTab: string;
  onMore: () => void;
  moreButtonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const moreActive = MORE_IDS.includes(activeTab);
  return (
    <nav
      aria-label="Main"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 2,
        maxWidth: 680,
        margin: '0 auto',
        padding: '6px 10px calc(6px + env(safe-area-inset-bottom))',
        boxSizing: 'border-box',
        background: 'color-mix(in srgb, var(--surface-card) 86%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {BAR_IDS.map((id) => {
        const d = byId[id];
        const active = id === activeTab;
        return (
          <Link
            key={id}
            to={d.path}
            aria-current={active ? 'page' : undefined}
            className="mb-hoverable"
            style={itemStyle(active)}
          >
            {dash(active)}
            <Icon name={d.icon} size={20} strokeWidth={active ? 2 : 1.75} />
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 500 }}>{d.label}</span>
          </Link>
        );
      })}
      <button
        ref={moreButtonRef}
        type="button"
        onClick={onMore}
        className="mb-hoverable"
        style={itemStyle(moreActive)}
      >
        {dash(moreActive)}
        <Icon name="menu" size={20} strokeWidth={moreActive ? 2 : 1.75} />
        <span style={{ fontSize: 11, fontWeight: moreActive ? 600 : 500 }}>More</span>
      </button>
    </nav>
  );
}
