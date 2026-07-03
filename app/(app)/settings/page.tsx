"use client";

import * as React from "react";
import { PageHeader, SectionHeader } from "@/components/study/Headers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { useToast } from "@/components/ui/Toast";
import { demoProfile } from "@/lib/data/demo";
import { User, Bell, Target, Palette } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [name, setName] = React.useState(demoProfile.name);
  const [email, setEmail] = React.useState(demoProfile.email);
  const [role, setRole] = React.useState(demoProfile.role);
  const [goal, setGoal] = React.useState(String(demoProfile.weeklyGoalMinutes));

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  function save(e: React.FormEvent) {
    e.preventDefault();
    toast({
      tone: "success",
      title: "Settings saved",
      description: "Your profile and study goals were updated.",
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile & Settings"
        title="Settings"
        subtitle="Manage your profile, study goals, and preferences."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="flex flex-col items-center p-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-2xl font-bold text-white shadow-glow">
            {initials}
          </div>
          <p className="mt-4 text-lg font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          <span className="mt-3 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700">
            {role.replace("-", " ")}
          </span>
          <div className="mt-6 grid w-full grid-cols-2 gap-3 border-t border-border pt-6 text-center">
            <div>
              <p className="text-xl font-bold text-brand-600">6</p>
              <p className="text-xs text-muted-foreground">day streak</p>
            </div>
            <div>
              <p className="text-xl font-bold text-electric-500">12</p>
              <p className="text-xs text-muted-foreground">sprints</p>
            </div>
          </div>
        </Card>

        {/* Forms */}
        <form onSubmit={save} className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <SectionHeader
              icon={<User className="h-5 w-5" />}
              title="Profile"
              description="Your basic information"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <SelectField
                label="I am a…"
                value={role}
                onChange={(e) => setRole(e.target.value as typeof role)}
                options={[
                  { label: "High School Student", value: "high-school" },
                  { label: "College Student", value: "college" },
                  { label: "Self-Learner", value: "self-learner" },
                ]}
              />
              <FormInput
                label="Weekly study goal (minutes)"
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                hint="Recommended: 600 minutes (10 hours)"
              />
            </div>
          </Card>

          <Card className="p-6">
            <SectionHeader
              icon={<Bell className="h-5 w-5" />}
              title="Preferences"
              description="How StudySprint AI works for you"
            />
            <div className="space-y-3">
              <ToggleRow icon={<Bell className="h-4 w-4" />} label="Deadline reminders" defaultChecked />
              <ToggleRow icon={<Target className="h-4 w-4" />} label="Daily study goal nudges" defaultChecked />
              <ToggleRow icon={<Palette className="h-4 w-4" />} label="Reduced motion" />
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
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
        className={`relative h-6 w-11 rounded-full transition-colors ${
          on ? "bg-brand-gradient" : "bg-muted"
        }`}
        aria-pressed={on}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            on ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
