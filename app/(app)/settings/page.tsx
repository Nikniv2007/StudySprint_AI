"use client";

import * as React from "react";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormInput, FormTextarea } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useLocalStorage } from "@/lib/storage/hooks";
import { STORAGE_KEYS, resetAllData } from "@/lib/storage";
import { demoProfile } from "@/lib/data/demo";
import type {
  UserProfile,
  StudyStyle,
  PlannerStyle,
  ReminderStyle,
  AIStrictness,
} from "@/types";
import {
  User,
  Brain,
  Palette,
  Bell,
  Target,
  Moon,
  Sun,
  RotateCcw,
  Save,
  BookOpen,
} from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, toggle } = useTheme();
  const [profile, setProfile] = useLocalStorage<UserProfile>(
    STORAGE_KEYS.profile,
    demoProfile
  );

  // Local editable copy so we only persist on Save.
  const [draft, setDraft] = React.useState<UserProfile>(profile);
  React.useEffect(() => setDraft(profile), [profile]);

  const initials = draft.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  function set<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    setProfile(draft);
    toast({
      tone: "success",
      title: "Settings saved",
      description: "Your profile and AI preferences were updated.",
    });
  }

  function reset() {
    if (!window.confirm("Reset ALL app data (assignments, sprints, decks, quizzes, notes)? This can't be undone.")) {
      return;
    }
    resetAllData();
    toast({
      tone: "warning",
      title: "Data reset",
      description: "Demo data will reload. Refresh to see a fresh workspace.",
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile & Settings"
        title="Settings"
        subtitle="Manage your profile, study goals, and how StudySprint AI coaches you."
        actions={
          <Button variant="outline" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile summary */}
        <Card className="flex h-fit flex-col items-center p-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-2xl font-bold text-white shadow-glow">
            {initials}
          </div>
          <p className="mt-4 text-lg font-semibold">{draft.name}</p>
          <p className="text-sm text-muted-foreground">{draft.email}</p>
          <span className="mt-3 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700 dark:bg-brand-500/15">
            {draft.gradeLevel} · {draft.schoolType}
          </span>
          <div className="mt-6 grid w-full grid-cols-2 gap-3 border-t border-border pt-6 text-center">
            <div>
              <p className="text-xl font-bold text-brand-600">{draft.streakDays}</p>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
            <div>
              <p className="text-xl font-bold text-electric-500">
                {Math.round(draft.weeklyGoalMinutes / 60)}h
              </p>
              <p className="text-xs text-muted-foreground">weekly goal</p>
            </div>
          </div>
        </Card>

        {/* Forms */}
        <form onSubmit={save} className="space-y-6 lg:col-span-2">
          {/* Profile */}
          <Card className="p-6">
            <SectionHeader icon={<User className="h-5 w-5" />} title="Profile" description="Your basic information" />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Full name" value={draft.name} onChange={(e) => set("name", e.target.value)} />
              <FormInput label="Email" type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
              <FormInput label="Grade level" value={draft.gradeLevel} onChange={(e) => set("gradeLevel", e.target.value)} hint="e.g. Sophomore, 11th grade" />
              <SelectField
                label="School type"
                value={draft.schoolType}
                onChange={(e) => set("schoolType", e.target.value)}
                options={[
                  { label: "High School", value: "High School" },
                  { label: "University", value: "University" },
                  { label: "Community College", value: "Community College" },
                  { label: "Self-Study", value: "Self-Study" },
                ]}
              />
              <FormInput
                label="Main subjects"
                value={draft.mainSubjects.join(", ")}
                onChange={(e) => set("mainSubjects", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                hint="Comma separated"
              />
              <FormInput label="Preferred study time" type="time" value={draft.preferredStudyTime} onChange={(e) => set("preferredStudyTime", e.target.value)} />
              <FormInput
                label="Daily study availability (min)"
                type="number"
                value={draft.dailyAvailabilityMinutes}
                onChange={(e) => set("dailyAvailabilityMinutes", Number(e.target.value))}
              />
              <FormInput
                label="Weekly study goal (min)"
                type="number"
                value={draft.weeklyGoalMinutes}
                onChange={(e) => set("weeklyGoalMinutes", Number(e.target.value))}
              />
            </div>
            <FormTextarea
              label="Study goals"
              value={draft.studyGoals}
              onChange={(e) => set("studyGoals", e.target.value)}
              className="mt-4 min-h-[70px]"
            />
          </Card>

          {/* AI personalization */}
          <Card className="p-6">
            <SectionHeader icon={<Brain className="h-5 w-5" />} title="AI personalization" description="Tune how StudySprint AI plans and coaches you" />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Study style"
                value={draft.studyStyle}
                onChange={(e) => set("studyStyle", e.target.value as StudyStyle)}
                options={[
                  { label: "Visual", value: "visual" },
                  { label: "Reading / Writing", value: "reading-writing" },
                  { label: "Practice-Based", value: "practice" },
                  { label: "Mixed", value: "mixed" },
                ]}
              />
              <SelectField
                label="Planner style"
                value={draft.plannerStyle}
                onChange={(e) => set("plannerStyle", e.target.value as PlannerStyle)}
                options={[
                  { label: "Relaxed", value: "relaxed" },
                  { label: "Balanced", value: "balanced" },
                  { label: "Aggressive", value: "aggressive" },
                  { label: "Exam Cram", value: "exam-cram" },
                ]}
              />
              <SelectField
                label="Reminder style"
                value={draft.reminderStyle}
                onChange={(e) => set("reminderStyle", e.target.value as ReminderStyle)}
                options={[
                  { label: "Gentle", value: "gentle" },
                  { label: "Motivational", value: "motivational" },
                  { label: "Strict", value: "strict" },
                  { label: "Minimal", value: "minimal" },
                ]}
              />
              <SelectField
                label="AI strictness"
                value={draft.aiStrictness}
                onChange={(e) => set("aiStrictness", e.target.value as AIStrictness)}
                options={[
                  { label: "Encouraging", value: "encouraging" },
                  { label: "Balanced", value: "balanced" },
                  { label: "Direct", value: "direct" },
                  { label: "Strict Coach", value: "strict-coach" },
                ]}
              />
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <SectionHeader icon={<Palette className="h-5 w-5" />} title="Appearance & preferences" />
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-brand-600">
                    {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </span>
                  <span className="text-sm font-medium">Dark mode</span>
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  className={`relative h-6 w-11 rounded-full transition-colors ${theme === "dark" ? "bg-brand-gradient" : "bg-muted"}`}
                  aria-pressed={theme === "dark"}
                  aria-label="Toggle dark mode"
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${theme === "dark" ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
              <ToggleRow icon={<Bell className="h-4 w-4" />} label="Deadline reminders" defaultChecked />
              <ToggleRow icon={<Target className="h-4 w-4" />} label="Daily study goal nudges" defaultChecked />
              <ToggleRow icon={<BookOpen className="h-4 w-4" />} label="Weekly progress email" />
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button type="button" variant="ghost" className="text-danger hover:bg-red-50 dark:hover:bg-red-500/10" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Reset all data
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setDraft(profile)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4" />
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  defaultChecked,
}: {
  icon: React.ReactNode;
  label: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = React.useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
      <div className="flex items-center gap-3">
        <span className="text-brand-600">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-brand-gradient" : "bg-muted"}`}
        aria-pressed={on}
        aria-label={label}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
