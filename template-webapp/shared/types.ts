// Macrobiotica domain types — shapes mirror design_handoff_macrobiotica_app/design_files/mb-data.js.
// yy scale: -1 = most yin (expansive, cooling) … +1 = most yang (contractive, warming).

export interface Food {
  id: string;
  n: string;
  cat: string;
  yy: number;
  note: string;
}

export interface CookMethod {
  m: string;
  shift: number;
  note: string;
}

export interface MealIngredient {
  n: string;
  ref?: string;
  amt: string;
  yy: number;
  note?: string;
}

export interface MealStep {
  s: string;
  e: number;
  note?: string;
}

export interface MealComment {
  who: string;
  t: string;
}

export interface Meal {
  id: string;
  n: string;
  yy: number;
  time: string;
  season: string;
  desc: string;
  ingredients: MealIngredient[];
  process: MealStep[];
  comments: MealComment[];
}

export interface AilmentEat {
  n: string;
  ref?: string;
  why: string;
}

export interface AilmentRemedy {
  n: string;
  how: string;
}

export interface Ailment {
  id: string;
  n: string;
  system: string;
  pattern: string;
  signs: string[];
  eat: AilmentEat[];
  remedies: AilmentRemedy[];
  practices: string[];
  avoid: string[];
  note: string;
}

export interface Practice {
  id: string;
  n: string;
  icon: string;
  tag: string;
  desc: string;
  steps: string[];
  why: string;
}

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

export interface PostComment {
  who: string;
  t: string;
}

export interface Post {
  id: string;
  who: string;
  initials: string;
  time: string;
  text: string;
  meal?: string;
  likes: number;
  comments: PostComment[];
}

export interface Friend {
  id: string;
  n: string;
  initials: string;
  relation: string;
  constitution: string;
  bal: number;
  trend: number[];
  cooking: string;
  note: string;
}

export interface ElementRow {
  el: string;
  organ: string;
  season: string;
  taste: string;
  emotion: string;
  colorVar: string;
  foods: string;
}

export interface ClockRow {
  h: number;
  label: string;
  organ: string;
  note: string;
}

export interface Animal {
  n: string;
  note: string;
}

export interface GlossaryRow {
  term: string;
  def: string;
}

export interface Zodiac {
  animal: string;
  note: string;
  element: string;
  polarity: string;
}

// ---- user state (Mongo-backed; replaces the prototype's localStorage keys) ----

export interface LogMeal {
  id: string;
  t: string; // HH:MM
}

export interface LogCheckin {
  t: string; // HH:MM
  v: number;
  note: string;
}

export interface DayLog {
  meals: LogMeal[];
  checkins: LogCheckin[];
  practices: string[];
}

export type UserLog = Record<string, DayLog>; // key YYYY-MM-DD

export interface ProfileSettings {
  reminders: boolean;
  publicProfile: boolean;
}

export interface Profile {
  name: string;
  birthYear: string;
  settings: ProfileSettings;
  lessonsDone: Record<string, boolean>;
  likes: Record<string, boolean>;
}

export interface UserPost extends Post {
  userGenerated: true;
  at: number; // epoch ms, for ordering
}

export interface Catalog {
  cats: string[];
  foods: Food[];
  cookMethods: CookMethod[];
  meals: Meal[];
  ailmentSystems: string[];
  ailments: Ailment[];
  practices: Practice[];
  courses: Course[];
  articles: Record<string, ArticleBlock[]>;
  friends: Friend[];
  elements: ElementRow[];
  clock: ClockRow[];
  animals: Animal[];
  zodiacElements: string[];
  glossary: GlossaryRow[];
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
