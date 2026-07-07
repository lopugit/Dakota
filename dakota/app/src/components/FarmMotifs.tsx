import type { CSSProperties, ReactNode } from 'react';

/* Little-farm decorations — flat, colourful SVG motifs drawn from the --m-*
   motif palette (tokens/colors.css) so they stay themeable. Purely ornamental:
   every rendering is aria-hidden. */

export type MotifName = 'sunflower' | 'carrot' | 'strawhat' | 'wheat' | 'tulip' | 'horseshoe';

const PETALS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

const SHAPES: Record<MotifName, ReactNode> = {
  sunflower: (
    <g strokeLinejoin="round">
      <g fill="var(--m-sun)" stroke="var(--m-sun-deep)" strokeWidth={1}>
        {PETALS.map((a) => (
          <ellipse key={a} cx={24} cy={9} rx={4} ry={8} transform={`rotate(${a} 24 24)`} />
        ))}
      </g>
      <circle cx={24} cy={24} r={9} fill="var(--m-sun-core)" />
      <circle cx={24} cy={24} r={6} fill="var(--m-sun-core2)" />
      <circle cx={24} cy={24} r={2.4} fill="var(--m-sun-core)" />
    </g>
  ),
  carrot: (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M17 17 Q24 14 31 17 L25.5 43 Q24 45 22.5 43 Z" fill="var(--m-carrot)" stroke="var(--m-carrot-deep)" strokeWidth={1.2} />
      <path d="M20 23l2 1M23 30l2 .6M26 22l1.6 1" stroke="var(--m-carrot-lite)" strokeWidth={1.4} fill="none" />
      <g fill="var(--m-leaf)" stroke="var(--m-leaf-deep)" strokeWidth={1}>
        <path d="M24 16 Q23 6 27 3 Q29 9 26 16 Z" />
        <path d="M23 16 Q16 9 11 10 Q15 17 22 17 Z" />
        <path d="M25 16 Q32 9 37 11 Q33 18 26 17 Z" />
      </g>
    </g>
  ),
  strawhat: (
    <g strokeLinejoin="round">
      <ellipse cx={24} cy={34} rx={21} ry={7.5} fill="var(--m-straw)" stroke="var(--m-straw-deep)" strokeWidth={1.2} />
      <path d="M13 34 Q13 17 24 17 Q35 17 35 34 Z" fill="var(--m-straw)" stroke="var(--m-straw-deep)" strokeWidth={1.2} />
      <path d="M13.2 32 Q24 37 34.8 32 L34.4 29 Q24 33 13.6 29 Z" fill="var(--m-leaf)" stroke="var(--m-leaf-deep)" strokeWidth={1} />
      <ellipse cx={24} cy={34} rx={10.5} ry={3.2} fill="var(--m-straw-deep)" opacity={0.35} />
    </g>
  ),
  wheat: (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 43 V21 M24 39 Q17.5 33 17 25 M24 39 Q30.5 33 31 25" fill="none" stroke="var(--m-straw-deep)" strokeWidth={1.6} />
      <g fill="var(--m-straw)" stroke="var(--m-straw-deep)" strokeWidth={1}>
        <path d="M24 22 Q19.5 15 24 5 Q28.5 15 24 22 Z" />
        <path d="M17 26 Q11.5 21 14 11 Q21.5 17 17 26 Z" />
        <path d="M31 26 Q36.5 21 34 11 Q26.5 17 31 26 Z" />
      </g>
      <g fill="none" stroke="var(--m-straw-deep)" strokeWidth={0.9}>
        <path d="M21.5 17 L24 18.5 L26.5 17 M21.5 12.5 L24 14 L26.5 12.5 M22 8.5 L24 9.8 L26 8.5" />
        <path d="M14.8 21.5 L17 22.6 L18.2 20.6 M15.6 17.4 L17.8 18.4 L18.8 16.4" />
        <path d="M33.2 21.5 L31 22.6 L29.8 20.6 M32.4 17.4 L30.2 18.4 L29.2 16.4" />
      </g>
      <path d="M20.5 41 h7" stroke="var(--m-soil)" strokeWidth={2.6} strokeLinecap="round" />
    </g>
  ),
  tulip: (
    <g strokeLinejoin="round">
      <path d="M24 44 V24" stroke="var(--m-leaf-deep)" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M24 36 Q15 33 12 25 Q21 25 24 33 Z" fill="var(--m-leaf)" stroke="var(--m-leaf-deep)" strokeWidth={1} />
      <path d="M15 15 Q15 9 18 6 Q19 12 21 15 Q21 9 24 5 Q27 9 27 15 Q29 12 30 6 Q33 9 33 15 Q33 25 24 25 Q15 25 15 15 Z" fill="var(--m-petal)" stroke="var(--m-petal-deep)" strokeWidth={1.1} />
    </g>
  ),
  horseshoe: (
    <g strokeLinejoin="round">
      <path d="M14 44 Q7 34 9 24 Q11 8 24 8 Q37 8 39 24 Q41 34 34 44 L28 42 Q34 33 32.5 24 Q31 16 24 16 Q17 16 15.5 24 Q14 33 20 42 Z" fill="var(--m-metal)" stroke="var(--m-metal-deep)" strokeWidth={1.2} />
      <g fill="var(--m-metal-hole)">
        <circle cx={13} cy={22} r={1.4} /><circle cx={12.6} cy={30} r={1.4} /><circle cx={15} cy={38} r={1.4} />
        <circle cx={35} cy={22} r={1.4} /><circle cx={35.4} cy={30} r={1.4} /><circle cx={33} cy={38} r={1.4} />
      </g>
    </g>
  ),
};

export function Motif({
  name,
  size = 24,
  style,
}: {
  name: MotifName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', flex: 'none', ...style }}
    >
      {SHAPES[name]}
    </svg>
  );
}

const CROP: { name: MotifName; size: number; tilt: number }[] = [
  { name: 'tulip', size: 30, tilt: -6 },
  { name: 'wheat', size: 34, tilt: 4 },
  { name: 'sunflower', size: 40, tilt: 0 },
  { name: 'carrot', size: 30, tilt: 8 },
  { name: 'strawhat', size: 34, tilt: -4 },
  { name: 'horseshoe', size: 26, tilt: 10 },
];

/* A little farm growing along the bottom of a screen. `seed` rotates the crop
   so it isn't the identical row on every route; `count` trims it for the narrow rail. */
export function FarmFieldFooter({ seed = 0, count = CROP.length }: { seed?: number; count?: number }) {
  const rot = ((seed % CROP.length) + CROP.length) % CROP.length;
  const crop = [...CROP.slice(rot), ...CROP.slice(0, rot)].slice(0, count);
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        marginTop: 12,
        paddingTop: 10,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 18,
        opacity: 0.9,
      }}
    >
      {/* the ground line */}
      <div
        style={{
          position: 'absolute',
          left: 8,
          right: 8,
          bottom: 4,
          height: 2,
          borderRadius: 2,
          background:
            'linear-gradient(90deg, transparent, var(--m-leaf) 18%, var(--m-leaf) 82%, transparent)',
          opacity: 0.45,
        }}
      />
      {crop.map((c) => (
        <Motif
          key={c.name}
          name={c.name}
          size={c.size}
          style={{ transform: `rotate(${c.tilt}deg)`, transformOrigin: 'bottom center' }}
        />
      ))}
    </div>
  );
}

/* A few ambient sprigs hugging the right viewport edge — the farm around the
   edges. Fixed and non-interactive; sits above the sky wash but behind content.
   Render only on WIDE screens (see AppShell) so it never crowds the column. */
export function FarmScatter() {
  const sprigs: { name: MotifName; size: number; style: CSSProperties }[] = [
    { name: 'sunflower', size: 56, style: { top: 66, right: -12, transform: 'rotate(14deg)' } },
    { name: 'carrot', size: 34, style: { top: '44%', right: 4, transform: 'rotate(-12deg)' } },
    { name: 'wheat', size: 50, style: { bottom: 132, right: -10, transform: 'rotate(8deg)' } },
  ];
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {sprigs.map((s) => (
        <div key={s.name} style={{ position: 'absolute', opacity: 0.8, ...s.style }}>
          <Motif name={s.name} size={s.size} />
        </div>
      ))}
    </div>
  );
}
