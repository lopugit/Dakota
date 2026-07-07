import { Link, useNavigate, useParams } from 'react-router';
import { Avatar, Badge, BalanceMeter, Button, Card, Tag } from '@/components';
import { useCatalog } from '@/lib/queries';
import { suggestedMeals, valColor, valNote } from '@shared/derive';

export function FriendScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: catalog } = useCatalog();

  const friend = (catalog?.friends ?? []).find((f) => f.id === id);
  const meals = friend ? suggestedMeals(friend.bal, catalog?.meals ?? []) : [];

  return (
    <div className="mb-screen">
      <div>
        <Link to="/care" style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="sm" tabIndex={-1}>
            ← Everyone
          </Button>
        </Link>
      </div>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={friend?.initials ?? ''} size={52} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {friend?.n ?? ''}
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {friend && <Badge>{friend.relation}</Badge>}
              {friend && <Badge tone="green">{friend.constitution}</Badge>}
            </div>
          </div>
        </div>
        <BalanceMeter value={friend?.bal ?? 0} label={friend ? valNote(friend.bal) : undefined} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
          <span className="mb-kicker">Past seven days</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 44 }}>
            {(friend?.trend ?? []).map((v, i, arr) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: Math.round(Math.abs(v) * 30 + 6),
                  background: valColor(v),
                  opacity: i === arr.length - 1 ? 1 : 0.55,
                  borderRadius: '3px 3px 0 0',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
            Bar height is distance from centre; colour is direction.
          </span>
        </div>
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="mb-kicker">{friend ? `Cooking for ${friend.n}` : ''}</span>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          {friend?.cooking ?? ''}
        </p>
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
          {friend?.note ?? ''}
        </p>
      </Card>

      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="mb-kicker">Meals that would suit this week</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {meals.map((m) => (
            <Tag key={m.id} onClick={() => navigate(`/meals/${m.id}`)}>
              {m.n}
            </Tag>
          ))}
        </div>
      </Card>
    </div>
  );
}
