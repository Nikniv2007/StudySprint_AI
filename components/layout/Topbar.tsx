"use client";

import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";
import { Search, Bell, Zap } from "lucide-react";
import { demoProfile } from "@/lib/data/demo";

export function Topbar() {
  const initials = demoProfile.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
      <MobileNav />

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search subjects, tasks, notes…"
          className="h-10 w-full rounded-xl border border-input bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors focus:border-brand-300 focus:bg-white"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/sprints" className="hidden sm:block">
          <Button size="sm">
            <Zap className="h-4 w-4" />
            Start Sprint
          </Button>
        </Link>
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger ring-2 ring-card" />
        </button>
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white"
          aria-label="Profile"
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
