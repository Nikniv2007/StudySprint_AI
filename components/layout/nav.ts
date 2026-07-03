import {
  LayoutDashboard,
  CalendarClock,
  Rocket,
  ClipboardList,
  Layers,
  HelpCircle,
  FileText,
  Timer,
  BarChart3,
  History,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Planner", href: "/planner", icon: CalendarClock },
  { label: "Sprints", href: "/sprints", icon: Rocket },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "Flashcards", href: "/flashcards", icon: Layers },
  { label: "Quizzes", href: "/quizzes", icon: HelpCircle },
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Focus Mode", href: "/focus", icon: Timer },
  { label: "Progress", href: "/progress", icon: BarChart3 },
  { label: "History", href: "/history", icon: History },
  { label: "Settings", href: "/settings", icon: Settings },
];
