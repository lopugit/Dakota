import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, Input } from '@/components';
import { useLogin, useSignup } from '@/lib/queries';

type Mode = 'signin' | 'signup';

function friendlyError(message: string, mode: Mode): string {
  if (message.includes('401')) return 'That email and password don’t match.';
  if (message.includes('409')) return 'There’s already an account with that email.';
  if (message.includes('400')) {
    return mode === 'signup'
      ? 'Check the email address, and give the password at least eight characters.'
      : 'Check the email address and password.';
  }
  return 'Something didn’t work — try again in a moment.';
}

/** Standalone auth page — outside the app shell, same quiet language. */
export function AuthScreen() {
  const navigate = useNavigate();
  const login = useLogin();
  const signup = useSignup();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const busy = login.isPending || signup.isPending;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    try {
      if (mode === 'signup') {
        await signup.mutateAsync({ email, password, name: name.trim() });
      } else {
        await login.mutateAsync({ email, password });
      }
      navigate('/');
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : '', mode));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-page)',
        color: 'var(--text-primary)',
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        padding: '0 20px',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'var(--spectrum-gradient)',
          zIndex: 80,
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '64px 0 40px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="dk-wordmark" style={{ fontSize: 21 }}>
            Dakota
          </span>
          <h1
            style={{
              margin: '10px 0 0',
              fontFamily: "'Newsreader', Georgia, serif",
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: '-0.015em',
              lineHeight: 1.15,
            }}
          >
            {mode === 'signup' ? 'Create your account' : 'Sign in'}
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>
            Your diary, horses and lessons — kept quietly in one place.
          </p>
        </div>

        <Card style={{ padding: 20 }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, color: 'var(--text-muted)' }} htmlFor="auth-name">
                  Display name
                </label>
                <Input
                  id="auth-name"
                  autoComplete="name"
                  placeholder="How the circle sees you"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)' }} htmlFor="auth-email">
                Email
              </label>
              <Input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)' }} htmlFor="auth-password">
                Password
              </label>
              <Input
                id="auth-password"
                type="password"
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === 'signup' && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  At least eight characters.
                </span>
              )}
            </div>
            {error && (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
            )}
            <Button variant="primary" type="submit" disabled={busy}>
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setError('');
              setMode(mode === 'signup' ? 'signin' : 'signup');
            }}
          >
            {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            ← Back to the app
          </Button>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 12,
              color: 'var(--text-faint)',
              textAlign: 'center',
            }}
          >
            Signed out, you can follow the circle's live feed — or switch on sample data in
            Profile to practise with the example diary.
          </p>
        </div>
      </div>
    </div>
  );
}
