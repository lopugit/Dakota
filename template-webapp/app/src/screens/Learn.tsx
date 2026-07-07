import { Link, useNavigate } from 'react-router';
import { Button, Card, Icon } from '@/components';
import { useCatalog, useProfile } from '@/lib/queries';
import type { Lesson } from '@shared/types';

const mono = { fontFamily: 'var(--font-mono)' } as const;

export function LearnScreen() {
  const navigate = useNavigate();
  const { data: catalog } = useCatalog();
  const { data: profile } = useProfile();

  const isDone = (l: Lesson) => l.done || !!profile?.lessonsDone[l.id];

  const fob = (catalog?.courses ?? []).find((c) => c.id === 'fob');
  const contLesson = fob?.lessons.find((l) => !isDone(l)) ?? null;

  return (
    <div className="mb-screen">
      <Card
        raised
        style={{
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <span className="mb-kicker">Continue</span>
        <span
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '-0.015em',
            lineHeight: 1.2,
          }}
        >
          {contLesson ? contLesson.t : 'All caught up'}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {contLesson && fob
            ? `Foundations of Balance · Lesson ${fob.lessons.indexOf(contLesson) + 1} of ${fob.lessons.length}`
            : ''}
        </span>
        <Button
          variant="primary"
          style={{ marginTop: 6 }}
          onClick={() => {
            if (contLesson) navigate(`/learn/${contLesson.id}`);
          }}
        >
          Continue lesson
        </Button>
      </Card>

      {(catalog?.courses ?? []).map((course) => {
        const doneN = course.lessons.filter(isDone).length;
        const pct = Math.round((doneN / course.lessons.length) * 100);
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
                style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 20, fontWeight: 500 }}
              >
                {course.title}
              </span>
              <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)' }}>
                {doneN} of {course.lessons.length}
              </span>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: 'var(--surface-sunken)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: 'var(--accent)',
                  borderRadius: 2,
                  transition: 'width 320ms ease-out',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {course.lessons.map((l) => {
                const done = isDone(l);
                return (
                  <Link
                    key={l.id}
                    to={`/learn/${l.id}`}
                    className="mb-row mb-hoverable"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
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
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        border: `1.5px solid ${done ? 'var(--control-checked)' : 'var(--border-strong)'}`,
                        background: done ? 'var(--control-checked)' : 'transparent',
                        flex: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
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
