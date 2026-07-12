// Dakota domain types — a horse training, health and riding companion.
// Energy scale: -1 = flat/quiet (behind the leg) … +1 = hot/tense (rushing).
// 0 is the ideal: forward and relaxed. The scale colors run violet (flat)
// through green (centre) to red (hot).

// ---- catalog: feed room ----

export interface FeedItem {
  id: string;
  n: string;
  cat: string;
  /** -1 cooling/low-energy … +1 heating/fizz-making. */
  heat: number;
  note: string;
}

// ---- catalog: arena exercises ----

export type Discipline = 'Dressage' | 'Jumping' | 'Pole work' | 'Groundwork' | 'Western';
export type Level = 'Intro' | 'Novice' | 'Elementary' | 'Medium' | 'Advanced';

export interface ExerciseStep {
  s: string;
  note?: string;
}

export interface ExerciseFault {
  f: string;
  fix: string;
}

export interface ExerciseComment {
  who: string;
  t: string;
}

export interface Exercise {
  id: string;
  n: string;
  discipline: Discipline;
  level: Level;
  /** Typical schooling time in minutes. */
  mins: number;
  gaits: string[];
  /** Arena the diagram is drawn for; 'none' for groundwork/yard exercises. */
  arena: '20x40' | '20x60' | 'none';
  /**
   * SVG paths of the route in arena coordinates. The arena is drawn with the
   * short side horizontal: 20 m wide × 40/60 m long → viewBox 200×400 (20x40)
   * or 200×600 (20x60), 10 units per metre. A is at the bottom (y=400/600),
   * C at the top (y=0). Multiple paths = ridden sections, in order.
   */
  paths?: string[];
  desc: string;
  aims: string[];
  steps: ExerciseStep[];
  faults: ExerciseFault[];
  comments: ExerciseComment[];
}

// ---- catalog: health ----

export type Urgency = 'routine' | 'monitor' | 'vet soon' | 'vet now';

export interface AilmentCare {
  n: string;
  how: string;
}

export interface Ailment {
  id: string;
  n: string;
  system: string;
  urgency: Urgency;
  signs: string[];
  care: AilmentCare[];
  /** When to call the vet. */
  vet: string;
  prevention: string[];
  note: string;
}

// ---- catalog: practices (daily horsemanship habits) ----

export interface Practice {
  id: string;
  n: string;
  icon: string;
  tag: string;
  desc: string;
  steps: string[];
  why: string;
}

// ---- catalog: learn ----

export interface Lesson {
  id: string;
  t: string;
  min: number;
  done: boolean;
}

export interface Course {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type ArticleBlockType = 'h' | 'p' | 'quote' | 'list' | 'aside';

export interface ArticleBlock {
  t: ArticleBlockType;
  x: string | string[];
}

// ---- catalog: circle & feed ----

export interface PostComment {
  who: string;
  t: string;
}

/** A shared ride's headline numbers, embedded on a post. */
export interface PostRide {
  name: string;
  km: number;
  min: number;
}

export interface Post {
  id: string;
  who: string;
  initials: string;
  time: string;
  text: string;
  /** Exercise reference — renders a tap-through exercise panel. */
  ex?: string;
  /** Ride summary — renders a ride stats panel. */
  ride?: PostRide;
  likes: number;
  comments: PostComment[];
}

export interface FriendHorse {
  name: string;
  breed: string;
}

export interface Friend {
  id: string;
  n: string;
  initials: string;
  relation: string;
  discipline: string;
  horses: FriendHorse[];
  /** Sessions ridden per week, most recent last (sparkline). */
  trend: number[];
  note: string;
}

// ---- catalog: wisdom (paddock reference) ----

export interface Breed {
  id: string;
  n: string;
  origin: string;
  height: string;
  temperament: string;
  note: string;
}

export interface Gait {
  n: string;
  beats: string;
  speed: string;
  note: string;
}

export interface Marking {
  kind: 'face' | 'leg' | 'coat';
  n: string;
  note: string;
}

export interface AgeRow {
  horse: number;
  human: number;
  stage: string;
}

export interface SignalRow {
  part: string;
  signal: string;
  meaning: string;
}

export interface GlossaryRow {
  term: string;
  def: string;
}

export interface ConditionScore {
  score: number;
  label: string;
  note: string;
}

// ---- user state: horses ----

export type HorseSex = 'mare' | 'gelding' | 'stallion' | 'filly' | 'colt';

export interface OwnershipEntry {
  owner: string;
  from: string; // 'YYYY' or 'YYYY-MM'
  to?: string;
  note?: string;
}

/** Routine care cadence + last-done dates ('YYYY-MM-DD'); due dates derive from these. */
export interface HorseCare {
  farrierWeeks: number;
  wormingWeeks: number;
  dentalMonths: number;
  vaccinationMonths: number;
  lastFarrier?: string;
  lastWorming?: string;
  lastDental?: string;
  lastVaccination?: string;
}

export interface Horse {
  id: string;
  name: string;
  breed: string;
  sex: HorseSex;
  born: string; // 'YYYY'
  color: string;
  markings: string;
  /** Height in hands, e.g. 15.2 */
  hands: number;
  weightKg?: number;
  initials: string;
  temperament: string;
  // Lineage — names; grandparents optional.
  sire?: string;
  dam?: string;
  sireSire?: string;
  sireDam?: string;
  damSire?: string;
  damDam?: string;
  regNo?: string;
  microchip?: string;
  ownership: OwnershipEntry[];
  care: HorseCare;
}

// ---- user state: diary log ----

export interface LogSession {
  ex: string; // exercise id
  horse: string; // horse id
  t: string; // HH:MM
  mins: number;
  /** How the horse felt: -1 flat … 0 forward & relaxed … +1 hot/tense. */
  score: number;
  /** What improved, what to work on. */
  note: string;
}

export interface LogCheckin {
  horse: string;
  t: string; // HH:MM
  v: number;
  note: string;
}

export type CareType =
  | 'farrier'
  | 'vet'
  | 'worming'
  | 'vaccination'
  | 'dental'
  | 'physio'
  | 'other';

export interface LogCare {
  horse: string;
  type: CareType;
  t: string; // HH:MM
  note: string;
}

export interface DayLog {
  sessions: LogSession[];
  checkins: LogCheckin[];
  practices: string[];
  care: LogCare[];
}

export type UserLog = Record<string, DayLog>; // key YYYY-MM-DD

// ---- user state: GPS rides ----

export interface RidePoint {
  la: number; // latitude
  ln: number; // longitude
  t: number; // seconds from ride start
}

export interface Ride {
  id: string;
  horse: string;
  name: string;
  date: string; // YYYY-MM-DD
  startedAt: number; // epoch ms
  km: number;
  min: number;
  avgKmh: number;
  maxKmh: number;
  note: string;
  points: RidePoint[];
}

// ---- user state: farms & paddocks ----

export type Grass = 'lush' | 'good' | 'short' | 'eaten down' | 'resting';

export interface Paddock {
  id: string;
  n: string;
  acres: number;
  grass: Grass;
  water: string;
  /** SVG polygon points on the farm's 0–100 grid, e.g. "2,2 48,2 48,50 2,50". */
  shape: string;
  /** Label anchor [x, y] on the same grid. */
  label: [number, number];
}

export type FarmFeatureKind = 'fence' | 'water' | 'gate';

/**
 * A painted map feature. `pts` is "x,y x,y …" on the farm's 0–100 grid:
 * fence = open polyline (≥2 points), water = closed outline (≥3 points),
 * gate = a two-point segment lying across the opening.
 */
export interface FarmFeature {
  id: string;
  kind: FarmFeatureKind;
  pts: string;
}

export interface PaddockMove {
  horse: string;
  from: string;
  to: string;
  at: string; // YYYY-MM-DD
}

/** One property: its paddocks, painted features, and who grazes where. */
export interface Farm {
  id: string;
  n: string;
  paddocks: Paddock[];
  features: FarmFeature[];
  /** horse id → paddock id (a horse lives on at most one farm at a time) */
  horses: Record<string, string>;
  moves: PaddockMove[];
}

export interface Paddocks {
  farms: Farm[];
}

// ---- user state: profile ----

export interface ProfileSettings {
  reminders: boolean;
  publicProfile: boolean;
}

export interface Profile {
  name: string;
  yardName: string;
  /** Riding since (year). */
  since: string;
  settings: ProfileSettings;
  lessonsDone: Record<string, boolean>;
  likes: Record<string, boolean>;
}

export interface UserPost extends Post {
  userGenerated: true;
  at: number; // epoch ms, for ordering
}

// ---- catalog bundle ----

export interface Catalog {
  disciplines: string[];
  levels: string[];
  exercises: Exercise[];
  feedCats: string[];
  feeds: FeedItem[];
  ailmentSystems: string[];
  ailments: Ailment[];
  practices: Practice[];
  courses: Course[];
  articles: Record<string, ArticleBlock[]>;
  friends: Friend[];
  breeds: Breed[];
  gaits: Gait[];
  markings: Marking[];
  ages: AgeRow[];
  signals: SignalRow[];
  glossary: GlossaryRow[];
  condition: ConditionScore[];
}

export interface FeedPost extends Post {
  liked: boolean;
}

// ---- auth ----

/** Which data the account reads/writes: the shared example db or the real UGC db. */
export type DataSource = 'demo' | 'prod';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  dataSource: DataSource;
}
