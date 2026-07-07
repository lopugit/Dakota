import { Badge, Card, Input, Tag } from '@/components';
import { useCatalog, useProfile, useUpdateProfile } from '@/lib/queries';
import { useSticky } from '@/lib/useSticky';
import { zodiacFor } from '@shared/mb-data';

const mono = { fontFamily: 'var(--font-mono)' } as const;

const TABS = [
  { id: 'elements', label: 'Five elements' },
  { id: 'clock', label: 'Organ clock' },
  { id: 'astro', label: 'Astrology' },
  { id: 'glossary', label: 'Glossary' },
];

const miniLabel = {
  fontSize: 10.5,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'var(--text-faint)',
} as const;

export function WisdomScreen() {
  const { data: catalog } = useCatalog();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [tab, setTab] = useSticky('wisdom.tab', 'elements');
  const [q, setQ] = useSticky('wisdom.q', '');

  const ql = q.trim().toLowerCase();
  const wMatch = (s: string) => !ql || s.toLowerCase().includes(ql);

  const nowH = new Date().getHours();
  const birthYear = profile?.birthYear ?? '1992';
  const zod = zodiacFor(birthYear);
  const zodElement = zod ? (catalog?.elements ?? []).find((e) => e.el === zod.element) : null;

  return (
    <div className="mb-screen">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TABS.map((t) => (
            <Tag key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </Tag>
          ))}
        </div>
        <Input
          placeholder="Search — organs, seasons, terms"
          aria-label="Search wisdom"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {tab === 'elements' && (
        <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
          {(catalog?.elements ?? [])
            .filter((e) => wMatch(`${e.el} ${e.organ} ${e.season} ${e.foods}`))
            .map((e) => (
              <div
                key={e.el}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '14px 0',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: `var(${e.colorVar})`,
                      flex: 'none',
                    }}
                  />
                  <span
                    style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 20, fontWeight: 500 }}
                  >
                    {e.el}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{e.organ}</span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '8px 16px',
                    paddingLeft: 20,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={miniLabel}>Season</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{e.season}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={miniLabel}>Taste</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{e.taste}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={miniLabel}>Emotion</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{e.emotion}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={miniLabel}>Foods</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{e.foods}</span>
                  </div>
                </div>
              </div>
            ))}
        </Card>
      )}

      {tab === 'clock' && (
        <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
          {(catalog?.clock ?? [])
            .filter((c) => wMatch(`${c.organ} ${c.note}`))
            .map((c) => {
              const isNow = (nowH - c.h + 24) % 24 < 2;
              return (
                <div
                  key={c.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '11px 8px',
                    margin: '0 -8px',
                    borderTop: '1px solid var(--border-subtle)',
                    background: isNow ? 'var(--surface-sunken)' : 'transparent',
                    borderRadius: 8,
                  }}
                >
                  <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', width: 48, flex: 'none' }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 500, width: 118, flex: 'none' }}>
                    {c.organ}
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)', flex: 1 }}>{c.note}</span>
                  {isNow && <Badge tone="green">now</Badge>}
                </div>
              );
            })}
        </Card>
      )}

      {tab === 'astro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="mb-kicker">Your chart</span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)' }} htmlFor="mb-birth-year">
                  Birth year
                </label>
                <Input
                  id="mb-birth-year"
                  type="number"
                  value={birthYear}
                  onChange={(e) => updateProfile.mutate({ birthYear: e.target.value })}
                  style={{ width: 110 }}
                />
              </div>
              {zod && (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 2 }}
                >
                  <span
                    style={{
                      fontFamily: "'Newsreader', Georgia, serif",
                      fontSize: 28,
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      lineHeight: 1,
                    }}
                  >
                    {zod.element} {zod.animal}
                  </span>
                  <Badge style={{ alignSelf: 'flex-start' }}>{zod.polarity}</Badge>
                </div>
              )}
            </div>
            {zod && (
              <>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {zod.note}
                </p>
                {zodElement && (
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                    {zod.element} element — {zodElement.organ.toLowerCase()},{' '}
                    {zodElement.taste.toLowerCase()} taste, strongest in{' '}
                    {zodElement.season.toLowerCase()}.
                  </p>
                )}
              </>
            )}
          </Card>
          <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="mb-kicker">This year</span>
            <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 22, fontWeight: 500 }}>
              2026 — the Fire Horse 丙午
            </span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              A fast, warm, outward-moving year. The classical counsel is to balance its heat with
              grounding meals, steady sleep and unhurried mornings — more nishime, less midnight.
            </p>
          </Card>
        </div>
      )}

      {tab === 'glossary' && (
        <Card style={{ padding: '4px 20px', display: 'flex', flexDirection: 'column' }}>
          {(catalog?.glossary ?? [])
            .filter((g) => wMatch(`${g.term} ${g.def}`))
            .map((g) => (
              <div
                key={g.term}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  padding: '13px 0',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 18, fontWeight: 500 }}
                >
                  {g.term}
                </span>
                <span style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {g.def}
                </span>
              </div>
            ))}
        </Card>
      )}
    </div>
  );
}
