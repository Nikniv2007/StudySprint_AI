import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Rocket } from "lucide-react";

export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-soft">
        <Rocket className="h-5 w-5" />
      </span>
      {showText && (
        <span className="text-lg font-bold tracking-tight">
          StudySprint <span className="text-gradient">AI</span>
        </span>
      )}
    </Link>
  );
}
