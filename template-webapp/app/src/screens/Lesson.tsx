import { Link, useNavigate, useParams } from 'react-router';
import { Button, Card } from '@/components';
import { useCatalog, useCompleteLesson, useProfile } from '@/lib/queries';
import type { ArticleBlock, Course, Lesson } from '@shared/types';

const FALLBACK_BLOCKS: ArticleBlock[] = [
  {
    t: 'p',
    x: 'The full text of this lesson is still being written — this reader shows the format it will arrive in.',
  },
  {
    t: 'aside',
    x: 'Browse “The energy of cooking” or “Chewing well” in Foundations of Balance for finished examples.',
  },
];

function Block({ block }: { block: ArticleBlock }) {
  if (block.t === 'h') {
    return (
      <h3
        style={{
          margin: '10px 0 0',
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: '-0.01em',
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
          lineHeight: 1.75,
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
          margin: '8px 0',
          padding: '16px 8px',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 19,
          lineHeight: 1.5,
          textAlign: 'center',
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
        padding: '14px 16px',
        background: 'var(--surface-sunken)',
        borderRadius: 10,
        fontSize: 13.5,
        lineHeight: 1.6,
        color: 'var(--text-secondary)',
      }}
    >
      {block.x}
    </div>
  );
}

export function LessonScreen() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
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

  const done = !!lesson && (lesson.done || !!profile?.lessonsDone[lesson.id]);
  const blocks = lesson ? (catalog?.articles[lesson.id] ?? FALLBACK_BLOCKS) : [];
  const nextLesson = course && idx !== -1 ? course.lessons[idx + 1] : undefined;

  return (
    <div className="mb-screen">
      <div>
        <Link to="/learn" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← All courses
          </Button>
        </Link>
      </div>

      <Card
        style={{
          padding: '28px 26px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="mb-kicker">{course?.title ?? ''}</span>
          <h2
            style={{
              margin: 0,
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: '-0.015em',
              lineHeight: 1.15,
            }}
          >
            {lesson?.t ?? ''}
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            {lesson && course ? `${lesson.min} min · Lesson ${idx + 1} of ${course.lessons.length}` : ''}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: '56ch' }}>
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
            paddingTop: 10,
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <Button
            variant={done ? 'secondary' : 'primary'}
            onClick={() => {
              if (!done && lesson) completeLesson.mutate(lesson.id);
            }}
          >
            {done ? 'Completed' : 'Mark complete'}
          </Button>
          {nextLesson && (
            <Button variant="ghost" onClick={() => navigate(`/learn/${nextLesson.id}`)}>
              Next: {nextLesson.t}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
