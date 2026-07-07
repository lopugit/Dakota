// Device-level sample-data preference for signed-out visitors.
// Signed-in accounts carry the preference on the account instead
// (users.dataSource); the server gives the account field precedence.
export const SAMPLE_COOKIE = 'mb-sample';

export function sampleModeEnabled(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').includes(`${SAMPLE_COOKIE}=1`);
}

export function setSampleMode(on: boolean): void {
  document.cookie = `${SAMPLE_COOKIE}=${on ? '1' : '0'}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}
