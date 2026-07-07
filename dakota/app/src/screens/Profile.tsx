// Profile — your riding life in numbers, your details, and how Dakota behaves.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input, Switch, ThemeToggle } from '@/components';
import {
  useAuth,
  useCatalog,
  useHorses,
  useLog,
  useLogout,
  useProfile,
  useSetDataSource,
  useUpdateProfile,
} from '@/lib/queries';
import { dateKey, getDay } from '@/lib/day';
import { sampleModeEnabled, setSampleMode } from '@/lib/sample';
import { sessionStreak } from '@shared/derive';

const mono = { fontFamily: 'var(--font-mono)' } as const;
const serif = { fontFamily: "'Newsreader', Georgia, serif" } as const;

const settingsRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  minHeight: 44,
  padding: '12px 0',
} as const;

/** Controlled input with local draft state; saves on blur when the value changed. */
function EditableRow({
  id,
  label,
  value,
  placeholder,
  inputMode,
  onSave,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  inputMode?: 'numeric';
  onSave: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        {label}
      </label>
      <Input
        id={id}
        value={draft}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const next = draft.trim();
          if (next !== value) onSave(next);
        }}
      />
    </div>
  );
}

export function ProfileScreen() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: catalog } = useCatalog();
  const { data: log } = useLog();
  const { data: profile } = useProfile();
  const { data: horses } = useHorses();
  const { data: auth } = useAuth();
  const updateProfile = useUpdateProfile();
  const setDataSource = useSetDataSource();
  const logout = useLogout();

  const [anonSample, setAnonSample] = useState(sampleModeEnabled);

  const user = auth?.user ?? null;
  const settings = profile?.settings ?? { reminders: true, publicProfile: false };

  const sample = user ? user.dataSource === 'demo' : anonSample;
  const onSampleChange = (next: boolean) => {
    if (user) {
      setDataSource.mutate(next ? 'demo' : 'prod');
    } else {
      setSampleMode(next);
      setAnonSample(next);
      qc.invalidateQueries();
    }
  };

  // ---- stats ----
  const now = new Date();
  const monthPrefix = dateKey(now).slice(0, 7);
  const sessionsThisMonth = Object.entries(log ?? {}).reduce(
    (a, [key, day]) => (key.startsWith(monthPrefix) ? a + day.sessions.length : a),
    0,
  );
  const streak = sessionStreak((key) => getDay(log, key), dateKey, now);
  const lessonsRead =
    Object.values(profile?.lessonsDone ?? {}).filter(Boolean).length +
    (catalog?.courses ?? []).reduce((a, c) => a + c.lessons.filter((l) => l.done).length, 0);
  const herdCount = (horses ?? []).length;

  const tiles = [
    { label: 'Sessions this month', value: sessionsThisMonth },
    { label: 'Session streak', value: streak },
    { label: 'Lessons read', value: lessonsRead },
    { label: 'Horses', value: herdCount },
  ];

  return (
    <div className="dk-screen">
      {/* Your riding life */}
      <Card style={{ padding: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 12,
            textAlign: 'center',
          }}
        >
          {tiles.map((t) => (
            <div
              key={t.label}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              <span className="dk-kicker">{t.label}</span>
              <span style={{ ...serif, fontSize: 22, fontWeight: 500, lineHeight: 1.1 }}>
                {t.value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* About you */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span className="dk-kicker">About you</span>
        <EditableRow
          id="dk-profile-name"
          label="Name"
          value={profile?.name ?? ''}
          placeholder="Add your name"
          onSave={(name) => updateProfile.mutate({ name })}
        />
        <EditableRow
          id="dk-profile-yard"
          label="Yard name"
          value={profile?.yardName ?? ''}
          placeholder="Where the horses live"
          onSave={(yardName) => updateProfile.mutate({ yardName })}
        />
        <EditableRow
          id="dk-profile-since"
          label="Riding since"
          value={profile?.since ?? ''}
          placeholder="Year, e.g. 2012"
          inputMode="numeric"
          onSave={(since) => updateProfile.mutate({ since })}
        />
      </Card>

      {/* Settings */}
      <Card style={{ padding: '8px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={settingsRow}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Care reminders</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              A quiet word when farrier, worming or dental care comes due.
            </span>
          </div>
          <Switch
            checked={settings.reminders}
            aria-label="Care reminders"
            onChange={(next) =>
              updateProfile.mutate({ settings: { ...settings, reminders: next } })
            }
          />
        </div>
        <div style={{ ...settingsRow, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Public profile</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Let friends in your circle see your sessions and rides.
            </span>
          </div>
          <Switch
            checked={settings.publicProfile}
            aria-label="Public profile"
            onChange={(next) =>
              updateProfile.mutate({ settings: { ...settings, publicProfile: next } })
            }
          />
        </div>
        <div style={{ ...settingsRow, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Appearance</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Light or dark, whichever suits the hour.
            </span>
          </div>
          <ThemeToggle />
        </div>
        <div style={{ ...settingsRow, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Example data</span>
            <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
              Browse with the example yard — two horses, four weeks of diary, and a friendly
              circle.
            </span>
          </div>
          <Switch checked={sample} aria-label="Example data" onChange={onSampleChange} />
        </div>
      </Card>

      {/* Account */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="dk-kicker">Account</span>
        {user ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              minHeight: 44,
            }}
          >
            <span style={{ ...mono, fontSize: 13, color: 'var(--text-secondary)', minWidth: 0 }}>
              {user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout.mutate(undefined, { onSuccess: () => navigate('/') })}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              You&rsquo;re browsing as a guest.
            </p>
            <div>
              <Button variant="primary" size="sm" onClick={() => navigate('/auth')}>
                Sign in or create an account
              </Button>
            </div>
          </>
        )}
      </Card>

      <p
        style={{
          margin: 0,
          padding: '2px 4px 10px',
          textAlign: 'center',
          fontSize: 12,
          color: 'var(--text-faint)',
        }}
      >
        Dakota keeps your notes judgment-free. A hot day is data, not a verdict.
      </p>
    </div>
  );
}
