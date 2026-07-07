import React from 'react';
import { Card } from '../../components/core/Card';
import { Button } from '../../components/core/Button';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Dialog } from '../../components/feedback/Dialog';
import { BalanceMeter } from '../../components/brand/BalanceMeter';

function describe(v) {
  if (v > 0.35) return 'More yang';
  if (v > 0.1) return 'Slightly yang';
  if (v >= -0.1) return 'Near balance';
  if (v >= -0.35) return 'Slightly yin';
  return 'More yin';
}

export function CareScreen() {
  const [people, setPeople] = React.useState([
    { name: 'Yuki', relation: 'Partner', v: -0.1 },
    { name: 'Dad', relation: 'Parent', v: 0.45 },
  ]);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [relation, setRelation] = React.useState('Partner');

  const add = () => {
    if (!name.trim()) return;
    setPeople([...people, { name: name.trim(), relation, v: 0 }]);
    setName('');
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Card className="rows">
        <div className="row">
          <div className="row-main">
            <div className="row-title">Tonight's dinner</div>
            <div className="row-sub">Kabocha stew · serves {people.length + 1} · a little extra ginger for Dad</div>
          </div>
        </div>
      </Card>

      <div className="sect">People you cook for</div>
      <Card className="rows">
        {people.map((p) => (
          <div className="row" key={p.name}>
            <div className="row-main">
              <div className="row-title">{p.name}</div>
              <div className="row-sub">{p.relation} · {describe(p.v)}</div>
            </div>
            <BalanceMeter value={p.v} size="sm" showLabels={false} style={{ width: 96 }} />
          </div>
        ))}
      </Card>

      <Button variant="secondary" onClick={() => setOpen(true)}>Add someone</Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Add someone"
        footer={
          <React.Fragment>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={add}>Add</Button>
          </React.Fragment>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4 }}>
          <Input label="Name" placeholder="e.g. Yuki" value={name} onChange={(e) => setName(e.target.value)} />
          <Select label="Relationship" value={relation} onChange={(e) => setRelation(e.target.value)}>
            <option>Partner</option>
            <option>Parent</option>
            <option>Child</option>
            <option>Friend</option>
            <option>Client</option>
          </Select>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
