import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin", className)} />;
}

/** Full-panel loading state with an AI "thinking" message. */
export function AILoading({ label = "StudySprint AI is thinking…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-14 text-center">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-brand-400/30 animate-pulse-ring" />
        <Spinner className="h-6 w-6 text-brand-600" />
      </div>
      <p className="text-sm font-medium text-brand-700">{label}</p>
    </div>
  );
}
