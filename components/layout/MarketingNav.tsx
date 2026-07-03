"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Dashboard", href: "/dashboard" },
];

export function MarketingNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-navy-900/60 px-4 py-2.5 backdrop-blur-xl sm:mx-4 lg:mx-auto">
        <div className="[&_span:last-child]:text-white">
          <Logo href="/" />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              Log in
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">Get started</Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-1.5 text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-2xl border border-white/10 bg-navy-900/90 p-3 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard" onClick={() => setOpen(false)}>
            <Button className="mt-2 w-full">Get started</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
