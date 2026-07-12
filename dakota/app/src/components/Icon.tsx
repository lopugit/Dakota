import {
  Activity,
  Apple,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brush,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  ClipboardList,
  Clock,
  CloudSun,
  Compass,
  DoorOpen,
  Droplets,
  Eye,
  Fence,
  Flag,
  Flame,
  Footprints,
  Heart,
  Info,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Mountain,
  MousePointer2,
  Navigation,
  Newspaper,
  Pause,
  Pencil,
  PenTool,
  Play,
  Plus,
  Route,
  Ruler,
  Scissors,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Sprout,
  Square,
  Stethoscope,
  Sun,
  Syringe,
  Target,
  Thermometer,
  Timer,
  Tractor,
  Trash2,
  Trees,
  Trophy,
  Undo2,
  User,
  Users,
  Wheat,
  Wind,
  X,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';

// Static registry (keeps the bundle tree-shaken) — exactly the names Dakota
// screens use. Add here if a screen needs another one.
const REGISTRY: Record<string, ComponentType<LucideProps>> = {
  activity: Activity,
  apple: Apple,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'book-open': BookOpen,
  brush: Brush,
  'calendar-days': CalendarDays,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  circle: Circle,
  'clipboard-list': ClipboardList,
  clock: Clock,
  'cloud-sun': CloudSun,
  compass: Compass,
  'door-open': DoorOpen,
  droplets: Droplets,
  eye: Eye,
  fence: Fence,
  flag: Flag,
  flame: Flame,
  footprints: Footprints,
  heart: Heart,
  info: Info,
  map: Map,
  'map-pin': MapPin,
  menu: Menu,
  'message-circle': MessageCircle,
  moon: Moon,
  mountain: Mountain,
  'mouse-pointer': MousePointer2,
  navigation: Navigation,
  newspaper: Newspaper,
  pause: Pause,
  pencil: Pencil,
  'pen-tool': PenTool,
  play: Play,
  plus: Plus,
  route: Route,
  ruler: Ruler,
  scissors: Scissors,
  search: Search,
  'share-2': Share2,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  sprout: Sprout,
  square: Square,
  stethoscope: Stethoscope,
  sun: Sun,
  syringe: Syringe,
  target: Target,
  thermometer: Thermometer,
  timer: Timer,
  tractor: Tractor,
  trash: Trash2,
  trees: Trees,
  trophy: Trophy,
  undo: Undo2,
  user: User,
  users: Users,
  wheat: Wheat,
  wind: Wind,
  x: X,
};

export interface IconProps {
  /** lucide icon name in kebab-case, e.g. "calendar-days" — plus Dakota's own "horse". */
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

/** Dakota's one custom glyph: a horseshoe, heels down, four nail ticks. */
function Horseshoe({ size, strokeWidth, color, style, className }: Required<Pick<IconProps, 'size' | 'strokeWidth'>> & Pick<IconProps, 'color' | 'style' | 'className'>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      <path d="M7 21C5.7 17.2 5 13.5 5 10c0-4.4 3-7 7-7s7 2.6 7 7c0 3.5-.7 7.2-2 11" />
      <path d="M6.1 14h1.8" />
      <path d="M16.1 14h1.8" />
      <path d="M7.4 7.4l1.4 1" />
      <path d="M16.6 7.4l-1.4 1" />
    </svg>
  );
}

/** Lucide wrapper — 1.75px stroke (2px when active), 16–22px, monochrome only. */
export function Icon({ name, size = 18, strokeWidth = 1.75, color = 'currentColor', style, className }: IconProps) {
  if (name === 'horse') {
    return (
      <Horseshoe size={size} strokeWidth={strokeWidth} color={color} style={style} className={className} />
    );
  }
  const LucideIcon = REGISTRY[name];
  if (!LucideIcon) {
    if (import.meta.env.DEV) console.warn(`Icon: unknown name "${name}"`);
    return null;
  }
  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      style={style}
      className={className}
      aria-hidden="true"
    />
  );
}
