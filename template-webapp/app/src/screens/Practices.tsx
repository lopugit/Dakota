import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Badge, Button, Card, Icon } from '@/components';
import { useCatalog, useLog, useMarkPractice } from '@/lib/queries';
import { getDay, todayKey } from '@/lib/day';
import { dateKey } from '@shared/mb-data';
import { practiceStreak } from '@shared/derive';

export function PracticesScreen() {
  const { data: catalog } = useCatalog();
  const { data: log } = useLog();
  const markPractice = useMarkPractice();
  const [searchParams] = useSearchParams();
  const [expanded, setExpanded] = useState<string | null>(() => searchParams.get('open'));

  const now = new Date();
  const tKey = todayKey();
  const dayFor = (key: string) => getDay(log, key);

  return (
    <div className="mb-screen" style={{ gap: 12 }}>
      {(catalog?.practices ?? []).map((p) => {
        const doneToday = dayFor(tKey).practices.includes(p.id);
        const streak = practiceStreak(p.id, dayFor, dateKey, now);
        const isOpen = expanded === p.id;
        return (
          <Card
            key={p.id}
            style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <button
              type="button"
              className="mb-row"
              onClick={() => setExpanded(isOpen ? null : p.id)}
              aria-expanded={isOpen}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 0, width: '100%' }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'var(--surface-sunken)',
                  flex: 'none',
                }}
              >
                <Icon name={p.icon} size={18} />
              </span>
              <div
                style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{p.n}</span>
                  <Badge>{p.tag}</Badge>
                  {streak > 0 && <Badge tone="green">{streak}-day streak</Badge>}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.desc}</span>
              </div>
              <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="var(--text-faint)" />
            </button>
            {isOpen && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: 12,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          color: 'var(--text-faint)',
                          width: 14,
                          flex: 'none',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {p.why}
                </p>
                <div>
                  <Button
                    variant={doneToday ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => {
                      if (!doneToday) markPractice.mutate({ date: tKey, id: p.id });
                    }}
                  >
                    {doneToday ? 'Done today' : 'Mark done'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>
        Practice, not perfection — a kept streak is a bonus, not a duty.
      </p>
    </div>
  );
}
