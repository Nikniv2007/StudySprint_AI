import {
  Sparkles,
  Clock,
  Flame,
  Play,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

/**
 * A static, self-contained mock of the app dashboard used as the hero visual.
 * Purely presentational — no state — so it renders instantly and looks premium.
 */
export function HeroPreview() {
  return (
    <div className="relative w-full">
      <div className="absolute -inset-4 rounded-[2rem] bg-brand-gradient opacity-20 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/95 p-5 shadow-glow backdrop-blur-xl">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">
              Wednesday · Today&apos;s Study Plan
            </p>
            <p className="text-lg font-bold text-slate-900">Welcome back, Alex</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
            <Flame className="h-3.5 w-3.5" /> 6-day streak
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {/* focus timer */}
          <div className="col-span-1 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-electric-500 p-4 text-white">
            <span className="font-mono text-2xl font-bold">24:15</span>
            <span className="mt-0.5 text-[10px] uppercase tracking-widest text-white/70">
              Focus
            </span>
            <button className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Play className="h-4 w-4" />
            </button>
          </div>

          {/* stats */}
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <MiniStat label="This week" value="9h 15m" tint="text-brand-600" />
            <MiniStat label="Sprints" value="12" tint="text-electric-500" />
            <MiniStat label="Avg quiz" value="84%" tint="text-success" />
            <MiniStat label="Streak" value="6 days" tint="text-warning" />
          </div>
        </div>

        {/* today's tasks */}
        <div className="mt-4 space-y-2">
          <TaskRow color="#22c55e" subject="Biology" title="Chapter 4 Review" time="45 min" urgent />
          <TaskRow color="#6366f1" subject="Math" title="Homework Practice" time="30 min" />
        </div>

        {/* AI rec */}
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-violet-100 bg-violet-50/70 p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <p className="text-xs leading-relaxed text-slate-600">
            <span className="font-semibold text-ai">AI tip:</span> Review Biology
            today — your quiz is in 2 days and confidence is low.
          </p>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute -left-6 top-24 hidden animate-fade-in rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-glow sm:flex sm:items-center sm:gap-2">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <span className="text-xs font-semibold text-slate-700">
          Sprint completed
        </span>
      </div>
      <div className="absolute -right-4 bottom-16 hidden animate-fade-in rounded-2xl border border-slate-100 bg-white px-3 py-2 shadow-glow sm:flex sm:items-center sm:gap-2">
        <TrendingUp className="h-4 w-4 text-brand-600" />
        <span className="text-xs font-semibold text-slate-700">+18% focus</span>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className={`mt-0.5 text-lg font-bold ${tint}`}>{value}</p>
    </div>
  );
}

function TaskRow({
  color,
  subject,
  title,
  time,
  urgent,
}: {
  color: string;
  subject: string;
  title: string;
  time: string;
  urgent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-2.5">
      <span
        className="h-8 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {subject}
        </p>
        <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
      </div>
      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
        <Clock className="h-3 w-3" />
        {time}
      </span>
      {urgent && (
        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-danger">
          Due soon
        </span>
      )}
    </div>
  );
}
