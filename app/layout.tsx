import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

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
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
