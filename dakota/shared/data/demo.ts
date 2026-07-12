// Demo user state — the shared example data: two horses on a small family
// property, paddocks with gates, GPS rides and ~4 weeks of diary history.
// Dates are computed relative to `now` so care due-dates and the diary always
// look alive. Everything is deterministic (no Math.random) so `pnpm seed`
// resets to the same world.
import { dateKey, pad2, rideStats } from '../derive';
import type {
  DayLog, Exercise, Farm, Horse, Paddocks, Practice, Ride, RidePoint, UserLog,
} from '../types';

const daysAgo = (now: Date, n: number): string =>
  dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - n));

// ---- horses ----

export function demoHorses(now: Date): Horse[] {
  return [
    {
      id: 'dakota',
      name: 'Dakota',
      breed: 'Australian Stock Horse',
      sex: 'mare',
      born: '2014',
      color: 'Bay',
      markings: 'Star and snip, two white socks behind',
      hands: 15.1,
      weightKg: 480,
      initials: 'DK',
      temperament:
        'Forward and honest with a big floaty trot. Fresh on windy days; settles once she is working over her back.',
      sire: 'Riverlea Rey',
      dam: 'Moonlight Bay',
      sireSire: 'Rey del Rancho',
      sireDam: 'Riverlea Duchess',
      damSire: 'Midnight Chime',
      damDam: 'Bay of Plenty',
      regNo: 'ASHS 214087',
      microchip: '953 010 004 812 664',
      ownership: [
        { owner: 'Riverlea Stud', from: '2014', to: '2016', note: 'Bred and started under saddle' },
        { owner: 'Sarah McKenzie', from: '2016', to: '2021', note: 'Pony club and campdrafting' },
        { owner: 'You', from: '2021', note: 'Bramble Creek' },
      ],
      care: {
        farrierWeeks: 6,
        wormingWeeks: 12,
        dentalMonths: 12,
        vaccinationMonths: 12,
        lastFarrier: daysAgo(now, 40),
        lastWorming: daysAgo(now, 33),
        lastDental: daysAgo(now, 200),
        lastVaccination: daysAgo(now, 170),
      },
    },
    {
      id: 'banjo',
      name: 'Banjo',
      breed: 'Welsh Mountain Pony cross',
      sex: 'gelding',
      born: '2009',
      color: 'Grey',
      markings: 'Flea-bitten coat, small snip',
      hands: 13.2,
      weightKg: 320,
      initials: 'BJ',
      temperament:
        'Old soul and paddock babysitter. Quiet to the point of lazy — and he can open gates, so chain the latches.',
      sire: 'Craven Silver',
      dam: 'Tumut Rose',
      ownership: [
        { owner: 'The Hartley family', from: '2009', to: '2018', note: 'First pony for three kids' },
        { owner: 'You', from: '2018', note: 'Companion and lead-rein pony' },
      ],
      care: {
        farrierWeeks: 8,
        wormingWeeks: 12,
        dentalMonths: 12,
        vaccinationMonths: 12,
        lastFarrier: daysAgo(now, 20),
        lastWorming: daysAgo(now, 85),
        lastDental: daysAgo(now, 335),
        lastVaccination: daysAgo(now, 170),
      },
    },
  ];
}

// ---- farms & paddocks ----

/**
 * The demo land: Bramble Creek (five paddocks, both horses out) plus a leased
 * river block down the road — two farms so the switcher has somewhere to go.
 */
export function demoPaddocks(now: Date): Paddocks {
  return {
    farms: [
      {
        id: 'bramble',
        n: 'Bramble Creek',
        paddocks: [
          { id: 'creek', n: 'Creek flat', acres: 4, grass: 'good', water: 'Creek + trough', shape: '2,2 48,2 48,38 40,52 2,52', label: [25, 26] },
          { id: 'hill', n: 'Hill paddock', acres: 6, grass: 'short', water: 'Dam', shape: '52,2 98,2 98,44 52,44', label: [75, 22] },
          { id: 'house', n: 'House paddock', acres: 2.5, grass: 'lush', water: 'Trough', shape: '2,56 38,56 38,98 2,98', label: [20, 78] },
          { id: 'arena', n: 'Arena yard', acres: 1, grass: 'eaten down', water: 'Trough', shape: '42,58 70,58 70,98 42,98', label: [56, 79] },
          { id: 'spelling', n: 'Spelling paddock', acres: 3, grass: 'resting', water: 'Trough', shape: '74,48 98,48 98,98 74,98', label: [86, 74] },
        ],
        features: [
          // The creek winds along the western fence of Creek flat.
          { id: 'w-creek', kind: 'water', pts: '2,4 7,9 9,15 8,23 4,29 2,33' },
          { id: 'w-dam', kind: 'water', pts: '80,10 84,8 88,10 89,14 86,17 81,16 79,13' },
          { id: 'w-house-trough', kind: 'water', pts: '29,59 32,59 32,61 29,61' },
          { id: 'w-arena-trough', kind: 'water', pts: '65,60 68,60 68,62 65,62' },
          // A catch pen fenced off in the hill paddock's corner.
          { id: 'f-catch-pen', kind: 'fence', pts: '52,28 66,28 66,44' },
          { id: 'f-house-rail', kind: 'fence', pts: '2,72 20,72' },
          { id: 'g-creek-house', kind: 'gate', pts: '18.5,54 21.5,54' },
          { id: 'g-creek-hill', kind: 'gate', pts: '48.5,22 51.5,22' },
          { id: 'g-house-arena', kind: 'gate', pts: '38.5,76 41.5,76' },
          { id: 'g-arena-spelling', kind: 'gate', pts: '70.5,76 73.5,76' },
          { id: 'g-hill-spelling', kind: 'gate', pts: '86,44.5 86,47.5' },
        ],
        horses: { dakota: 'creek', banjo: 'house' },
        moves: [
          { horse: 'banjo', from: 'spelling', to: 'house', at: daysAgo(now, 2) },
          { horse: 'dakota', from: 'hill', to: 'creek', at: daysAgo(now, 5) },
          { horse: 'banjo', from: 'hill', to: 'spelling', at: daysAgo(now, 12) },
          { horse: 'dakota', from: 'house', to: 'hill', at: daysAgo(now, 16) },
          { horse: 'banjo', from: 'creek', to: 'hill', at: daysAgo(now, 16) },
          { horse: 'dakota', from: 'creek', to: 'house', at: daysAgo(now, 27) },
        ],
      },
      {
        id: 'river',
        n: 'River flats',
        paddocks: [
          { id: 'river-front', n: 'River front', acres: 8, grass: 'lush', water: 'River', shape: '2,2 62,2 58,48 2,58', label: [29, 28] },
          { id: 'river-run', n: 'Back run', acres: 6, grass: 'short', water: 'River + trough', shape: '66,2 98,2 98,68 62,60', label: [82, 32] },
          { id: 'river-yards', n: 'Yards', acres: 0.5, grass: 'eaten down', water: 'Trough', shape: '2,64 40,64 40,92 2,92', label: [21, 79] },
        ],
        features: [
          // The river runs along the southern boundary.
          { id: 'w-river', kind: 'water', pts: '44,98 52,84 70,78 88,82 98,78 98,98' },
          { id: 'w-run-trough', kind: 'water', pts: '92,8 95,8 95,10 92,10' },
          { id: 'f-river-lane', kind: 'fence', pts: '58,48 44,64 40,64' },
          { id: 'g-front-yards', kind: 'gate', pts: '18.5,61 21.5,61' },
          { id: 'g-front-run', kind: 'gate', pts: '62,24 62,28' },
        ],
        horses: {},
        moves: [],
      },
    ],
  };
}

/** A blank-slate farm — three paddocks and two gates to rename and repaint. */
export function starterFarm(id: string, n: string): Farm {
  return {
    id,
    n,
    paddocks: [
      { id: `${id}-p1`, n: 'Front paddock', acres: 2, grass: 'good', water: 'Trough', shape: '2,2 48,2 48,98 2,98', label: [25, 50] },
      { id: `${id}-p2`, n: 'Back paddock', acres: 3, grass: 'good', water: 'Dam', shape: '52,2 98,2 98,48 52,48', label: [75, 25] },
      { id: `${id}-p3`, n: 'Yards', acres: 0.5, grass: 'eaten down', water: 'Trough', shape: '52,52 98,52 98,98 52,98', label: [75, 75] },
    ],
    features: [
      { id: `${id}-g1`, kind: 'gate', pts: '50,23.5 50,26.5' },
      { id: `${id}-g2`, kind: 'gate', pts: '50,73.5 50,76.5' },
    ],
    horses: {},
    moves: [],
  };
}

/** Starter layout for fresh accounts — one home farm. */
export const DEFAULT_PADDOCKS: Paddocks = {
  farms: [starterFarm('home', 'Home farm')],
};

/**
 * Lift stored paddock state to the multi-farm shape. Older saves were a single
 * flat property ({ paddocks, gates, horses, moves }) — wrap them into one farm,
 * turning each gate point into a painted gate segment.
 */
export function migratePaddocks(raw: unknown): Paddocks {
  const doc = (raw ?? {}) as Record<string, unknown>;
  if (Array.isArray(doc.farms)) return doc as unknown as Paddocks;
  // Deep-copy the starter so callers can mutate their farms freely.
  if (!Array.isArray(doc.paddocks)) return JSON.parse(JSON.stringify(DEFAULT_PADDOCKS)) as Paddocks;
  const gates = Array.isArray(doc.gates) ? (doc.gates as Array<{ id: string; x: number; y: number }>) : [];
  return {
    farms: [
      {
        id: 'home',
        n: 'Home farm',
        paddocks: doc.paddocks as Paddocks['farms'][number]['paddocks'],
        features: gates.map((g) => ({
          id: g.id,
          kind: 'gate' as const,
          pts: `${g.x - 1.5},${g.y} ${g.x + 1.5},${g.y}`,
        })),
        horses: (doc.horses ?? {}) as Record<string, string>,
        moves: (doc.moves ?? []) as Paddocks['farms'][number]['moves'],
      },
    ],
  };
}

// ---- GPS rides ----

// Bramble Creek — a fictional property in the Macedon Ranges. All tracks are
// synthetic loops around this point.
const BASE_LA = -37.421;
const BASE_LN = 144.583;

/** Tiny deterministic PRNG so tracks look organic but seed identically. */
function prng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/**
 * Build a GPS trace through waypoints (metres east/north of the yard gate).
 * Points every ~5 s with gentle wander; pace comes from the leg's gait.
 */
function trace(
  seed: number,
  legs: Array<{ to: [number, number]; kmh: number }>,
  startAt: [number, number] = [0, 0],
): RidePoint[] {
  const rand = prng(seed);
  const mPerDegLa = 111_320;
  const mPerDegLn = 111_320 * Math.cos((BASE_LA * Math.PI) / 180);
  const pts: RidePoint[] = [];
  let [x, y] = startAt;
  let t = 0;
  const pushPoint = (px: number, py: number) => {
    pts.push({
      la: Math.round((BASE_LA + py / mPerDegLa) * 1e6) / 1e6,
      ln: Math.round((BASE_LN + px / mPerDegLn) * 1e6) / 1e6,
      t: Math.round(t),
    });
  };
  pushPoint(x, y);
  for (const leg of legs) {
    const [tx, ty] = leg.to;
    const dist = Math.hypot(tx - x, ty - y);
    const mps = (leg.kmh * 1000) / 3600;
    const steps = Math.max(2, Math.round(dist / (mps * 5)));
    for (let i = 1; i <= steps; i++) {
      const f = i / steps;
      const wobble = Math.sin(f * Math.PI * 3 + seed) * 4 + (rand() - 0.5) * 3;
      const nx = x + (tx - x) * f + wobble * ((ty - y) / (dist || 1));
      const ny = y + (ty - y) * f - wobble * ((tx - x) / (dist || 1));
      t += 5 + rand() * 1.5;
      pushPoint(nx, ny);
    }
    [x, y] = [tx, ty];
  }
  return pts;
}

interface RideSketch {
  id: string;
  horse: string;
  name: string;
  ago: number;
  startHour: number;
  note: string;
  legs: Array<{ to: [number, number]; kmh: number }>;
}

const RIDE_SKETCHES: RideSketch[] = [
  {
    id: 'ride-creek-loop',
    horse: 'dakota',
    name: 'Creek loop',
    ago: 1,
    startHour: 7,
    note: 'Cool morning. Walked the creek crossing both ways — no hesitation at the water this time.',
    legs: [
      { to: [-350, 240], kmh: 6 }, { to: [-680, 520], kmh: 9 }, { to: [-420, 900], kmh: 13 },
      { to: [80, 1050], kmh: 13 }, { to: [420, 760], kmh: 9 }, { to: [300, 300], kmh: 6 },
      { to: [0, 0], kmh: 6 },
    ],
  },
  {
    id: 'ride-rail-trail',
    horse: 'dakota',
    name: 'Rail trail out-and-back',
    ago: 4,
    startHour: 16,
    note: 'Long trot sets along the rail trail. Passed two cyclists calmly — big improvement.',
    legs: [
      { to: [600, -150], kmh: 6 }, { to: [1700, -420], kmh: 12 }, { to: [2900, -700], kmh: 12 },
      { to: [3400, -820], kmh: 7 }, { to: [2200, -540], kmh: 13 }, { to: [900, -230], kmh: 11 },
      { to: [0, 0], kmh: 6 },
    ],
  },
  {
    id: 'ride-hill-climb',
    horse: 'dakota',
    name: 'Hill paddock climb',
    ago: 8,
    startHour: 8,
    note: 'Hill work for the hindquarters. Two steady canters up the face, walked down on a long rein.',
    legs: [
      { to: [350, 300], kmh: 6 }, { to: [700, 800], kmh: 15 }, { to: [500, 1100], kmh: 5 },
      { to: [750, 820], kmh: 5 }, { to: [1050, 1250], kmh: 16 }, { to: [600, 700], kmh: 5 },
      { to: [0, 0], kmh: 6 },
    ],
  },
  {
    id: 'ride-banjo-leadrein',
    horse: 'banjo',
    name: 'Lead-rein lap with Poppy',
    ago: 6,
    startHour: 10,
    note: 'Poppy up top, me on foot. Banjo was a saint as always. Ice cream promised and delivered.',
    legs: [
      { to: [200, 150], kmh: 4 }, { to: [380, 420], kmh: 4 }, { to: [150, 600], kmh: 4 },
      { to: [-120, 380], kmh: 4 }, { to: [0, 0], kmh: 4 },
    ],
  },
  {
    id: 'ride-forest-track',
    horse: 'dakota',
    name: 'Forest track loop',
    ago: 13,
    startHour: 9,
    note: 'First time past the logging coupe without a spook. Kept her busy with shoulder-fore past the machinery.',
    legs: [
      { to: [-500, -300], kmh: 6 }, { to: [-1400, -750], kmh: 10 }, { to: [-2100, -300], kmh: 13 },
      { to: [-1900, 500], kmh: 9 }, { to: [-1000, 800], kmh: 12 }, { to: [-300, 350], kmh: 7 },
      { to: [0, 0], kmh: 5 },
    ],
  },
  {
    id: 'ride-sunset-amble',
    horse: 'banjo',
    name: 'Sunset amble',
    ago: 19,
    startHour: 18,
    note: 'Bareback wander around the boundary to check fences. Found one loose picket near the dam.',
    legs: [
      { to: [300, -200], kmh: 5 }, { to: [650, -80], kmh: 5 }, { to: [800, 350], kmh: 6 },
      { to: [450, 600], kmh: 5 }, { to: [100, 420], kmh: 5 }, { to: [0, 0], kmh: 4 },
    ],
  },
];

export function demoRides(now: Date): Ride[] {
  return RIDE_SKETCHES.map((sk, i) => {
    const points = trace(i * 97 + 13, sk.legs);
    const stats = rideStats(points);
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - sk.ago, sk.startHour, 10);
    return {
      id: sk.id,
      horse: sk.horse,
      name: sk.name,
      date: dateKey(day),
      startedAt: day.getTime(),
      ...stats,
      note: sk.note,
      points,
    };
  });
}

// ---- diary history ----

const SESSION_NOTES = [
  'Right canter lead still late — counter-flex on the approach helped the last two tries.',
  'Much softer through the poll today. Kept sessions short and sweet.',
  'Rushed the first pole line, settled by the third pass. End on a walk stretch.',
  'Best halts yet — square three times from trot. Praise and done.',
  'Falling in on the left circle; opening rein plus inside leg fixed it by the end.',
  'Fresh start (windy), lunged first. Under saddle she was foot-perfect after ten minutes.',
  'Transitions sharper today. Trot–halt–trot with barely any hand.',
  'Struggled to bend right — booking the physio to check her back.',
  'Stretchy trot circle is really coming; nose to the sand and back lifted.',
  'Nappy near the gate end. Worked the far end, rewarded forward, no drama.',
  'Leg-yield rhythm much better left to right. Right to left still sticky.',
  'Quiet plod on the buckle to cool out. Exactly what we both needed.',
];

const CHECKIN_NOTES = [
  'Bright-eyed at the gate, trotted up for the feed bin',
  'Sleepy in the sun, dozing hind leg cocked',
  'Wind up her tail today, galloped the fence line',
  'A bit quiet at feed time, kept an eye on her',
  'Waiting at the gate, whickered hello',
  'Fence-walking before the storm came through',
  '',
];

/**
 * ~4 weeks of believable diary history. Sessions trend from a hot/flat start
 * toward centred scores — training that is visibly working. Care entries line
 * up with the horses' last-done dates so both views agree.
 */
export function seedLog(
  now: Date,
  exercises: Exercise[],
  practices: Practice[],
  horses: Horse[],
): UserLog {
  const log: UserLog = {};
  const ridden = exercises.filter((e) => e.discipline !== 'Groundwork');
  const ground = exercises.filter((e) => e.discipline === 'Groundwork');
  const day = (n: number): DayLog => {
    const key = daysAgo(now, n);
    if (!log[key]) log[key] = { sessions: [], checkins: [], practices: [], care: [] };
    return log[key];
  };

  for (let i = 28; i >= 0; i--) {
    const rhythm = (i * 7 + 3) % 10;
    if (rhythm >= 8 && i !== 0) continue; // rest days

    const d = day(i);
    const horse = horses[i % 3 === 0 && horses.length > 1 ? 1 : 0];

    // Morning check-in most days.
    if (rhythm !== 7) {
      const v = Math.round(((((i * 13) % 9) - 4) / 4 - 0.1) * (0.3 + i / 60) * 100) / 100;
      d.checkins.push({
        horse: horse.id,
        t: `0${7 + (i % 2)}:${pad2((i * 11) % 60)}`,
        v: Math.max(-1, Math.min(1, v)),
        note: CHECKIN_NOTES[i % CHECKIN_NOTES.length],
      });
    }

    // Training session most active days — scores converge toward centre.
    if (rhythm <= 5 && ridden.length) {
      const ex = horse.id === 'banjo' && ground.length
        ? ground[i % ground.length]
        : ridden[(i * 5) % ridden.length];
      const drift = ((i * 17) % 7) - 3; // -3..3
      const score = Math.round(drift * (0.06 + i / 160) * 100) / 100;
      d.sessions.push({
        ex: ex.id,
        horse: horse.id,
        t: `${pad2(9 + (i % 7))}:${pad2((i * 23) % 60)}`,
        mins: ex.mins + ((i % 3) - 1) * 5,
        score: Math.max(-1, Math.min(1, score)),
        note: SESSION_NOTES[i % SESSION_NOTES.length],
      });
    }

    // A few daily practices.
    if (practices.length) {
      const count = 2 + (i % 2);
      for (let p = 0; p < count; p++) {
        const id = practices[(i + p * 3) % practices.length].id;
        if (!d.practices.includes(id)) d.practices.push(id);
      }
    }
  }

  // Care events that match the horses' last-done dates (within the window).
  for (const horse of horses) {
    const c = horse.care;
    const entries: Array<[string | undefined, DayLog['care'][number]['type'], string]> = [
      [c.lastFarrier, 'farrier', 'Trim and reset all round'],
      [c.lastWorming, 'worming', 'Rotational wormer, weight-taped first'],
      [c.lastDental, 'dental', 'Annual float, small hooks behind'],
      [c.lastVaccination, 'vaccination', '2-in-1 booster, no reaction'],
    ];
    for (const [last, type, note] of entries) {
      if (!last) continue;
      const ago = Math.round(
        (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
          new Date(last).getTime()) / 86400_000,
      );
      if (ago >= 0 && ago <= 28) {
        day(ago).care.push({ horse: horse.id, type, t: '11:00', note });
      }
    }
  }

  return log;
}
