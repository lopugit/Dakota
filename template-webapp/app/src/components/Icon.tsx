import {
  BookOpen,
  CalendarDays,
  Carrot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Droplets,
  Flame,
  Heart,
  Leaf,
  Menu,
  MessageCircle,
  Moon,
  Newspaper,
  Plus,
  Scale,
  Search,
  Soup,
  Sprout,
  Sun,
  User,
  Wheat,
  X,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';

// Static registry (keeps the bundle tree-shaken) — exactly the names the
// design system uses. Add here if a spec screen needs another one.
const REGISTRY: Record<string, ComponentType<LucideProps>> = {
  'book-open': BookOpen,
  'calendar-days': CalendarDays,
  carrot: Carrot,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  droplets: Droplets,
  flame: Flame,
  heart: Heart,
  leaf: Leaf,
  menu: Menu,
  'message-circle': MessageCircle,
  moon: Moon,
  newspaper: Newspaper,
  plus: Plus,
  scale: Scale,
  search: Search,
  soup: Soup,
  sprout: Sprout,
  sun: Sun,
  user: User,
  wheat: Wheat,
  x: X,
};

export interface IconProps {
  /** lucide icon name in kebab-case, e.g. "calendar-days" */
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

/** Lucide wrapper — 1.75px stroke (2px when active), 16–22px, monochrome only. */
export function Icon({ name, size = 18, strokeWidth = 1.75, color = 'currentColor', style, className }: IconProps) {
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
