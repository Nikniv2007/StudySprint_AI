"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { navItems } from "./nav";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { Zap } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-card">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo href="/dashboard" />
      </div>

      <div className="px-4 pt-5">
        <Link href="/sprints">
          <Button className="w-full">
            <Zap className="h-4 w-4" />
            Start Sprint
          </Button>
        </Link>
      </div>

      <nav className="app-scroll flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  active
                    ? "text-brand-600"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-hero-gradient p-4 text-white">
          <p className="text-sm font-semibold">Study streak 🔥</p>
          <p className="mt-0.5 text-xs text-white/70">
            6 days in a row. Keep it going!
          </p>
        </div>
      </div>
    </aside>
  );
}
