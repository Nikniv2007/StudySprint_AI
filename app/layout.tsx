import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider, ThemeScript } from "@/components/theme/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StudySprint AI — Study smarter. Sprint faster. Stay ahead.",
  description:
    "StudySprint AI turns your assignments, exams, notes, and goals into focused study sprints, smart schedules, quizzes, flashcards, and progress insights.",
  keywords: [
    "study planner",
    "AI study assistant",
    "flashcards",
    "focus timer",
    "quiz generator",
    "student productivity",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
