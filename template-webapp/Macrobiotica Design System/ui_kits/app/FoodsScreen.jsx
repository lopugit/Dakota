import React from 'react';
import { Card } from '../../components/core/Card';
import { Tag } from '../../components/core/Tag';
import { BalanceMeter } from '../../components/brand/BalanceMeter';

const FOODS = [
  { name: 'Brown rice', cat: 'Grains', v: 0 },
  { name: 'Millet', cat: 'Grains', v: 0.05 },
  { name: 'Kabocha squash', cat: 'Vegetables', v: 0.1 },
  { name: 'Daikon', cat: 'Vegetables', v: -0.25 },
  { name: 'Shiitake', cat: 'Vegetables', v: -0.4 },
  { name: 'Azuki beans', cat: 'Beans', v: 0.15 },
  { name: 'Tofu', cat: 'Beans', v: -0.3 },
  { name: 'Kombu', cat: 'Sea vegetables', v: 0.2 },
  { name: 'Miso', cat: 'Fermented', v: 0.35 },
  { name: 'Umeboshi', cat: 'Fermented', v: 0.55 },
  { name: 'Apple', cat: 'Fruit', v: -0.35 },
];

const CATS = ['All', 'Grains', 'Vegetables', 'Beans', 'Sea vegetables', 'Fermented', 'Fruit'];

export function FoodsScreen() {
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('All');

  const shown = FOODS.filter((f) =>
    (cat === 'All' || f.cat === cat) &&
    f.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <React.Fragment>
      <input
        className="mb-input"
        placeholder="Search foods"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search foods"
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {CATS.map((c) => (
          <Tag key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Tag>
        ))}
      </div>
      <Card className="rows">
        {shown.map((f) => (
          <div className="row" key={f.name}>
            <div className="row-main">
              <div className="row-title">{f.name}</div>
              <div className="row-sub">{f.cat}</div>
            </div>
            <BalanceMeter value={f.v} size="sm" showLabels={false} style={{ width: 96 }} />
          </div>
        ))}
        {shown.length === 0 && (
          <div className="row" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 0' }}>
              Nothing here yet — try another word.
            </span>
          </div>
        )}
      </Card>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        Left is yin 陰 · right is yang 陽 · center is balance
      </div>
    </React.Fragment>
  );
}
