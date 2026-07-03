import Link from "next/link";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "AI Planner", href: "/planner" },
      { label: "Flashcards", href: "/flashcards" },
      { label: "Focus Mode", href: "/focus" },
    ],
  },
  {
    title: "Study Tools",
    links: [
      { label: "Quiz Generator", href: "/quizzes" },
      { label: "Notes Summarizer", href: "/notes" },
      { label: "Progress Tracker", href: "/progress" },
      { label: "Study History", href: "/history" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="[&_span:last-child]:text-white">
            <Logo href="/" />
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Study smarter. Sprint faster. Stay ahead. Turn assignments, exams,
            and notes into focused study sprints.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-white">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} StudySprint AI. All rights reserved.</p>
          <p>Built for students who want to stay ahead.</p>
        </div>
      </div>
    </footer>
  );
}
