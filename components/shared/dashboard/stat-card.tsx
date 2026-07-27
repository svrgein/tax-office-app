import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  detail: string;
  trend: "up" | "down";
  icon: ReactNode;
  className?: string;
};

export function StatCard({
  title,
  value,
  detail,
  trend,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">{icon}</div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend === "up" ? (
          <span className="mr-2 flex items-center rounded-full bg-success/10 px-2 py-1 text-success">
            <ArrowUpRight className="mr-1 h-3.5 w-3.5" />
            {detail}
          </span>
        ) : (
          <span className="mr-2 flex items-center rounded-full bg-warning/10 px-2 py-1 text-warning">
            <ArrowDownRight className="mr-1 h-3.5 w-3.5" />
            {detail}
          </span>
        )}
      </div>
    </div>
  );
}
