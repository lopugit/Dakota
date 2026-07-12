// Map-painting geometry for the paddocks editor. Everything works on the
// farm's 0–100 grid; shapes serialize to the "x,y x,y …" strings stored on
// Paddock.shape and FarmFeature.pts.

export type Pt = [number, number];

export function parsePts(s: string): Pt[] {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((pair) => {
      const [x, y] = pair.split(',').map(Number);
      return [x, y] as Pt;
    })
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
}

const fmtN = (n: number): string => String(Math.round(n * 10) / 10);

export function fmtPts(pts: Pt[]): string {
  return pts.map(([x, y]) => `${fmtN(x)},${fmtN(y)}`).join(' ');
}

export const clamp01 = (n: number): number => Math.min(100, Math.max(0, n));

/** Snap to the 1-unit grid — keeps hand-painted shapes tidy. */
export const snap = (n: number): number => clamp01(Math.round(n));
export const snapPt = ([x, y]: Pt): Pt => [snap(x), snap(y)];

export const dist = (a: Pt, b: Pt): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function centroid(pts: Pt[]): Pt {
  if (pts.length === 0) return [50, 50];
  const [sx, sy] = pts.reduce(([ax, ay], [x, y]) => [ax + x, ay + y], [0, 0]);
  return [sx / pts.length, sy / pts.length];
}

/** Shoelace area in grid units². */
export function polygonArea(pts: Pt[]): number {
  let sum = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

// The demo property maps ~16 acres onto the grid, ≈550 units² per acre — a
// friendly default; the acres field stays hand-editable.
export function estimateAcres(pts: Pt[]): number {
  const acres = polygonArea(pts) / 550;
  return Math.max(0.5, Math.round(acres * 2) / 2);
}

export function pointInPolygon([px, py]: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function distToSegment(p: Pt, a: Pt, b: Pt): number {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Distance from a point to an open polyline (closed=true also checks the last edge back to the first). */
export function distToPath(p: Pt, pts: Pt[], closed = false): number {
  if (pts.length === 1) return dist(p, pts[0]);
  let best = Infinity;
  const last = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < last; i++) {
    best = Math.min(best, distToSegment(p, pts[i], pts[(i + 1) % pts.length]));
  }
  return best;
}

/** Shift every point by [dx, dy], clamping the delta so the shape stays on the grid. */
export function movePts(pts: Pt[], dx: number, dy: number): Pt[] {
  const xs = pts.map(([x]) => x);
  const ys = pts.map(([, y]) => y);
  const cdx = Math.max(-Math.min(...xs), Math.min(100 - Math.max(...xs), dx));
  const cdy = Math.max(-Math.min(...ys), Math.min(100 - Math.max(...ys), dy));
  return pts.map(([x, y]) => [x + cdx, y + cdy] as Pt);
}

// ---- preset shapes ----

export type PaddockPreset = 'square' | 'wide' | 'tall' | 'round' | 'l-shape';
export type WaterPreset = 'trough' | 'dam';

function rect([cx, cy]: Pt, w: number, h: number): Pt[] {
  const pts: Pt[] = [
    [cx - w / 2, cy - h / 2],
    [cx + w / 2, cy - h / 2],
    [cx + w / 2, cy + h / 2],
    [cx - w / 2, cy + h / 2],
  ];
  return keepOnGrid(pts).map(snapPt);
}

function ngon([cx, cy]: Pt, r: number, sides: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return keepOnGrid(pts).map(snapPt);
}

/** Slide a stamped shape back onto the grid rather than clipping it. */
function keepOnGrid(pts: Pt[]): Pt[] {
  const xs = pts.map(([x]) => x);
  const ys = pts.map(([, y]) => y);
  const dx = Math.max(0, -Math.min(...xs)) - Math.max(0, Math.max(...xs) - 100);
  const dy = Math.max(0, -Math.min(...ys)) - Math.max(0, Math.max(...ys) - 100);
  return pts.map(([x, y]) => [x + dx, y + dy] as Pt);
}

export function paddockPreset(preset: PaddockPreset, at: Pt): Pt[] {
  switch (preset) {
    case 'square':
      return rect(at, 24, 24);
    case 'wide':
      return rect(at, 34, 22);
    case 'tall':
      return rect(at, 22, 34);
    case 'round':
      return ngon(at, 14, 12);
    case 'l-shape': {
      const [cx, cy] = at;
      const pts: Pt[] = [
        [cx - 15, cy - 15],
        [cx + 15, cy - 15],
        [cx + 15, cy],
        [cx, cy],
        [cx, cy + 15],
        [cx - 15, cy + 15],
      ];
      return keepOnGrid(pts).map(snapPt);
    }
  }
}

export function waterPreset(preset: WaterPreset, at: Pt): Pt[] {
  if (preset === 'trough') return rect(at, 3, 2);
  return ngon(at, 5, 8);
}

/** Default gate for a plain tap — a short bar the select tool can re-angle. */
export function gateAt(at: Pt): Pt[] {
  const [x, y] = snapPt(at);
  return [
    [clamp01(x - 2), y],
    [clamp01(x + 2), y],
  ];
}

// ---- naming & ids ----

export function freshId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

/** "New paddock", "New paddock 2", … skipping names already in use. */
export function nextName(base: string, taken: string[]): string {
  if (!taken.includes(base)) return base;
  for (let i = 2; ; i++) {
    const name = `${base} ${i}`;
    if (!taken.includes(name)) return name;
  }
}
