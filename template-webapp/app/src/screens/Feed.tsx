import { useState } from 'react';
import { Link } from 'react-router';
import { Avatar, BalanceMeter, Button, Card, Icon, Input, Tag } from '@/components';
import {
  useAddComment,
  useFeed,
  useLog,
  useProfile,
  useSharePost,
  useToggleLike,
} from '@/lib/queries';
import { getDay, todayKey, useMealById } from '@/lib/day';

const mono = { fontFamily: 'var(--font-mono)' } as const;

export function FeedScreen() {
  const { data: feed } = useFeed();
  const { data: log } = useLog();
  const { data: profile } = useProfile();
  const mealById = useMealById();

  const displayName = profile?.name ?? '';
  const toggleLike = useToggleLike();
  const addComment = useAddComment(displayName);
  const sharePost = useSharePost(displayName);

  const [shareText, setShareText] = useState('');
  const [shareMeal, setShareMeal] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const today = getDay(log, todayKey());
  const shareMealIds = [
    ...new Set([...today.meals.map((m) => m.id), 'pumpkin-soup', 'miso-soup']),
  ].slice(0, 4);

  const share = () => {
    const text = shareText.trim();
    if (!text) return;
    sharePost.mutate({ text, meal: shareMeal ?? undefined });
    setShareText('');
    setShareMeal(null);
  };

  return (
    <div className="mb-screen">
      {/* Composer */}
      <Card style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="mb-kicker">Share from today</span>
        <Input
          placeholder="What did you cook, notice, learn?"
          value={shareText}
          onChange={(e) => setShareText(e.target.value)}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {shareMealIds.map((id) => {
            const m = mealById(id);
            if (!m) return null;
            return (
              <Tag
                key={id}
                active={shareMeal === id}
                onClick={() => setShareMeal((cur) => (cur === id ? null : id))}
              >
                {m.n}
              </Tag>
            );
          })}
          <div style={{ flex: 1 }} />
          <Button variant="primary" size="sm" onClick={share}>
            Share
          </Button>
        </div>
      </Card>

      {/* Posts */}
      {(feed ?? []).map((p) => {
        const meal = p.meal ? mealById(p.meal) : undefined;
        const draft = drafts[p.id] ?? '';
        const postComment = () => {
          const t = draft.trim();
          if (!t) return;
          addComment.mutate({ postId: p.id, t });
          setDrafts((d) => ({ ...d, [p.id]: '' }));
        };
        return (
          <Card
            key={p.id}
            style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials={p.initials} size={36} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{p.who}</span>
              <span style={{ ...mono, fontSize: 11, color: 'var(--text-faint)' }}>{p.time}</span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14.5,
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                textWrap: 'pretty',
              }}
            >
              {p.text}
            </p>
            {meal && (
              <Link
                to={`/meals/${meal.id}`}
                className="mb-row mb-hoverable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  background: 'var(--surface-sunken)',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxSizing: 'border-box',
                }}
              >
                <Icon name="soup" size={16} color="var(--text-muted)" />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{meal.n}</span>
                <div style={{ width: 90, flex: 'none' }}>
                  <BalanceMeter value={meal.yy} size="sm" showLabels={false} />
                </div>
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                className="mb-row mb-hoverable"
                onClick={() => toggleLike.mutate({ postId: p.id, liked: !p.liked })}
                aria-pressed={p.liked}
                aria-label={p.liked ? 'Unlike' : 'Like'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 999,
                  color: p.liked ? 'var(--accent-strong)' : 'var(--text-muted)',
                  fontSize: 13,
                }}
              >
                <Icon name="heart" size={16} />
                <span style={{ ...mono, fontSize: 12 }}>{p.likes + (p.liked ? 1 : 0)}</span>
              </button>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                }}
              >
                <Icon name="message-circle" size={16} />
                <span style={{ ...mono, fontSize: 12 }}>{p.comments.length}</span>
              </span>
            </div>
            {p.comments.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                {p.comments.map((c, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0 0' }}
                  >
                    <Avatar initials={(c.who || '?').slice(0, 2).toUpperCase()} size={24} />
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.who}</strong>
                      {' '} {c.t}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <Input
                placeholder="Add a comment"
                value={draft}
                onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') postComment();
                }}
                style={{ flex: 1 }}
              />
              <Button
                variant="secondary"
                size="sm"
                style={{ alignSelf: 'center' }}
                onClick={postComment}
              >
                Post
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
