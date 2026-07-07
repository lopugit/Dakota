import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Badge, Button, Card, Input, Switch, ThemeToggle } from '@/components';
import {
  useAuth,
  useCatalog,
  useLog,
  useLogout,
  useProfile,
  useSetDataSource,
  useUpdateProfile,
} from '@/lib/queries';
import { getDay } from '@/lib/day';
import { sampleModeEnabled, setSampleMode } from '@/lib/sample';
import { dateKey } from '@shared/mb-data';
import { checkinStreak } from '@shared/derive';

const mono = { fontFamily: 'var(--font-mono)' } as const;

export function ProfileScreen() {
  const navigate = useNavigate();
  const { data: catalog } = useCatalog();
  const { data: log } = useLog();
  const { data: profile } = useProfile();
  const { data: auth } = useAuth();
  const updateProfile = useUpdateProfile();
  const setDataSource = useSetDataSource();
  const logout = useLogout();

  const qc = useQueryClient();
  const [anonSample, setAnonSample] = useState(sampleModeEnabled);

  const user = auth?.user ?? null;
  const name = profile?.name ?? '';
  const settings = profile?.settings ?? { reminders: true, publicProfile: false };

  const sampleOn = user ? user.dataSource === 'demo' : anonSample;
  const onSampleChange = (next: boolean) => {
    if (user) {
      setDataSource.mutate(next ? 'demo' : 'prod');
    } else {
      setSampleMode(next);
      setAnonSample(next);
      qc.invalidateQueries();
    }
  };

  const now = new Date();
  const dayFor = (key: string) => getDay(log, key);
  const streak = checkinStreak(dayFor, dateKey, now);
  let checkTotal = 0;
  let mealTotal = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const day = dayFor(dateKey(d));
    checkTotal += day.checkins.length;
    mealTotal += day.meals.length;
  }
  const lessonsDone = (catalog?.courses ?? []).reduce(
    (a, c) => a + c.lessons.filter((l) => l.done || !!profile?.lessonsDone[l.id]).length,
    0,
  );

  const settingsRow = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '12px 0',
  } as const;

  return (
    <div className="mb-screen">
      {/* Identity */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={(name || 'MB').trim().slice(0, 2).toUpperCase()} size={56} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: 24,
                fontWeight: 500,
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
              }}
            >
              {name.trim() || 'Your profile'}
            </span>
            <span style={{ ...mono, fontSize: 11, color: 'var(--text-muted)' }}>
              practising since June 2026
            </span>
          </div>
          <Badge tone="green">Leans a little yang</Badge>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)' }} htmlFor="mb-display-name">
            Display name
          </label>
          <Input
            id="mb-display-name"
            placeholder="Add your name"
            value={name}
            onChange={(e) => updateProfile.mutate({ name: e.target.value })}
          />
        </div>
      </Card>

      {/* Stats */}
      <Card style={{ padding: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ ...mono, fontSize: 22 }}>{streak}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>day streak</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ ...mono, fontSize: 22 }}>{checkTotal}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>check-ins</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ ...mono, fontSize: 22 }}>{mealTotal}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>meals logged</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ ...mono, fontSize: 22 }}>{lessonsDone}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>lessons done</span>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={settingsRow}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Theme</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Light is yang, dark is yin.
            </span>
          </div>
          <ThemeToggle />
        </div>
        <div style={{ ...settingsRow, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Daily check-in reminder</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              A quiet nudge, morning and evening.
            </span>
          </div>
          <Switch
            checked={settings.reminders}
            aria-label="Daily check-in reminder"
            onChange={(next) =>
              updateProfile.mutate({ settings: { ...settings, reminders: next } })
            }
          />
        </div>
        <div style={{ ...settingsRow, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Share progress to feed</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Friends can see streaks and check-in milestones.
            </span>
          </div>
          <Switch
            checked={settings.publicProfile}
            aria-label="Share progress to feed"
            onChange={(next) =>
              updateProfile.mutate({ settings: { ...settings, publicProfile: next } })
            }
          />
        </div>
        <div style={{ ...settingsRow, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Sample data</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Practise with the example diary and circle — handy for tutorials and previews.
            </span>
          </div>
          <Switch checked={sampleOn} aria-label="Sample data" onChange={onSampleChange} />
        </div>
      </Card>

      {/* Account */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="mb-kicker">Account</span>
        {user ? (
          <>
            <span style={{ ...mono, fontSize: 13, color: 'var(--text-secondary)' }}>
              {user.email}
            </span>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
              {user.dataSource === 'demo'
                ? 'Using the sample data — switch it off above to return to your own practice.'
                : 'Keeping your own practice. Everything you log here is yours.'}
            </p>
          </>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {anonSample
                ? "You're practising with the sample data. Create an account to keep a diary of your own."
                : "You're seeing the circle's live feed. Create an account to keep a diary of your own."}
            </p>
            <div>
              <Button variant="primary" size="sm" onClick={() => navigate('/auth')}>
                Sign in or create account
              </Button>
            </div>
          </>
        )}
      </Card>

      {user && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/') })}
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
