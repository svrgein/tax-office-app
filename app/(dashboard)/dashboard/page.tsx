import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Plus,
  Receipt,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SectionCard } from "@/components/shared/dashboard/section-card";
import { StatCard } from "@/components/shared/dashboard/stat-card";

const stats = [
  {
    title: "Total Clients",
    value: "184",
    detail: "+12 this month",
    trend: "up" as const,
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Active Jobs",
    value: "27",
    detail: "4 urgent",
    trend: "up" as const,
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Tax Deadlines Today",
    value: "8",
    detail: "2 require follow-up",
    trend: "down" as const,
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    title: "Pending Invoices",
    value: "14",
    detail: "Rp 86.4M open",
    trend: "down" as const,
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: "Monthly Revenue",
    value: "Rp 312M",
    detail: "+8.2% vs last month",
    trend: "up" as const,
    icon: <CircleDollarSign className="h-5 w-5" />,
  },
];

const deadlines = [
  {
    client: "PT Bintang Sejahtera",
    task: "Annual tax filing",
    date: "Today • 09:00",
    priority: "High",
  },
  {
    client: "CV Harmoni Group",
    task: "VAT reconciliation",
    date: "Tomorrow • 13:30",
    priority: "Medium",
  },
  {
    client: "Yayasan Berkah",
    task: "Corporate tax review",
    date: "Thu, 10 Jul",
    priority: "Low",
  },
];

const activities = [
  {
    title: "Invoice #INV-104 approved",
    description: "Prepared and sent to PT Putra Abadi",
    time: "10 mins ago",
  },
  {
    title: "New document uploaded",
    description: "2024 financial statement for CV Maju",
    time: "32 mins ago",
  },
  {
    title: "Deadline reminder sent",
    description: "Follow-up for Alif & Partners",
    time: "1 hour ago",
  },
];

const documents = [
  {
    name: "2024 Audit Report.pdf",
    owner: "Ayu Lestari",
    size: "4.8 MB",
  },
  {
    name: "Invoice Pack - June.zip",
    owner: "Rizki Pratama",
    size: "12.1 MB",
  },
  {
    name: "Tax Assessment Letter.docx",
    owner: "Nadia Putri",
    size: "1.2 MB",
  },
];

const expenseBreakdown = [
  { label: "Operations", value: "42%", amount: "Rp 18.4M" },
  { label: "Staff", value: "31%", amount: "Rp 13.6M" },
  { label: "Software", value: "17%", amount: "Rp 7.5M" },
  { label: "Marketing", value: "10%", amount: "Rp 4.4M" },
];

const quickActions = [
  { label: "Add Client", icon: <Users className="h-4 w-4" /> },
  { label: "Add Expense", icon: <Wallet className="h-4 w-4" /> },
  { label: "Upload Document", icon: <FileText className="h-4 w-4" /> },
  { label: "Create Invoice", icon: <Plus className="h-4 w-4" /> },
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Weekly performance overview
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Welcome back, Aisyah.
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Your practice is running smoothly. You have 8 deadlines today,
                27 active jobs, and a healthy revenue trend for this month.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Monday, 27 July 2026
            </div>
            <p className="mt-1">3 priorities due before noon</p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <SectionCard
              title="Upcoming Tax Deadlines"
              description="Priority items for the next 3 working days"
            >
              <div className="space-y-3">
                {deadlines.map((item) => (
                  <div
                    key={item.client}
                    className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.client}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.task}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                        {item.priority}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Latest Uploaded Documents"
              description="Recently shared files for your clients"
            >
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.owner} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center text-sm font-medium text-primary">
                      View <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title="Recent Activities"
              description="The latest changes across your workspace"
            >
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.title}
                    className="rounded-2xl border border-border/70 bg-background/70 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-success/10 p-2 text-success">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Monthly Expense Summary"
              description="Spending trend for this month"
            >
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="mt-1 text-3xl font-semibold text-foreground">
                      Rp 43.9M
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    -3.1% vs target
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {expenseBreakdown.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.amount}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: item.value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Quick Actions" description="Common tasks to keep momentum">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className="rounded-lg bg-primary/10 p-2 text-primary">
                        {action.icon}
                      </span>
                      {action.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
