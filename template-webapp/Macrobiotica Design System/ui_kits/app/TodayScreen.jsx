import React from 'react';
import { Card } from '../../components/core/Card';
import { Button } from '../../components/core/Button';
import { IconButton } from '../../components/core/IconButton';
import { BalanceMeter } from '../../components/brand/BalanceMeter';
import { Icon } from '../../components/brand/Icon';

export function TodayScreen({ balance = 0.2, balanceNote = 'Slightly yang', mealsLogged = 2, meals = [], onLogDinner }) {
  return (
    <React.Fragment>
      <Card>
        <div className="mb-caps" style={{ marginBottom: 14 }}>Your balance</div>
        <BalanceMeter value={balance} label={balanceNote} />
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
          Based on {mealsLogged} {mealsLogged === 1 ? 'meal' : 'meals'} logged today
        </div>
      </Card>

      <div className="sect">Meals</div>
      <Card className="rows">
        {meals.map((meal) => (
          <div className="row" key={meal.name}>
            <div className="row-main">
              <div className="row-title">{meal.name}</div>
              <div className="row-sub">{meal.items || 'Not yet logged'}</div>
            </div>
            {meal.items
              ? <span className="row-val">{meal.value > 0 ? '+' : ''}{meal.value.toFixed(1)}</span>
              : <Button size="sm" onClick={onLogDinner}>Log</Button>}
          </div>
        ))}
      </Card>

      <div className="sect">Today's practice</div>
      <Card className="rows">
        <div className="row">
          <Icon name="book-open" size={20} color="var(--text-muted)" />
          <div className="row-main">
            <div className="row-title">Chewing well</div>
            <div className="row-sub">Foundations of Balance · 5 min read</div>
          </div>
          <IconButton size="sm" aria-label="Open lesson"><Icon name="chevron-right" size={16} /></IconButton>
        </div>
      </Card>
    </React.Fragment>
  );
}
