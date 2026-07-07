export interface AvatarProps {
  initials: string;
  /** Diameter in px (24 comment · 28 cook note · 36 post · 38 friend row · 52 friend header · 56 profile). */
  size?: number;
}

/** Initials avatar — sunken circle, mono initials. */
export function Avatar({ initials, size = 36 }: AvatarProps) {
  const fontSize = size <= 24 ? 9 : size <= 28 ? 10 : size <= 36 ? 11 : size <= 38 ? 12 : size <= 52 ? 15 : 16;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--surface-sunken)',
        fontFamily: 'var(--font-mono)',
        fontSize,
        color: 'var(--text-secondary)',
        flex: 'none',
      }}
    >
      {initials}
    </span>
  );
}
