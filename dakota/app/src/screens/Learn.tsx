// Learn — course catalog with per-lesson read state.
import { Link } from 'react-router';
import { Card, Icon } from '@/components';
import { useCatalog, useProfile } from '@/lib/queries';
import type { Lesson } from '@shared/types';

const mono = { fontFamily: 'var(--font-mono)' } as const;

export function LearnScreen() {
  const { data: catalog } = useCatalog();
  const { data: profile } = useProfile();

  const isDone = (l: Lesson) => l.done || !!profile?.lessonsDone[l.id];

  return (
    <div className="dk-screen">
      {(catalog?.courses ?? []).map((course) => {
        const lessons = course.lessons ?? [];
        const doneN = lessons.filter(isDone).length;
        return (
          <Card
            key={course.id}
            style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontSize: 18,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                }}
              >
                {course.title}
              </span>
              <span className="dk-kicker" style={{ flex: 'none' }}>
                {doneN}/{lessons.length} read
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {lessons.map((l) => {
                const done = isDone(l);
                return (
                  <Link
                    key={l.id}
                    to={`/learn/${l.id}`}
                    className="dk-row dk-hoverable"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minHeight: 44,
                      padding: '10px 0',
                      borderTop: '1px solid var(--border-subtle)',
                      textDecoration: 'none',
                      color: 'inherit',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: done ? 'none' : '1.5px solid var(--border-subtle)',
                        background: done ? 'var(--accent)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      {done && <Icon name="check" size={12} color="var(--on-accent)" />}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 14,
                        color: done ? 'var(--text-muted)' : 'var(--text-primary)',
                      }}
                    >
                      {l.t}
                    </span>
                    <span style={{ ...mono, fontSize: 11, color: 'var(--text-faint)' }}>
                      {l.min} min
                    </span>
                    <Icon name="chevron-right" size={16} color="var(--text-faint)" />
                  </Link>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
