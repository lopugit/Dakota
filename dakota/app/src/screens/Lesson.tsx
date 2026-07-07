import { Link, useParams } from 'react-router';
import { Button, Card, Icon } from '@/components';
import { useCatalog, useCompleteLesson, useProfile } from '@/lib/queries';
import type { ArticleBlock, Course, Lesson } from '@shared/types';

function Block({ block }: { block: ArticleBlock }) {
  if (block.t === 'h') {
    return (
      <h3
        style={{
          margin: '10px 0 0',
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        }}
      >
        {block.x}
      </h3>
    );
  }
  if (block.t === 'p') {
    return (
      <p
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.65,
          color: 'var(--text-secondary)',
          textWrap: 'pretty',
        }}
      >
        {block.x}
      </p>
    );
  }
  if (block.t === 'quote') {
    return (
      <p
        style={{
          margin: '6px 0',
          padding: '4px 0 4px 14px',
          borderLeft: '3px solid var(--accent-strong)',
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 17,
          lineHeight: 1.55,
          color: 'var(--text-primary)',
          textWrap: 'pretty',
        }}
      >
        {block.x}
      </p>
    );
  }
  if (block.t === 'list') {
    const items = Array.isArray(block.x) ? block.x : [block.x];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0 4px 4px' }}>
        {items.map((li, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent-strong)',
                flex: 'none',
                transform: 'translateY(-2px)',
              }}
            />
            <span style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{li}</span>
          </div>
        ))}
      </div>
    );
  }
  // aside
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        background: 'var(--surface-sunken)',
        borderRadius: 12,
      }}
    >
      <Icon
        name="sparkles"
        size={16}
        color="var(--accent-strong)"
        style={{ flex: 'none', marginTop: 2 }}
      />
      <span style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{block.x}</span>
    </div>
  );
}

export function LessonScreen() {
  const { lessonId } = useParams();
  const { data: catalog } = useCatalog();
  const { data: profile } = useProfile();
  const completeLesson = useCompleteLesson();

  let course: Course | undefined;
  let lesson: Lesson | undefined;
  let idx = -1;
  for (const c of catalog?.courses ?? []) {
    const i = c.lessons.findIndex((l) => l.id === lessonId);
    if (i !== -1) {
      course = c;
      lesson = c.lessons[i];
      idx = i;
      break;
    }
  }

  const blocks = lessonId ? (catalog?.articles[lessonId] ?? []) : [];
  const done = !!lesson && (lesson.done || !!profile?.lessonsDone[lesson.id]);
  const nextLesson = course && idx !== -1 ? course.lessons[idx + 1] : undefined;

  return (
    <div className="dk-screen">
      <div>
        <Link to="/learn" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← Learn
          </Button>
        </Link>
      </div>

      <Card style={{ padding: '26px 24px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="dk-kicker">
            {course ? `${course.title} · lesson ${idx + 1} of ${course.lessons.length}` : ''}
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
            }}
          >
            {lesson?.t ?? ''}
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-faint)' }}>
            {lesson ? `${lesson.min} min read` : ''}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: '58ch' }}>
          {blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {done ? (
            <Button
              variant="secondary"
              disabled
              style={{ opacity: 0.65, cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Icon name="check" size={15} />
              Read
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                if (lesson) completeLesson.mutate(lesson.id);
              }}
            >
              Mark as read
            </Button>
          )}
          {nextLesson && (
            <Link to={`/learn/${nextLesson.id}`} style={{ textDecoration: 'none' }}>
              <Button variant="ghost" tabIndex={-1}>
                Next: {nextLesson.t} →
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
