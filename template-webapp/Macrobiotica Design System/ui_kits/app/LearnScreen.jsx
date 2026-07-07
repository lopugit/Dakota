import React from 'react';
import { Card } from '../../components/core/Card';
import { Button } from '../../components/core/Button';

const COURSES = [
  { title: 'Foundations of Balance', done: 4, total: 9 },
  { title: 'The Standard Plate', done: 0, total: 7 },
  { title: 'Seasonal Cooking', done: 0, total: 6 },
  { title: 'Cooking for Others', done: 0, total: 8 },
];

export function LearnScreen() {
  return (
    <React.Fragment>
      <Card raised padding={24}>
        <div className="mb-caps" style={{ marginBottom: 10 }}>Continue</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 500,
          letterSpacing: 'var(--tracking-tight)',
          lineHeight: 1.15,
        }}>
          The energy of cooking
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 16px' }}>
          Foundations of Balance · Lesson 4 of 9
        </div>
        <div className="progress" style={{ marginBottom: 16 }}><i style={{ width: '40%' }} /></div>
        <Button size="sm">Continue lesson</Button>
      </Card>

      <div className="sect">Courses</div>
      <Card className="rows">
        {COURSES.map((c) => (
          <div className="row" key={c.title}>
            <div className="row-main">
              <div className="row-title">{c.title}</div>
              <div className="row-sub">{c.done} of {c.total} lessons</div>
            </div>
            <div className="progress" style={{ width: 64 }}>
              <i style={{ width: `${(c.done / c.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </Card>
    </React.Fragment>
  );
}
