"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, Bell, Bot, CalendarClock, CheckCircle2, FileText, HelpCircle, LayoutDashboard, Menu, Search, Settings, ShieldCheck, WalletCards } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSmartDashboardNextAction, getSmartDashboardProblems, smartDashboardAgents, type SmartDashboardStats } from "@/lib/kintex-smart-dashboard"

type Profile = { completeness: number | null; employment_status: string | null; household_size: number | null; monthly_income: number | null; monthly_fixed_costs: number | null } | null
type Contract = { id: string; title: string; category: string; provider_name: string | null; monthly_amount: number | null; status: string | null; created_at: string | null }
type Document = { id: string; original_filename: string; processing_status: string | null; created_at: string | null; size_bytes: number | null }
type Reminder = { id: string; title: string; due_at: string | null; status: string | null; created_at: string | null }
type AuditEvent = { id: string; event_type: string; event_summary: string | null; entity_type: string | null; created_at: string | null }
type Props = { firstName?: string | null; profile: Profile; contracts: Contract[]; documents: Document[]; reviewCount: number; reminders: Reminder[]; auditEvents: AuditEvent[] }

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vertraege", label: "Contracts", icon: WalletCards },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/protected/home-office", label: "AI Assistant", icon: Bot },
  { href: "/protected?module=deadlines", label: "Deadlines", icon: CalendarClock },
  { href: "/protected?module=opportunities", label: "Radar", icon: BarChart3 },
]

function formatDate(value: string | null) { return value ? new Intl.DateTimeFormat("bg-BG", { dateStyle: "medium" }).format(new Date(value)) : "Няма дата" }
function money(value: number | null) { return value == null ? "Няма данни" : `${Number(value).toFixed(2)} €` }
function Pill({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "active" | "warn" }) { return <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${tone === "active" ? "bg-[#ffb81c] text-black" : tone === "warn" ? "bg-black text-white" : "bg-[#f3f4f6] text-[#6b7280]"}`}>{children}</span> }
function Kpi({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof LayoutDashboard }) { return <div className="rounded-[28px] border border-[#e6e8ee] bg-white p-5 shadow-[0_14px_30px_rgba(20,28,45,.06)]"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-[#6b7280]">{label}</p><span className="grid size-10 place-items-center rounded-2xl bg-[#f3f4f6]"><Icon className="size-5 text-black" /></span></div><p className="mt-4 text-3xl font-bold tracking-tight text-black">{value}</p><p className="mt-1 text-xs text-[#6b7280]">{note}</p></div> }

export function SmartDashboardPreview({ firstName, profile, contracts, documents, reviewCount, reminders, auditEvents }: Props) {
  const stats: SmartDashboardStats = { profileCompleteness: profile?.completeness ?? 0, contracts: contracts.length, documents: documents.length }
  const nextAction = getSmartDashboardNextAction(stats, "bg")
  const problems = getSmartDashboardProblems(stats)
  const monthlyTotal = contracts.reduce((sum, contract) => sum + (Number(contract.monthly_amount) || 0), 0)
  const missingContractCosts = contracts.filter((contract) => contract.monthly_amount == null).length
  const upcomingReminders = reminders.filter((item) => item.due_at).length

  return <main className="min-h-screen bg-[#f5f6fa] text-[#111827]">
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-[#e2e5ec] bg-white p-6 lg:block">
        <div className="mb-10"><p className="text-2xl font-black tracking-[-.04em] text-black"><span className="bg-[#ffde05] px-1">KintexBG</span><span className="text-[#ffb81c]">.</span></p><p className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#8a5a00]">BY VZG CONSULT</p></div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-[#9ca3af]">Menu</p>
        <nav className="space-y-2">{nav.map((item) => <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#6b7280] hover:bg-[#f3f4f6] hover:text-black"><item.icon className="size-5" />{item.label}</Link>)}</nav>
        <div className="mt-10 border-t border-[#e2e5ec] pt-5"><Link href="/profil" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#6b7280] hover:bg-[#f3f4f6]"><Settings className="size-5" />Profile</Link><Link href="/protected/security" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#6b7280] hover:bg-[#f3f4f6]"><HelpCircle className="size-5" />Security</Link></div>
      </aside>

      <section className="min-w-0 p-4 sm:p-6 xl:p-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3 lg:hidden"><Button variant="outline" size="icon"><Menu className="size-5" /></Button><strong>KintexBG</strong></div><div className="relative max-w-xl flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" /><Input className="h-12 rounded-2xl border-[#e2e5ec] bg-white pl-11" placeholder="Search contracts, documents, deadlines" /></div><div className="flex items-center gap-3"><Button variant="outline" className="h-12 rounded-2xl bg-white"><Bell className="size-4" />{reviewCount}</Button><Button className="h-12 rounded-2xl bg-black px-5 text-white hover:bg-[#ffb81c] hover:text-black">+ Add document</Button></div></header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-[32px] bg-black p-7 text-white shadow-[0_18px_45px_rgba(20,28,45,.18)]"><div className="flex flex-wrap items-start justify-between gap-6"><div><p className="font-mono text-xs uppercase tracking-[.18em] text-[#ffb81c]">Smart Financial Home Office</p><h1 className="mt-5 max-w-3xl text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">{firstName ? `${firstName}, ` : ""}контролирай всичко от един dashboard.</h1><p className="mt-5 max-w-2xl text-sm leading-6 text-white/70">Договори, документи, срокове и AI review от реални Supabase данни. Без измислени баланси, оферти или обещани спестявания.</p></div><div className="rounded-[24px] border border-white/15 bg-white/10 p-5"><p className="text-xs text-white/60">Next action</p><p className="mt-2 text-2xl font-bold">{nextAction.label}</p><Button asChild className="mt-5 rounded-2xl bg-[#ffb81c] text-black hover:bg-white"><Link href={nextAction.href}>Start<ArrowRight className="size-4" /></Link></Button></div></div></section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Kpi label="Profile" value={`${stats.profileCompleteness}%`} note="Confirmed base data" icon={ShieldCheck} /><Kpi label="Contracts" value={String(contracts.length)} note="Household records" icon={WalletCards} /><Kpi label="Documents" value={String(documents.length)} note="Storage metadata" icon={FileText} /><Kpi label="Review" value={String(reviewCount)} note="Needs confirmation" icon={CheckCircle2} /></section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><div className="rounded-[28px] border border-[#e6e8ee] bg-white p-6 shadow-[0_14px_30px_rgba(20,28,45,.06)]"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Kintex Radar</h2><p className="text-sm text-[#6b7280]">Ranked operational signals</p></div><Pill tone={problems.length ? "warn" : "active"}>{problems.length ? `${problems.length} open` : "ready"}</Pill></div><div className="mt-6 space-y-3">{problems.length === 0 ? <p className="rounded-2xl bg-[#f3f4f6] p-4 text-sm text-[#6b7280]">Няма блокиращи сигнали. Готово за AI review.</p> : problems.map((problem) => <div key={problem.code} className="flex items-center justify-between rounded-2xl border border-[#e6e8ee] p-4"><div><p className="font-semibold">{problem.code}</p><p className="text-xs text-[#6b7280]">module: {problem.module}</p></div><Pill>{problem.severity}</Pill></div>)}</div></div><div className="rounded-[28px] border border-[#e6e8ee] bg-white p-6 shadow-[0_14px_30px_rgba(20,28,45,.06)]"><h2 className="text-xl font-bold">Financial state</h2><p className="mt-4 text-4xl font-black tracking-tight">{monthlyTotal ? money(monthlyTotal) : "Няма данни"}</p><p className="mt-2 text-sm text-[#6b7280]">Monthly costs from entered contracts only.</p><div className="mt-6 rounded-2xl bg-[#f3f4f6] p-4"><p className="text-sm font-semibold">Missing costs</p><p className="mt-1 text-2xl font-bold">{missingContractCosts}</p></div></div></section>

            <section className="grid gap-6 xl:grid-cols-2"><div className="rounded-[28px] border border-[#e6e8ee] bg-white p-6 shadow-[0_14px_30px_rgba(20,28,45,.06)]"><h2 className="text-xl font-bold">Contracts</h2><div className="mt-5 space-y-3">{contracts.length === 0 ? <p className="text-sm text-[#6b7280]">Все още няма договори.</p> : contracts.slice(0,4).map((contract) => <div key={contract.id} className="flex items-center justify-between rounded-2xl bg-[#f3f4f6] p-4"><div><p className="font-semibold">{contract.title}</p><p className="text-xs text-[#6b7280]">{contract.provider_name ?? contract.category}</p></div><p className="font-bold">{money(contract.monthly_amount)}</p></div>)}</div></div><div className="rounded-[28px] border border-[#e6e8ee] bg-white p-6 shadow-[0_14px_30px_rgba(20,28,45,.06)]"><h2 className="text-xl font-bold">Documents</h2><div className="mt-5 space-y-3">{documents.length === 0 ? <p className="text-sm text-[#6b7280]">Все още няма документи.</p> : documents.slice(0,4).map((document) => <div key={document.id} className="flex items-center justify-between rounded-2xl bg-[#f3f4f6] p-4"><div className="min-w-0"><p className="truncate font-semibold">{document.original_filename}</p><p className="text-xs text-[#6b7280]">{formatDate(document.created_at)}</p></div><Pill>{document.processing_status ?? "uploaded"}</Pill></div>)}</div></div></section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-[#e6e8ee] bg-white p-6 shadow-[0_14px_30px_rgba(20,28,45,.06)]"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[#ffb81c]"><Bot className="size-5 text-black" /></span><div><h2 className="text-xl font-bold">AI Home Office</h2><p className="text-xs text-[#6b7280]">inside dashboard</p></div></div><div className="mt-5 rounded-[24px] bg-black p-5 text-white"><p className="text-sm leading-6 text-white/75">Питай за документи, договори и следваща стъпка. Отговорите трябва да са grounded само в потвърдени household данни.</p><Button asChild className="mt-5 rounded-2xl bg-[#ffb81c] text-black hover:bg-white"><Link href="/protected/home-office">Open chat</Link></Button></div><div className="mt-5 grid gap-3">{smartDashboardAgents.slice(0,4).map((agent) => <div key={agent.id} className="rounded-2xl border border-[#e6e8ee] p-3"><p className="font-mono text-[10px] text-[#6b7280]">{agent.stage} / {agent.status}</p><p className="mt-1 text-sm font-bold">{agent.title}</p></div>)}</div></section>
            <section className="rounded-[32px] border border-[#e6e8ee] bg-white p-6 shadow-[0_14px_30px_rgba(20,28,45,.06)]"><h2 className="text-xl font-bold">Reminders</h2><div className="mt-5 space-y-3">{reminders.length === 0 ? <p className="text-sm text-[#6b7280]">Няма записани срокове.</p> : reminders.map((reminder) => <div key={reminder.id} className="rounded-2xl bg-[#f3f4f6] p-4"><p className="font-semibold">{reminder.title}</p><p className="text-xs text-[#6b7280]">{formatDate(reminder.due_at)}</p></div>)}</div><p className="mt-5 text-xs text-[#6b7280]">Upcoming: {upcomingReminders}</p></section>
            <section className="rounded-[32px] border border-[#e6e8ee] bg-white p-6 shadow-[0_14px_30px_rgba(20,28,45,.06)]"><h2 className="text-xl font-bold">Activity</h2><div className="mt-5 space-y-3">{auditEvents.length === 0 ? <p className="text-sm text-[#6b7280]">Няма audit събития.</p> : auditEvents.map((event) => <div key={event.id} className="border-b border-[#e6e8ee] pb-3"><p className="text-sm font-semibold">{event.event_summary ?? event.event_type}</p><p className="text-xs text-[#6b7280]">{event.entity_type ?? "system"} · {formatDate(event.created_at)}</p></div>)}</div></section>
          </aside>
        </div>
      </section>
    </div>

    <div className="pointer-events-none fixed bottom-6 right-6 hidden md:block"><div className="relative"><div className="absolute -inset-3 rounded-full bg-[#5b8cff]/20 blur-xl" /><div className="relative grid size-24 place-items-center rounded-[32px] border-4 border-[#2857d9] bg-[#5b8cff] shadow-2xl"><div className="grid size-14 place-items-center rounded-2xl bg-[#111827] text-[#8ff6ff]"><Bot className="size-8" /></div></div><div className="absolute -right-2 bottom-1 size-7 rounded-full bg-[#ffb81c]" /></div></div>
  </main>
}

