// Ride-track helpers: GPS traces → inline SVG, plus live-tracking utilities.
// Tracks render as self-contained SVG paths (no map tiles) so ride cards work
// offline and in any theme.
import type { RidePoint } from '@shared/types';

export { haversineKm, rideStats } from '@shared/derive';

export interface TrackBox {
  w: number;
  h: number;
  path: string;
  start: [number, number];
  end: [number, number];
}

/**
 * Fit a GPS trace into a w×h box (padding included), preserving aspect ratio
 * via an equirectangular projection around the track's centre latitude.
 */
export function trackToSvg(points: RidePoint[], w = 300, h = 180, pad = 12): TrackBox | null {
  if (points.length < 2) return null;
  const midLa = points.reduce((a, p) => a + p.la, 0) / points.length;
  const kx = Math.cos((midLa * Math.PI) / 180);
  const xs = points.map((p) => p.ln * kx);
  const ys = points.map((p) => -p.la); // north up
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1e-9;
  const spanY = maxY - minY || 1e-9;
  const scale = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);
  const ox = (w - spanX * scale) / 2;
  const oy = (h - spanY * scale) / 2;
  const px = (i: number): [number, number] => [
    Math.round((ox + (xs[i] - minX) * scale) * 10) / 10,
    Math.round((oy + (ys[i] - minY) * scale) * 10) / 10,
  ];
  let d = '';
  for (let i = 0; i < points.length; i++) {
    const [x, y] = px(i);
    d += (i === 0 ? 'M' : 'L') + x + ' ' + y;
  }
  return { w, h, path: d, start: px(0), end: px(points.length - 1) };
}

export const fmtKm = (km: number): string =>
  km >= 10 ? km.toFixed(1) + ' km' : km.toFixed(2) + ' km';

export const fmtMin = (min: number): string => {
  const m = Math.round(min);
  if (m < 60) return m + ' min';
  return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min';
};

export const fmtKmh = (kmh: number): string => kmh.toFixed(1) + ' km/h';

/** Duration clock for the live tracker: "47:12" / "1:03:45". */
export function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const p = (x: number) => String(x).padStart(2, '0');
  return hh > 0 ? `${hh}:${p(mm)}:${p(ss)}` : `${mm}:${p(ss)}`;
}
