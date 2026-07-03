import * as React from "react";
import { PageHeader } from "@/components/study/Headers";
import { EmptyState } from "@/components/study/EmptyState";
import { Card } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";

export interface ComingSoonProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bullets: string[];
}

/**
 * Polished placeholder for feature pages that ship in later parts.
 * Keeps navigation fully working and communicates what each page will do.
 */
export function ComingSoon({
  eyebrow,
  title,
  subtitle,
  icon,
  bullets,
}: ComingSoonProps) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmptyState
            icon={icon}
            title={`${title} is coming together`}
            description="This module is part of the StudySprint AI roadmap. The foundation — layout, components, and data model — is fully wired and ready."
          />
        </div>

        <Card className="p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            What you&apos;ll be able to do
          </h3>
          <ul className="mt-4 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
