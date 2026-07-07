import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Icon, ThemeToggle, Motif, FarmFieldFooter, FarmScatter } from '@/components';
import { Rail } from './Rail';
import { TabBar } from './TabBar';
import { MoreSheet } from './MoreSheet';
import { activeTabFor, byId, screenMeta } from './nav';
import { useIsDesktop, useIsWide } from './useMediaQuery';

let restoredTab = false;

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const isWide = useIsWide();
  const gardenSeed = Array.from(location.pathname).reduce((a, c) => a + c.charCodeAt(0), 0);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);

  const activeTab = activeTabFor(location.pathname);
  const now = new Date();
  const meta = screenMeta(activeTab, now);
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Restore the last active tab once per load (prototype's dk-tab behavior);
  // deep links win because we only redirect from the bare root path.
  useEffect(() => {
    if (restoredTab) return;
    restoredTab = true;
    if (location.pathname !== '/') return;
    try {
      const saved = localStorage.getItem('dk-tab');
      if (saved && saved !== 'today' && byId[saved]) {
        navigate(byId[saved].path, { replace: true });
      }
    } catch {
      /* private mode */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dk-tab', activeTab);
    } catch {
      /* private mode */
    }
  }, [activeTab]);

  // Scroll to top on navigation; close the sheet when crossing to desktop.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    if (isDesktop) setMoreOpen(false);
  }, [isDesktop]);

  const closeMore = () => {
    setMoreOpen(false);
    moreButtonRef.current?.focus();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-page)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* The strap — stitched-leather brand hairline, fixed at the very top. */}
      <div
        aria-hidden="true"
        className="dk-strap"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 80,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient farm sprigs in the margins — only when the column has real gutter. */}
      {isWide && <FarmScatter />}

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {isDesktop && <Rail activeTab={activeTab} dateStr={dateStr} />}

        <main style={{ flex: 1, minWidth: 0 }}>
          {!isDesktop && (
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                maxWidth: 680,
                margin: '0 auto',
                padding: '18px 20px 0',
                boxSizing: 'border-box',
              }}
            >
              <span
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}
              >
                <Icon name="horse" size={19} color="var(--accent-strong)" strokeWidth={2} />
                <span className="dk-wordmark" style={{ fontSize: 20 }}>Dakota</span>
                <Motif name="sunflower" size={18} style={{ marginLeft: -1 }} />
              </span>
              <ThemeToggle />
            </header>
          )}

          <div
            style={{
              maxWidth: 680,
              margin: '0 auto',
              boxSizing: 'border-box',
              padding: isDesktop ? '36px 32px 56px' : '6px 20px 108px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 0 4px' }}
            >
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 30,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.15,
                  color: 'var(--text-primary)',
                }}
              >
                {meta.title}
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>{meta.sub}</p>
            </div>

            <Outlet />

            {/* Desktop shows the garden in the rail instead, so it isn't doubled. */}
            {!isDesktop && <FarmFieldFooter seed={gardenSeed} />}
          </div>
        </main>
      </div>

      {!isDesktop && (
        <TabBar
          activeTab={activeTab}
          onMore={() => setMoreOpen(true)}
          moreButtonRef={moreButtonRef}
        />
      )}
      {moreOpen && !isDesktop && <MoreSheet activeTab={activeTab} onClose={closeMore} />}
    </div>
  );
}
