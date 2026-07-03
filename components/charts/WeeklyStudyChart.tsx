"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyStudyPoint } from "@/types";
import { formatMinutes } from "@/lib/utils/format";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { day: string } }>;
}

function StudyTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-border bg-white px-3 py-2 shadow-glow">
      <p className="text-xs font-medium text-muted-foreground">
        {p.payload.day}
      </p>
      <p className="text-sm font-bold text-brand-600">
        {formatMinutes(p.value)}
      </p>
    </div>
  );
}

export function WeeklyStudyChart({ data }: { data: WeeklyStudyPoint[] }) {
  const max = Math.max(...data.map((d) => d.minutes));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          tickFormatter={(v) => `${v}m`}
        />
        <Tooltip cursor={{ fill: "rgba(99,102,241,0.06)" }} content={<StudyTooltip />} />
        <Bar dataKey="minutes" radius={[6, 6, 0, 0]} maxBarSize={38}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.minutes === max ? "url(#barGrad)" : "#c7d2fe"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SubjectAreaChart({ data }: { data: WeeklyStudyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
        />
        <Tooltip content={<StudyTooltip />} />
        <Area
          type="monotone"
          dataKey="minutes"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          fill="url(#areaGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
