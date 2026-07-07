import { useState } from 'react';
import { Link } from 'react-router';
import { Avatar, Button, Card, Icon, Input } from '@/components';
import {
  useAddComment,
  useFeed,
  useProfile,
  useSharePost,
  useToggleLike,
} from '@/lib/queries';
import { useExerciseById } from '@/lib/day';
import { fmtKm, fmtMin } from '@/lib/geo';

const mono = { fontFamily: 'var(--font-mono)' } as const;

const initialsOf = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

export function FeedScreen() {
  const { data: feed } = useFeed();
  const { data: profile } = useProfile();
  const exerciseById = useExerciseById();

  const displayName = profile?.name ?? '';
  const toggleLike = useToggleLike();
  const addComment = useAddComment(displayName);
  const sharePost = useSharePost(displayName);

  const [shareText, setShareText] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const share = () => {
    const text = shareText.trim();
    if (!text) return;
    sharePost.mutate({ text });
    setShareText('');
  };

  return (
    <div className="dk-screen">
      {/* Composer */}
      <Card style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="dk-kicker">Share with your circle</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar initials={displayName ? initialsOf(displayName) : 'You'} size={36} />
          <Input
            aria-label="Share something with your circle"
            placeholder="Share a win, a wonder, or a wet saddle blanket"
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') share();
            }}
            style={{ flex: 1 }}
          />
          <Button variant="primary" size="sm" onClick={share} disabled={!shareText.trim()}>
            Share
          </Button>
        </div>
      </Card>

      {/* Posts */}
      {(feed ?? []).map((p) => {
        const ex = p.ex ? exerciseById(p.ex) : undefined;
        const draft = drafts[p.id] ?? '';
        const expanded = !!open[p.id];
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
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials={p.initials} size={36} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{p.who}</span>
              <span style={{ ...mono, fontSize: 11, color: 'var(--text-faint)' }}>{p.time}</span>
            </div>

            {/* Text */}
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--text-primary)',
                textWrap: 'pretty',
              }}
            >
              {p.text}
            </p>

            {/* Exercise panel */}
            {ex && (
              <Link
                to={`/arena/${ex.id}`}
                className="dk-row dk-hoverable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  minHeight: 44,
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  background: 'var(--surface-sunken)',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxSizing: 'border-box',
                }}
              >
                <Icon name="target" size={16} color="var(--text-muted)" />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{ex.n}</span>
                <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                  {ex.level} · {ex.mins} min
                </span>
                <Icon name="chevron-right" size={16} color="var(--text-faint)" />
              </Link>
            )}

            {/* Ride panel */}
            {p.ride && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  minHeight: 44,
                  padding: '10px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  background: 'var(--surface-sunken)',
                  boxSizing: 'border-box',
                }}
              >
                <Icon name="map-pin" size={16} color="var(--text-muted)" />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.ride.name}</span>
                <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)' }}>
                  {fmtKm(p.ride.km)} · {fmtMin(p.ride.min)}
                </span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                className="dk-row dk-hoverable"
                onClick={() => toggleLike.mutate({ postId: p.id, liked: !p.liked })}
                aria-pressed={p.liked}
                aria-label={p.liked ? 'Unlike this post' : 'Like this post'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: 44,
                  padding: '6px 10px',
                  borderRadius: 999,
                  color: p.liked ? 'var(--danger)' : 'var(--text-muted)',
                  fontSize: 13,
                }}
              >
                <Icon
                  name="heart"
                  size={16}
                  style={{ fill: p.liked ? 'currentColor' : 'none' }}
                />
                <span style={{ ...mono, fontSize: 12 }}>{p.likes + (p.liked ? 1 : 0)}</span>
              </button>
              <button
                type="button"
                className="dk-row dk-hoverable"
                onClick={() => setOpen((o) => ({ ...o, [p.id]: !o[p.id] }))}
                aria-expanded={expanded}
                aria-label={expanded ? 'Hide the reply box' : 'Write a reply'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  minHeight: 44,
                  padding: '6px 10px',
                  borderRadius: 999,
                  color: expanded ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: 13,
                }}
              >
                <Icon name="message-circle" size={16} />
                <span style={{ ...mono, fontSize: 12 }}>{p.comments.length}</span>
              </button>
            </div>

            {/* Comments */}
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
                    <Avatar initials={initialsOf(c.who || '?')} size={24} />
                    <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.who}
                      </span>{' '}
                      <span style={{ fontSize: 13 }}>{c.t}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply */}
            {expanded && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  aria-label={`Reply to ${p.who}`}
                  placeholder="Add a comment"
                  value={draft}
                  onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') postComment();
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  style={{ alignSelf: 'center' }}
                  onClick={postComment}
                  disabled={!draft.trim()}
                >
                  Reply
                </Button>
              </div>
            )}
          </Card>
        );
      })}

      {/* Empty state */}
      {feed && feed.length === 0 && (
        <Card style={{ padding: '18px 20px' }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Quiet in the circle so far. Share the first note from the yard.
          </p>
        </Card>
      )}
    </div>
  );
}
