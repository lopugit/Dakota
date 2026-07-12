import { useState, type FormEvent, type ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, Input } from '@/components';
import { useLogin, useSignup, useThingtimeAuth } from '@/lib/queries';

type Mode = 'signin' | 'signup';
type Provider = 'dakota' | 'thingtime';

function friendlyError(message: string, mode: Mode, provider: Provider): string {
  if (provider === 'thingtime') {
    if (message.includes('401')) return 'That Thingtime username and password don’t match.';
    if (message.includes('409')) return 'That Thingtime username or email is already taken.';
    if (message.includes('400')) {
      return mode === 'signup'
        ? 'Check the username and email, and give the password at least eight characters.'
        : 'Check the Thingtime username and password.';
    }
    if (message.includes('502')) return 'Thingtime can’t be reached right now — try again shortly.';
    return 'Something didn’t work — try again in a moment.';
  }
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
  const thingtime = useThingtimeAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [provider, setProvider] = useState<Provider>('dakota');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const busy = login.isPending || signup.isPending || thingtime.isPending;
  const onThingtime = provider === 'thingtime';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    try {
      if (onThingtime) {
        await thingtime.mutateAsync({
          mode,
          username,
          password,
          ...(mode === 'signup' ? { email, name: name.trim() } : {}),
        });
      } else if (mode === 'signup') {
        await signup.mutateAsync({ email, password, name: name.trim() });
      } else {
        await login.mutateAsync({ email, password });
      }
      navigate('/');
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : '', mode, provider));
    }
  };

  const field = (
    id: string,
    label: string,
    input: ReactElement,
    hint?: string,
  ) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'var(--text-muted)' }} htmlFor={id}>
        {label}
      </label>
      {input}
      {hint && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--surface-page)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
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
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: 30,
              letterSpacing: '-0.015em',
              lineHeight: 1.15,
            }}
          >
            {onThingtime
              ? mode === 'signup'
                ? 'Create a Thingtime account'
                : 'Sign in with Thingtime'
              : mode === 'signup'
                ? 'Create your account'
                : 'Sign in'}
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)' }}>
            {onThingtime
              ? 'Your diary, horses and lessons — kept safe on Thingtime.'
              : 'Your diary, horses and lessons — kept quietly in one place.'}
          </p>
        </div>

        <Card style={{ padding: 20 }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {onThingtime &&
              field(
                'auth-username',
                'Thingtime username',
                <Input
                  id="auth-username"
                  required
                  autoComplete="username"
                  placeholder="your-thingtime-name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />,
              )}
            {mode === 'signup' &&
              field(
                'auth-name',
                'Display name',
                <Input
                  id="auth-name"
                  autoComplete="name"
                  placeholder="How the circle sees you"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />,
              )}
            {(!onThingtime || mode === 'signup') &&
              field(
                'auth-email',
                'Email',
                <Input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />,
              )}
            {field(
              'auth-password',
              'Password',
              <Input
                id="auth-password"
                type="password"
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />,
              mode === 'signup' ? 'At least eight characters.' : undefined,
            )}
            {error && (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
            )}
            <Button variant="primary" type="submit" disabled={busy}>
              {onThingtime
                ? mode === 'signup'
                  ? 'Create Thingtime account'
                  : 'Sign in with Thingtime'
                : mode === 'signup'
                  ? 'Create account'
                  : 'Sign in'}
            </Button>
          </form>
        </Card>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ flex: 1, height: 1, background: 'var(--border-soft, currentColor)', opacity: 0.2 }} />
          <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>or</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border-soft, currentColor)', opacity: 0.2 }} />
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            setError('');
            setProvider(onThingtime ? 'dakota' : 'thingtime');
          }}
        >
          {onThingtime ? 'Use a Dakota email account' : '✦ Continue with Thingtime'}
        </Button>

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
            {onThingtime
              ? 'Signing in with Thingtime keeps your yard on thingtime.com — the same account works in every Thingtime app.'
              : "Signed out, you can follow the circle's live feed — or switch on sample data in Profile to practise with the example diary."}
          </p>
        </div>
      </div>
    </div>
  );
}
