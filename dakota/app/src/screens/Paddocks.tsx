import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Avatar, Badge, Button, Card, Icon, IconButton, Input, Tag } from '@/components';
import {
  useAddFarm, useDeleteFarm, useHorses, useMoveHorse, usePaddocks, useSaveFarm,
} from '@/lib/queries';
import { useSticky } from '@/lib/useSticky';
import {
  centroid, clamp01, dist, distToPath, estimateAcres, fmtPts, freshId, gateAt,
  movePts, nextName, paddockPreset, parsePts, pointInPolygon, polygonArea,
  snapPt, waterPreset,
} from '@/lib/farm';
import type { PaddockPreset, Pt, WaterPreset } from '@/lib/farm';
import type { BadgeTone } from '@/components';
import type { Farm, FarmFeature, FarmFeatureKind, Grass, Paddock } from '@shared/types';

const mono = { fontFamily: 'var(--font-mono)' } as const;

const GRASS_FILL: Record<Grass, string> = {
  lush: 'var(--scale-centre-soft)',
  good: 'var(--surface-sunken)',
  short: 'var(--scale-hot1-soft)',
  'eaten down': 'var(--scale-hot2-soft)',
  resting: 'transparent',
};

// Grass reads as grass: green tones for growth, warm tones for wear.
const GRASS_TONE: Record<Grass, BadgeTone> = {
  lush: 'heart',
  good: 'success',
  short: 'solar',
  'eaten down': 'sacral',
  resting: 'neutral',
};

const GRASS_ORDER: Grass[] = ['lush', 'good', 'short', 'eaten down', 'resting'];

type Tool = 'select' | 'paddock' | 'water' | 'fence' | 'gate';

const TOOLS: Array<{ id: Tool; icon: string; label: string }> = [
  { id: 'select', icon: 'mouse-pointer', label: 'Select' },
  { id: 'paddock', icon: 'square', label: 'Paddock' },
  { id: 'water', icon: 'droplets', label: 'Water' },
  { id: 'fence', icon: 'fence', label: 'Fence' },
  { id: 'gate', icon: 'door-open', label: 'Gate' },
];

const PADDOCK_PRESETS: Array<{ id: PaddockPreset | 'draw'; label: string }> = [
  { id: 'square', label: 'Square' },
  { id: 'wide', label: 'Wide' },
  { id: 'tall', label: 'Tall' },
  { id: 'round', label: 'Round' },
  { id: 'l-shape', label: 'L shape' },
  { id: 'draw', label: 'Draw' },
];

const WATER_PRESETS: Array<{ id: WaterPreset | 'draw'; label: string }> = [
  { id: 'trough', label: 'Trough' },
  { id: 'dam', label: 'Dam' },
  { id: 'draw', label: 'Draw' },
];

const FEATURE_LABEL: Record<FarmFeatureKind, string> = {
  fence: 'Fence line',
  water: 'Water',
  gate: 'Gate',
};

type Sel = { kind: 'paddock' | 'feature'; id: string };

type Drag =
  | { type: 'vertex'; sel: Sel; index: number; pts: Pt[]; origin: Pt; off: Pt; moved: boolean }
  | { type: 'shape'; sel: Sel; start: Pt; base: Pt[]; pts: Pt[]; moved: boolean }
  | { type: 'gate-draw'; start: Pt; end: Pt };

function fmtDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const blurOnEnter = (e: ReactKeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') e.currentTarget.blur();
};

/** Label anchor for painted shapes — the centroid, lightly rounded. */
const labelOf = (pts: Pt[]): [number, number] => {
  const [x, y] = centroid(pts);
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
};

export function PaddocksScreen() {
  const { data: land } = usePaddocks();
  const { data: horses } = useHorses();
  const moveHorse = useMoveHorse();
  const saveFarm = useSaveFarm();
  const addFarm = useAddFarm();
  const deleteFarm = useDeleteFarm();

  const [farmId, setFarmId] = useSticky('paddocks.farm', '');
  const [moving, setMoving] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [tool, setTool] = useState<Tool>('select');
  const [pdPreset, setPdPreset] = useState<PaddockPreset | 'draw'>('square');
  const [waPreset, setWaPreset] = useState<WaterPreset | 'draw'>('trough');
  const [draft, setDraft] = useState<Pt[]>([]);
  const [sel, setSel] = useState<Sel | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [undoStack, setUndoStack] = useState<Farm[]>([]);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // The armed remove-farm button disarms itself — deleting a farm is the one
  // action undo can't bring back.
  useEffect(() => {
    if (!confirmRemove) return;
    const timer = setTimeout(() => setConfirmRemove(false), 5000);
    return () => clearTimeout(timer);
  }, [confirmRemove]);

  const farms = land?.farms ?? [];
  const farm = farms.find((f) => f.id === farmId) ?? farms[0];
  const paddocks = farm?.paddocks ?? [];
  const features = farm?.features ?? [];
  const locations = farm?.horses ?? {};
  const moves = (farm?.moves ?? []).slice(0, 8);
  const herd = horses ?? [];

  const horsesIn = (paddockId: string) => herd.filter((h) => locations[h.id] === paddockId);
  const horseName = (id: string) => herd.find((h) => h.id === id)?.name ?? id;
  const movingHorse = herd.find((h) => h.id === moving);
  // Moves can reference a paddock on another farm (the horse came from there),
  // or one that has since been painted away.
  const paddockName = (id: string) => {
    for (const f of farms) {
      const p = f.paddocks.find((pd) => pd.id === id);
      if (p) return p.n;
    }
    return 'a removed paddock';
  };

  // ---- farm switching & management ----

  // Keeps the horse selection: pick a horse, switch farm, tap the paddock —
  // that's the cross-farm move flow the hint below promises.
  const switchFarm = (id: string) => {
    setFarmId(id);
    setSel(null);
    setDraft([]);
    setDrag(null);
    setUndoStack([]);
    setConfirmRemove(false);
  };

  const handleAddFarm = () => {
    if (addFarm.isPending) return;
    addFarm.mutate(
      { n: nextName('New farm', farms.map((f) => f.n)) },
      {
        onSuccess: (created) => {
          switchFarm(created.id);
          setEditing(true);
          setTool('select');
        },
      },
    );
  };

  const handleRemoveFarm = () => {
    if (!farm) return;
    if (!confirmRemove) {
      setConfirmRemove(true);
      return;
    }
    const rest = farms.filter((f) => f.id !== farm.id);
    deleteFarm.mutate({ id: farm.id });
    switchFarm(rest[0]?.id ?? '');
    if (rest.length === 0) setEditing(false);
  };

  // ---- painting ----

  const commit = (next: Farm, undoable = true) => {
    if (!farm) return;
    if (undoable) setUndoStack((s) => [...s.slice(-19), farm]);
    saveFarm.mutate(next);
  };

  const undo = () => {
    const prev = undoStack[undoStack.length - 1];
    if (!prev || !farm) return;
    setUndoStack((s) => s.slice(0, -1));
    setSel(null);
    setDrag(null);
    // Undo reverts the painted layout only — keep the live name, residents and
    // rotation log so a horse moved mid-edit is never stranded or duplicated.
    const horses = Object.fromEntries(
      Object.entries(farm.horses).filter(([, pid]) => prev.paddocks.some((p) => p.id === pid)),
    );
    saveFarm.mutate({ ...prev, n: farm.n, horses, moves: farm.moves });
  };

  const selectTool = (t: Tool) => {
    setTool(t);
    setDraft([]);
    setDrag(null);
  };

  const toggleEdit = () => {
    setEditing((was) => !was);
    setSel(null);
    setDraft([]);
    setDrag(null);
    setUndoStack([]);
    setConfirmRemove(false);
    setTool('select');
  };

  const evtPt = (e: ReactPointerEvent<SVGSVGElement>): Pt => {
    const el = svgRef.current;
    if (!el) return [50, 50];
    const r = el.getBoundingClientRect();
    return [
      clamp01(((e.clientX - r.left) / r.width) * 100),
      clamp01(((e.clientY - r.top) / r.height) * 100),
    ];
  };

  const storedPts = (s: Sel): Pt[] => {
    if (!farm) return [];
    if (s.kind === 'paddock') {
      const p = farm.paddocks.find((pd) => pd.id === s.id);
      return p ? parsePts(p.shape) : [];
    }
    const f = farm.features.find((ft) => ft.id === s.id);
    return f ? parsePts(f.pts) : [];
  };

  const featureOf = (s: Sel | null): FarmFeature | undefined =>
    s?.kind === 'feature' ? features.find((f) => f.id === s.id) : undefined;
  const paddockOf = (s: Sel | null): Paddock | undefined =>
    s?.kind === 'paddock' ? paddocks.find((p) => p.id === s.id) : undefined;

  /** Topmost thing under the finger — kinds in render z-order (gates above water above fences), newest first within a kind. */
  const hitTest = (pt: Pt): Sel | null => {
    const hitsFeature = (f: FarmFeature): boolean => {
      const pts = parsePts(f.pts);
      if (pts.length === 0) return false;
      if (f.kind === 'gate') return distToPath(pt, pts) < 2.5;
      if (f.kind === 'water') return pointInPolygon(pt, pts) || distToPath(pt, pts, true) < 1.5;
      return distToPath(pt, pts) < 2;
    };
    for (const kind of ['gate', 'water', 'fence'] as const) {
      for (const f of [...features].reverse()) {
        if (f.kind === kind && hitsFeature(f)) return { kind: 'feature', id: f.id };
      }
    }
    let best: Paddock | null = null;
    let bestArea = Infinity;
    for (const p of paddocks) {
      const pts = parsePts(p.shape);
      if (pts.length >= 3 && pointInPolygon(pt, pts)) {
        const area = polygonArea(pts);
        if (area < bestArea) {
          best = p;
          bestArea = area;
        }
      }
    }
    return best ? { kind: 'paddock', id: best.id } : null;
  };

  const withSelPts = (s: Sel, pts: Pt[]): Farm => {
    if (!farm) throw new Error('no farm');
    if (s.kind === 'paddock') {
      return {
        ...farm,
        paddocks: farm.paddocks.map((p) =>
          p.id === s.id ? { ...p, shape: fmtPts(pts), label: labelOf(pts) } : p,
        ),
      };
    }
    return {
      ...farm,
      features: farm.features.map((f) => (f.id === s.id ? { ...f, pts: fmtPts(pts) } : f)),
    };
  };

  const stampPaddock = (pts: Pt[]) => {
    if (!farm || pts.length < 3) return;
    const paddock: Paddock = {
      id: freshId('pd'),
      n: nextName('New paddock', farm.paddocks.map((p) => p.n)),
      acres: estimateAcres(pts),
      grass: 'good',
      water: '',
      shape: fmtPts(pts),
      label: labelOf(pts),
    };
    commit({ ...farm, paddocks: [...farm.paddocks, paddock] });
    setSel({ kind: 'paddock', id: paddock.id });
  };

  const addFeature = (kind: FarmFeatureKind, pts: Pt[]) => {
    if (!farm || pts.length < 2) return;
    const feature: FarmFeature = {
      id: freshId(kind === 'water' ? 'w' : kind === 'fence' ? 'f' : 'g'),
      kind,
      pts: fmtPts(pts),
    };
    commit({ ...farm, features: [...farm.features, feature] });
    setSel({ kind: 'feature', id: feature.id });
  };

  const finishDraft = () => {
    if (tool === 'fence' && draft.length >= 2) addFeature('fence', draft);
    if (tool === 'paddock' && draft.length >= 3) stampPaddock(draft);
    if (tool === 'water' && draft.length >= 3) addFeature('water', draft);
    setDraft([]);
  };

  const addDraftPoint = (pt: Pt) => {
    const closable = tool !== 'fence' && draft.length >= 3;
    if (closable && dist(pt, draft[0]) < 3) {
      finishDraft();
      return;
    }
    setDraft((d) => [...d, snapPt(pt)]);
  };

  const deleteSel = () => {
    if (!farm || !sel) return;
    if (sel.kind === 'paddock') {
      const remaining = Object.fromEntries(
        Object.entries(farm.horses).filter(([, pid]) => pid !== sel.id),
      );
      commit({
        ...farm,
        paddocks: farm.paddocks.filter((p) => p.id !== sel.id),
        horses: remaining,
      });
    } else {
      commit({ ...farm, features: farm.features.filter((f) => f.id !== sel.id) });
    }
    setSel(null);
  };

  const patchPaddock = (id: string, patch: Partial<Paddock>) => {
    if (!farm) return;
    commit(
      { ...farm, paddocks: farm.paddocks.map((p) => (p.id === id ? { ...p, ...patch } : p)) },
      false,
    );
    // Field edits aren't undoable — fold them into the existing snapshots so
    // undoing a later paint never reverts a rename or grass change.
    setUndoStack((s) =>
      s.map((f) => ({
        ...f,
        paddocks: f.paddocks.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })),
    );
  };

  const renameFarm = (n: string) => {
    if (!farm) return;
    const name = n.trim();
    if (name && name !== farm.n) commit({ ...farm, n: name }, false);
  };

  // ---- pointer handling (edit mode only) ----

  // Where the primary press started — guards pointer-ups whose press began off
  // the map (e.g. on a chip) and lets taps be told apart from swipes.
  const downRef = useRef<Pt | null>(null);

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!editing || !farm || !e.isPrimary) return;
    // Commit any half-typed panel edit before the selection can change —
    // removing a focused input from the DOM would otherwise skip its blur.
    const active = document.activeElement;
    if (active instanceof HTMLInputElement) active.blur();
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = evtPt(e);
    downRef.current = pt;
    if (tool === 'select') {
      if (sel) {
        const pts = storedPts(sel);
        const vi = pts.findIndex((p) => dist(p, pt) < 3);
        if (vi >= 0) {
          const origin = pts[vi];
          setDrag({
            type: 'vertex',
            sel,
            index: vi,
            pts,
            origin,
            off: [origin[0] - pt[0], origin[1] - pt[1]],
            moved: false,
          });
          return;
        }
      }
      const hit = hitTest(pt);
      if (hit) {
        setSel(hit);
        const base = storedPts(hit);
        setDrag({ type: 'shape', sel: hit, start: pt, base, pts: base, moved: false });
      } else {
        setSel(null);
        setDrag(null);
      }
      return;
    }
    if (tool === 'gate') setDrag({ type: 'gate-draw', start: pt, end: pt });
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!editing || !drag || !e.isPrimary) return;
    const pt = evtPt(e);
    if (drag.type === 'vertex') {
      const target = snapPt([pt[0] + drag.off[0], pt[1] + drag.off[1]]);
      if (!drag.moved && dist(target, drag.origin) < 1) return;
      const pts = drag.pts.slice();
      pts[drag.index] = target;
      setDrag({ ...drag, pts, moved: true });
    } else if (drag.type === 'shape') {
      const dx = pt[0] - drag.start[0];
      const dy = pt[1] - drag.start[1];
      if (!drag.moved && Math.hypot(dx, dy) < 1) return;
      setDrag({ ...drag, pts: movePts(drag.base, dx, dy).map(snapPt), moved: true });
    } else {
      setDrag({ ...drag, end: pt });
    }
  };

  // An OS gesture (notification shade, edge swipe, call) can cancel a drag —
  // drop it rather than letting the next tap commit a half-finished move.
  const onPointerCancel = () => {
    downRef.current = null;
    setDrag(null);
  };

  const onPointerUp = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!editing || !farm || !e.isPrimary) return;
    const down = downRef.current;
    downRef.current = null;
    if (!down) return;
    const pt = evtPt(e);
    if (drag) {
      if (drag.type === 'vertex') {
        if (drag.moved) commit(withSelPts(drag.sel, drag.pts));
        setDrag(null);
        return;
      }
      if (drag.type === 'shape') {
        if (drag.moved) commit(withSelPts(drag.sel, drag.pts));
        setDrag(null);
        return;
      }
      // gate-draw: a drag lays the gate along the pull; a tap drops a short bar.
      const pts =
        dist(drag.start, drag.end) >= 2
          ? [snapPt(drag.start), snapPt(drag.end)]
          : gateAt(pt);
      addFeature('gate', pts);
      setDrag(null);
      return;
    }
    // Stamping and drawing want deliberate taps, not the tail end of a swipe.
    if (dist(down, pt) >= 2) return;
    if (tool === 'paddock') {
      if (pdPreset === 'draw') addDraftPoint(pt);
      else stampPaddock(paddockPreset(pdPreset, pt));
    } else if (tool === 'water') {
      if (waPreset === 'draw') addDraftPoint(pt);
      else addFeature('water', waterPreset(waPreset, pt));
    } else if (tool === 'fence') {
      addDraftPoint(pt);
    }
  };

  // ---- move flow ----

  const handleMoveHere = (to: string) => {
    if (!moving || !farm) return;
    moveHorse.mutate({ farm: farm.id, horse: moving, to });
    setMoving(null);
  };

  // ---- render helpers ----

  const dragSel = drag && drag.type !== 'gate-draw' ? drag.sel : null;
  const livePts = (kind: Sel['kind'], id: string, stored: string): Pt[] =>
    dragSel && drag && drag.type !== 'gate-draw' && dragSel.kind === kind && dragSel.id === id
      ? drag.pts
      : parsePts(stored);

  const selPaddock = paddockOf(sel);
  const selFeature = featureOf(sel);
  const draftMin = tool === 'fence' ? 2 : 3;
  const draftClosable = tool !== 'fence' && draft.length >= 3;

  const hint = !editing
    ? ''
    : tool === 'select'
      ? 'Tap a shape to edit it. Drag to move it, drag a corner to reshape.'
      : tool === 'paddock'
        ? pdPreset === 'draw'
          ? 'Tap corner by corner, then tap the first point to close the paddock.'
          : 'Tap the map to place the paddock, then drag its corners to fit.'
        : tool === 'water'
          ? waPreset === 'draw'
            ? 'Tap around the water, then tap the first point to close it.'
            : 'Tap the map to place a trough or a dam.'
          : tool === 'fence'
            ? 'Tap along the fence line, then finish it.'
            : 'Tap where the gate goes, or drag to set its angle.';

  const waterFill = 'var(--info-soft)';
  const waterStroke = 'var(--info)';

  return (
    <div className="dk-screen">
      {/* ---- property map ---- */}
      <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span className="dk-kicker">The property</span>
          {farm && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {editing && (
                <IconButton
                  aria-label="Undo map change"
                  disabled={undoStack.length === 0}
                  onClick={undo}
                >
                  <Icon
                    name="undo"
                    size={16}
                    color={undoStack.length ? 'var(--text-secondary)' : 'var(--text-faint)'}
                  />
                </IconButton>
              )}
              <Button size="sm" variant={editing ? 'primary' : 'secondary'} onClick={toggleEdit}>
                {editing ? 'Done' : 'Edit map'}
              </Button>
            </div>
          )}
        </div>

        {/* farm switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {farms.map((f) => (
            <Tag key={f.id} active={f.id === farm?.id} onClick={() => switchFarm(f.id)}>
              {f.n}
            </Tag>
          ))}
          <Tag
            onClick={handleAddFarm}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <Icon name="plus" size={13} color="var(--text-muted)" />
            New farm
          </Tag>
        </div>

        {land && !farm && (
          <span style={{ fontSize: 13, color: 'var(--text-faint)', padding: '8px 0' }}>
            No farms yet — add one to start painting paddocks.
          </span>
        )}

        {/* paint tools */}
        {editing && farm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TOOLS.map((t) => (
                <Tag
                  key={t.id}
                  active={tool === t.id}
                  onClick={() => selectTool(t.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <Icon name={t.icon} size={13} color="currentColor" />
                  {t.label}
                </Tag>
              ))}
            </div>
            {tool === 'paddock' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {PADDOCK_PRESETS.map((p) => (
                  <Tag
                    key={p.id}
                    active={pdPreset === p.id}
                    onClick={() => {
                      setPdPreset(p.id);
                      setDraft([]);
                    }}
                  >
                    {p.label}
                  </Tag>
                ))}
              </div>
            )}
            {tool === 'water' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {WATER_PRESETS.map((p) => (
                  <Tag
                    key={p.id}
                    active={waPreset === p.id}
                    onClick={() => {
                      setWaPreset(p.id);
                      setDraft([]);
                    }}
                  >
                    {p.label}
                  </Tag>
                ))}
              </div>
            )}
            <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>{hint}</span>
          </div>
        )}

        {farm && (
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            role={editing ? 'application' : 'img'}
            aria-label={
              editing
                ? `Map editor for ${farm.n} — pick a tool, then tap the map to paint; the paddock list below also opens each paddock's details`
                : `Map of ${farm.n} showing paddocks, water, fences, gates and where each horse is`
            }
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            style={{
              width: '100%',
              maxWidth: 420,
              aspectRatio: '1 / 1',
              alignSelf: 'center',
              display: 'block',
              // Long paddock names near the boundary may extend past the
              // 0–100 grid — let them spill into the card padding, not clip.
              overflow: 'visible',
              touchAction: editing ? 'none' : undefined,
              cursor: editing ? 'crosshair' : undefined,
            }}
          >
            {/* faint working grid while painting */}
            {editing && (
              <g aria-hidden="true">
                <rect x={0} y={0} width={100} height={100} fill="var(--surface-sunken)" opacity={0.4} />
                {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((v) => (
                  <g key={v}>
                    <line x1={v} y1={0} x2={v} y2={100} stroke="var(--border-subtle)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                    <line x1={0} y1={v} x2={100} y2={v} stroke="var(--border-subtle)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                  </g>
                ))}
              </g>
            )}

            {paddocks.map((p) => {
              const pts = livePts('paddock', p.id, p.shape);
              const dragging = dragSel?.kind === 'paddock' && dragSel.id === p.id;
              const [lx, ly] = dragging ? centroid(pts) : p.label;
              return (
                <g key={p.id}>
                  <polygon
                    points={fmtPts(pts)}
                    fill={GRASS_FILL[p.grass]}
                    stroke="var(--border-strong)"
                    strokeWidth={0.8}
                    strokeDasharray={p.grass === 'resting' ? '2 2' : undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    style={{ fontSize: 4, fontWeight: 600, fill: 'var(--text-secondary)' }}
                  >
                    {p.n}
                  </text>
                  <text
                    x={lx}
                    y={ly + 4.5}
                    textAnchor="middle"
                    style={{ fontSize: 3, fill: 'var(--text-faint)' }}
                  >
                    {p.acres} ac
                  </text>
                </g>
              );
            })}

            {/* painted features: water under fences, gates on top */}
            {features
              .filter((f) => f.kind === 'water')
              .map((f) => (
                <polygon
                  key={f.id}
                  points={fmtPts(livePts('feature', f.id, f.pts))}
                  fill={waterFill}
                  stroke={waterStroke}
                  strokeWidth={0.4}
                  strokeLinejoin="round"
                  opacity={0.95}
                />
              ))}
            {features
              .filter((f) => f.kind === 'fence')
              .map((f) => (
                <polyline
                  key={f.id}
                  points={fmtPts(livePts('feature', f.id, f.pts))}
                  fill="none"
                  stroke="var(--accent-strong)"
                  strokeWidth={0.9}
                  strokeDasharray="2.4 1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            {features
              .filter((f) => f.kind === 'gate')
              .map((f) => (
                <polyline
                  key={f.id}
                  points={fmtPts(livePts('feature', f.id, f.pts))}
                  fill="none"
                  stroke="var(--accent-strong)"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              ))}

            {/* in-progress drawing */}
            {editing && draft.length > 0 && (
              <g aria-hidden="true">
                <polyline
                  points={fmtPts(draft)}
                  fill={tool === 'fence' ? 'none' : tool === 'water' ? waterFill : 'var(--scale-centre-soft)'}
                  stroke="var(--accent-strong)"
                  strokeWidth={0.6}
                  strokeDasharray="1.6 1.2"
                  strokeLinejoin="round"
                />
                {draft.map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i === 0 && draftClosable ? 2 : 1.1}
                    fill={i === 0 && draftClosable ? 'var(--accent-strong)' : 'var(--surface-card)'}
                    stroke="var(--accent-strong)"
                    strokeWidth={0.4}
                  />
                ))}
              </g>
            )}
            {editing && drag?.type === 'gate-draw' && dist(drag.start, drag.end) >= 1 && (
              <polyline
                points={fmtPts([drag.start, drag.end])}
                fill="none"
                stroke="var(--accent-strong)"
                strokeWidth={1.8}
                strokeLinecap="round"
                opacity={0.6}
              />
            )}

            {/* horses */}
            {!editing &&
              paddocks.map((p) =>
                horsesIn(p.id).map((h, i) => {
                  const cx = p.label[0] + 6 + i * 7;
                  const cy = p.label[1] + 8;
                  return (
                    <g key={h.id}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill="var(--surface-card)"
                        stroke="var(--accent-strong)"
                        strokeWidth={0.6}
                      />
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontSize: 3.2,
                          fontWeight: 600,
                          fill: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {h.initials}
                      </text>
                    </g>
                  );
                }),
              )}

            {/* selection outline + reshape handles */}
            {editing &&
              sel &&
              (() => {
                const dragging =
                  drag && drag.type !== 'gate-draw' && drag.sel.kind === sel.kind && drag.sel.id === sel.id;
                const stored = dragging ? drag.pts : storedPts(sel);
                if (stored.length === 0) return null;
                const closed = sel.kind === 'paddock' || selFeature?.kind === 'water';
                const outline = fmtPts(stored);
                return (
                  <g aria-hidden="true">
                    {closed ? (
                      <polygon
                        points={outline}
                        fill="none"
                        stroke="var(--focus-ring)"
                        strokeWidth={2}
                        strokeDasharray="4 3"
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : (
                      <polyline
                        points={outline}
                        fill="none"
                        stroke="var(--focus-ring)"
                        strokeWidth={2}
                        strokeDasharray="4 3"
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                    {tool === 'select' &&
                      stored.map(([x, y], i) => (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={1.7}
                          fill="var(--surface-card)"
                          stroke="var(--accent-strong)"
                          strokeWidth={0.5}
                        />
                      ))}
                  </g>
                );
              })()}
          </svg>
        )}

        {/* draft controls */}
        {editing && draft.length > 0 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Button size="sm" variant="secondary" disabled={draft.length < draftMin} onClick={finishDraft}>
              {tool === 'fence' ? 'Finish fence' : 'Close shape'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDraft([])}>
              Cancel
            </Button>
          </div>
        )}

        {/* selected paddock details */}
        {editing && selPaddock && (
          <div
            // Remount on undo so the uncontrolled inputs pick up restored values.
            key={`${selPaddock.id}:${undoStack.length}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 14,
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Input
                aria-label="Paddock name"
                maxLength={80}
                defaultValue={selPaddock.n}
                onBlur={(e) => {
                  const n = e.currentTarget.value.trim();
                  if (n && n !== selPaddock.n) patchPaddock(selPaddock.id, { n });
                }}
                onKeyDown={blurOnEnter}
                style={{ flex: 1, minWidth: 0 }}
              />
              <IconButton aria-label="Remove paddock" onClick={deleteSel}>
                <Icon name="trash" size={16} color="var(--danger)" />
              </IconButton>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GRASS_ORDER.map((g) => (
                <Tag
                  key={g}
                  active={selPaddock.grass === g}
                  onClick={() => patchPaddock(selPaddock.id, { grass: g })}
                >
                  {g}
                </Tag>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <label style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="dk-kicker">Acres</span>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  defaultValue={selPaddock.acres}
                  onBlur={(e) => {
                    const acres = Number(e.currentTarget.value);
                    if (Number.isFinite(acres) && acres >= 0) {
                      patchPaddock(selPaddock.id, { acres: Math.min(acres, 100_000) });
                    }
                  }}
                  onKeyDown={blurOnEnter}
                />
              </label>
              <label style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span className="dk-kicker">Water supply</span>
                <Input
                  maxLength={120}
                  defaultValue={selPaddock.water}
                  placeholder="Trough, dam, creek…"
                  onBlur={(e) => patchPaddock(selPaddock.id, { water: e.currentTarget.value.trim() })}
                  onKeyDown={blurOnEnter}
                />
              </label>
            </div>
          </div>
        )}

        {/* selected feature details */}
        {editing && selFeature && (
          <div
            key={selFeature.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 14,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>{FEATURE_LABEL[selFeature.kind]}</span>
            <span style={{ fontSize: 12.5, color: 'var(--text-faint)', flex: 1 }}>
              Drag its points with the select tool.
            </span>
            <IconButton aria-label={`Remove ${FEATURE_LABEL[selFeature.kind].toLowerCase()}`} onClick={deleteSel}>
              <Icon name="trash" size={16} color="var(--danger)" />
            </IconButton>
          </div>
        )}

        {/* farm settings */}
        {editing && farm && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 14,
            }}
          >
            <Input
              key={`${farm.id}:${undoStack.length}`}
              aria-label="Farm name"
              maxLength={120}
              defaultValue={farm.n}
              onBlur={(e) => renameFarm(e.currentTarget.value)}
              onKeyDown={blurOnEnter}
              style={{ flex: 1, minWidth: 0 }}
            />
            <Button
              size="sm"
              variant={confirmRemove ? 'danger' : 'ghost'}
              onClick={handleRemoveFarm}
            >
              {confirmRemove ? 'Tap again to remove' : 'Remove farm'}
            </Button>
          </div>
        )}

        {/* legend */}
        {!editing && farm && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 14px',
              justifyContent: 'center',
            }}
          >
            {GRASS_ORDER.map((g) => (
              <span
                key={g}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    flex: 'none',
                    background: GRASS_FILL[g],
                    border: g === 'resting' ? '1px dashed var(--border-strong)' : '1px solid var(--border-subtle)',
                  }}
                />
                {g}
              </span>
            ))}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  flex: 'none',
                  background: waterFill,
                  border: `1px solid ${waterStroke}`,
                }}
              />
              water
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
              <span
                style={{
                  width: 12,
                  height: 0,
                  flex: 'none',
                  borderTop: '2px dashed var(--accent-strong)',
                }}
              />
              fence
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
              <span
                style={{
                  width: 10,
                  height: 4,
                  flex: 'none',
                  borderRadius: 2,
                  background: 'var(--accent-strong)',
                }}
              />
              gate
            </span>
          </div>
        )}
      </Card>

      {/* ---- move flow + paddock rows ---- */}
      {farm && (
        <Card style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 14 }}>
            <span className="dk-kicker">Move a horse</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {herd.map((h) => (
                <Tag
                  key={h.id}
                  active={moving === h.id}
                  onClick={() => setMoving(moving === h.id ? null : h.id)}
                >
                  {h.name}
                </Tag>
              ))}
            </div>
            <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>
              {movingHorse
                ? `Pick a new paddock for ${movingHorse.name} below.`
                : 'Choose a horse, then tap the paddock they should go to — even from another farm.'}
            </span>
          </div>

          {paddocks.map((p) => {
            const occupants = horsesIn(p.id);
            const showMove = !!moving && locations[moving] !== p.id;
            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  minHeight: 44,
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {editing ? (
                      // Keyboard route into the map editor: each row opens its
                      // paddock's details panel.
                      <button
                        type="button"
                        className="dk-row dk-hoverable"
                        style={{ fontWeight: 600, fontSize: 14, width: 'auto', padding: '0 2px' }}
                        aria-label={`Edit ${p.n} on the map`}
                        onClick={() => setSel({ kind: 'paddock', id: p.id })}
                      >
                        {p.n}
                      </button>
                    ) : (
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{p.n}</span>
                    )}
                    <Badge tone={GRASS_TONE[p.grass]}>{p.grass}</Badge>
                  </div>
                  <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>
                    {p.acres} acres{p.water ? ` · ${p.water}` : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
                  {occupants.length > 0 ? (
                    <span style={{ display: 'inline-flex', gap: 4 }}>
                      {occupants.map((h) => (
                        <Avatar key={h.id} initials={h.initials} size={24} />
                      ))}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>empty</span>
                  )}
                  {showMove && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMoveHere(p.id)}
                      aria-label={`Move ${movingHorse?.name ?? 'the horse'} to ${p.n}`}
                    >
                      Move here
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {/* ---- rotation history ---- */}
      {farm && (
        <Card style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column' }}>
          <span className="dk-kicker" style={{ paddingBottom: 10 }}>
            Recent moves
          </span>
          {moves.length === 0 && (
            <span
              style={{
                fontSize: 13,
                color: 'var(--text-faint)',
                padding: '12px 0',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              No moves recorded yet.
            </span>
          )}
          {moves.map((m, i) => (
            <div
              key={`${m.horse}-${m.at}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 0',
                minHeight: 44,
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ ...mono, fontSize: 12, color: 'var(--text-muted)', width: 56, flex: 'none' }}>
                {fmtDate(m.at)}
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 500, flex: 'none' }}>{horseName(m.horse)}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12.5,
                  color: 'var(--text-muted)',
                  minWidth: 0,
                  flexWrap: 'wrap',
                }}
              >
                <span>{m.from ? paddockName(m.from) : 'new'}</span>
                <Icon name="arrow-right" size={12} color="var(--text-faint)" />
                <span>{paddockName(m.to)}</span>
              </span>
            </div>
          ))}
        </Card>
      )}

      <p style={{ margin: 0, fontSize: 12.5, color: 'var(--text-faint)', textAlign: 'center' }}>
        Paint each farm to match the land — rotation keeps paddocks alive.
      </p>
    </div>
  );
}
