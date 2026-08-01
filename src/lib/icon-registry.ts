import {
  Briefcase, Sparkles, LineChart, Cpu, Megaphone, GraduationCap, Apple, HeartPulse,
  Wrench, Key, Zap, Dumbbell, Leaf, Brain, Scale, Home, Car, Scissors, Camera,
  Utensils, Dog, Baby, Stethoscope, Hammer, Droplet, Flame, Shield, Star, Paintbrush,
  Palette, Music, Plane, Building2, ShoppingBag, Laptop, Users,
  type LucideIcon,
} from "lucide-react";

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  sparkles: Sparkles,
  "line-chart": LineChart,
  cpu: Cpu,
  megaphone: Megaphone,
  "graduation-cap": GraduationCap,
  apple: Apple,
  "heart-pulse": HeartPulse,
  wrench: Wrench,
  key: Key,
  zap: Zap,
  dumbbell: Dumbbell,
  leaf: Leaf,
  brain: Brain,
  scale: Scale,
  home: Home,
  car: Car,
  scissors: Scissors,
  camera: Camera,
  utensils: Utensils,
  dog: Dog,
  baby: Baby,
  stethoscope: Stethoscope,
  hammer: Hammer,
  droplet: Droplet,
  flame: Flame,
  shield: Shield,
  star: Star,
  paintbrush: Paintbrush,
  palette: Palette,
  music: Music,
  plane: Plane,
  building: Building2,
  "shopping-bag": ShoppingBag,
  laptop: Laptop,
  users: Users,
};

export const ICON_KEYS = Object.keys(ICON_REGISTRY);

export function iconFor(key: string): LucideIcon {
  return ICON_REGISTRY[key] ?? Star;
}
