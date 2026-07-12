import { useState } from 'react';
import { Link } from 'react-router';
import { Avatar, Badge, Button, Card, Icon, Input, Tag } from '@/components';
import { useAddHorse, useHorses, usePaddocks } from '@/lib/queries';
import type { HorseSex } from '@shared/types';
import { careDue, handsLabel, horseAge } from '@shared/derive';

const SEXES: HorseSex[] = ['mare', 'gelding', 'stallion', 'filly', 'colt'];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** First letters of the first two words, uppercased — "Dakota Blue" → "DB". */
const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export function HorsesScreen() {
  const { data: horses } = useHorses();
  const { data: paddocks } = usePaddocks();
  const addHorse = useAddHorse();

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [born, setBorn] = useState('');
  const [hands, setHands] = useState('');
  const [color, setColor] = useState('');
  const [sex, setSex] = useState<HorseSex>('mare');

  const now = new Date();
  const herd = horses ?? [];

  const paddockName = (horseId: string): string | undefined => {
    const farms = paddocks?.farms ?? [];
    for (const farm of farms) {
      const pid = farm.horses[horseId];
      if (!pid) continue;
      const name = farm.paddocks.find((p) => p.id === pid)?.n;
      if (!name) continue;
      // With several farms, say which one the horse grazes.
      return farms.length > 1 ? `${name} · ${farm.n}` : name;
    }
    return undefined;
  };

  const resetForm = () => {
    setName('');
    setBreed('');
    setBorn('');
    setHands('');
    setColor('');
    setSex('mare');
    setFormOpen(false);
  };

  const save = () => {
    if (!name.trim()) return;
    addHorse.mutate({
      name: name.trim(),
      breed: breed.trim(),
      sex,
      born: born.trim(),
      color: color.trim(),
      markings: '',
      hands: Number(hands) || 0,
      initials: initialsOf(name),
      temperament: '',
      ownership: [{ owner: 'You', from: String(now.getFullYear()) }],
      care: { farrierWeeks: 6, wormingWeeks: 12, dentalMonths: 12, vaccinationMonths: 12 },
    });
    resetForm();
  };

  return (
    <div className="dk-screen">
      <Card style={{ display: 'flex', flexDirection: 'column', padding: '14px 20px 6px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingBottom: 10,
          }}
        >
          <span className="dk-kicker">
            {horses === undefined ? 'Your herd' : `Your herd · ${horses.length}`}
          </span>
          <Button variant="secondary" size="sm" onClick={() => setFormOpen((o) => !o)}>
            Add a horse
          </Button>
        </div>

        {formOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: 14,
              background: 'var(--surface-sunken)',
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Input
              placeholder="Name — try Willow"
              aria-label="Horse name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Input
                placeholder="Breed"
                aria-label="Breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />
              <Input
                placeholder="Color — bay, grey…"
                aria-label="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Input
                placeholder="Born (YYYY)"
                aria-label="Year born"
                inputMode="numeric"
                value={born}
                onChange={(e) => setBorn(e.target.value)}
              />
              <Input
                placeholder="Height in hands — 15.2"
                aria-label="Height in hands"
                type="number"
                step={0.1}
                min={0}
                value={hands}
                onChange={(e) => setHands(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="dk-kicker">Sex</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SEXES.map((s) => (
                  <Tag key={s} active={sex === s} onClick={() => setSex(s)}>
                    {capitalize(s)}
                  </Tag>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={save} disabled={!name.trim()}>
                Save horse
              </Button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {herd.map((h) => {
            const paddock = paddockName(h.id);
            const dueCount = careDue(h.care, now).filter((d) => d.inDays <= 7).length;
            return (
              <Link
                key={h.id}
                to={`/horses/${h.id}`}
                className="dk-row dk-hoverable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '13px 0',
                  borderTop: '1px solid var(--border-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <Avatar initials={h.initials} size={40} />
                <div
                  style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{h.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {h.breed} · {h.sex} · {horseAge(h.born, now)} yo · {handsLabel(h.hands)}
                  </span>
                </div>
                {paddock && (
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 999,
                      border: '1px solid var(--border-subtle)',
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      flex: 'none',
                    }}
                  >
                    {paddock}
                  </span>
                )}
                {dueCount > 0 && <Badge tone="sacral">{dueCount} due</Badge>}
                <Icon name="chevron-right" size={16} color="var(--text-faint)" />
              </Link>
            );
          })}
          {horses !== undefined && horses.length === 0 && (
            <p
              style={{
                margin: 0,
                padding: '14px 0 12px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: 13,
                color: 'var(--text-muted)',
              }}
            >
              Your paddock is empty. Add your first horse to start the diary.
            </p>
          )}
        </div>
      </Card>

      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>
        Lineage and care live on each horse's page.
      </p>
    </div>
  );
}
