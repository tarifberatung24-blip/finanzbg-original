"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, Bell, CheckCircle2, CircleDollarSign, FileText, Landmark, LifeBuoy, Receipt, ShieldCheck, WalletCards } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

type Reminder = { id: string; title: string; due_at: string | null }
type Props = { userId: string; firstName?: string | null; initialReminders: Reminder[] }

const navigation = [
  { href: "#uebersicht", label: "Übersicht" },
  { href: "#profil", label: "Mein Profil" },
  { href: "#dokumente", label: "Dokumente" },
  { href: "#vertraege", label: "Verträge" },
  { href: "#fristen", label: "Fristen" },
]

const modules = [
  { href: "/protected/home-office", label: "Дигитален Home Office", description: "Провери документи и подготви следващите стъпки", icon: FileText, tone: "bg-primary/10 text-primary" },
  { href: "/steuer", label: "Данъци", description: "Подготви структурирано данните за Steuererklärung", icon: Receipt, tone: "bg-primary/10 text-primary" },
  { href: "/anspruch", label: "Права и помощи", description: "Провери подходящи Leistungen и Zuschüsse", icon: Landmark, tone: "bg-success/15 text-success" },
  { href: "/kindergeld", label: "Kindergeld", description: "Подготви формуляри и личен списък със стъпки", icon: Landmark, tone: "bg-primary/10 text-primary" },
  { href: "/tarife", label: "Договори и тарифи", description: "Прегледай текущите разходи и договори", icon: WalletCards, tone: "bg-accent/10 text-accent" },
  { href: "/documents", label: "Документи", description: "Събери сигурно документите по теми", icon: FileText, tone: "bg-secondary text-foreground" },
]

function EmptyState({ title, description, href, action }: { title: string; description: string; href?: string; action?: string }) {
  return <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5"><p className="font-medium text-foreground">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>{href && action ? <Button asChild variant="outline" size="sm" className="mt-4"><Link href={href}>{action}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button> : null}</div>
}

export function DashboardWorkspace({ userId, firstName, initialReminders }: Props) {
  const [reminders, setReminders] = useState(initialReminders)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addReminder() {
    setSaving(true)
    setError(null)
    const supabase = createClient()
    const { data, error: insertError } = await supabase.from("reminders").insert({ user_id: userId, title: "Finanzprofil vervollständigen" }).select("id,title,due_at").single()
    if (insertError) setError("Напомнянето не можа да бъде запазено. Опитай отново.")
    if (data) setReminders((current) => [...current, data])
    setSaving(false)
  }

  return <main className="min-h-screen bg-background">
    <header className="border-b border-border bg-card/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5"><Link href="/" className="text-lg font-bold tracking-tight text-primary">FinanzberaterBG</Link><div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:block">Твоето лично Finanzbereich</span><form action="/auth/logout" method="post"><Button variant="outline" size="sm">Изход</Button></form></div></div>
    </header>
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
      <nav aria-label="Навигация в Kundenbereich" className="mb-8 flex gap-2 overflow-x-auto border-b border-border pb-3"><span className="sr-only">Раздели на таблото</span>{navigation.map((item, index) => <a key={item.href} href={item.href} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${index === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{item.label}</a>)}</nav>
      <section id="uebersicht" className="scroll-mt-6 border-b border-border pb-8" aria-labelledby="dashboard-title"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Твоето табло</p><h1 id="dashboard-title" className="mt-3 text-4xl font-bold tracking-tight text-foreground">Здравей{firstName ? `, ${firstName}` : ""}.</h1><p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">Подреди стъпка по стъпка важните си финансови теми в Германия.</p></div><div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success"><ShieldCheck className="h-4 w-4" /> Данните ти са защитени</div></div></section>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Финансови теми">{modules.map(({ href, label, description, icon: Icon, tone }) => <Link key={href} href={href} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span><h2 className="mt-5 font-semibold text-foreground">{label}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{description}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Отвори <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span></Link>)}</section>
      <section className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_1fr]"><div className="rounded-2xl border border-border bg-accent p-6 text-accent-foreground"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-accent-foreground/70">Препоръчана следваща стъпка</p><h2 className="mt-2 text-2xl font-bold">Попълни финансовия си профил</h2><p className="mt-3 max-w-lg text-sm leading-6 text-accent-foreground/75">Добави информация за доходи, домакинство и постоянни разходи, когато си готов.</p></div><CircleDollarSign className="hidden h-10 w-10 text-primary sm:block" /></div><Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"><Link href="/profil">Отвори профила <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button></div><div id="fristen" className="scroll-mt-6 rounded-2xl border border-border bg-card p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-foreground">Fristen и напомняния</h2><p className="mt-1 text-xs text-muted-foreground">Показват се само задачи, свързани с твоя профил.</p></div><Bell className="h-5 w-5 text-muted-foreground" /></div>{reminders.length ? <ul className="mt-4 divide-y divide-border">{reminders.slice(0, 3).map((item) => <li key={item.id} className="flex items-center gap-3 py-3 text-sm"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" /><span className="flex-1 text-foreground">{item.title}</span><span className="text-xs text-muted-foreground">{item.due_at ? new Date(item.due_at).toLocaleDateString("bg-BG") : "Без срок"}</span></li>)}</ul> : <p className="mt-4 text-sm leading-6 text-muted-foreground">Все още няма добавени напомняния.</p>}{error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}<Button variant="ghost" size="sm" className="mt-2 px-0 text-primary hover:bg-transparent hover:text-primary" onClick={addReminder} disabled={saving}>{saving ? "Запазване …" : "Добави напомняне"}</Button></div></section>
      <section className="mt-8 grid gap-4 md:grid-cols-2"><div id="profil" className="scroll-mt-6 rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></div><div><h2 className="font-semibold text-foreground">Mein Profil</h2><p className="text-sm text-muted-foreground">Лични данни и Finanzprofil</p></div></div><div className="mt-5"><EmptyState title="Провери профила си" description="Тук ще виждаш попълнените от теб данни. Не показваме примерни стойности." href="/profil" action="Отвори профила" /></div></div><div id="dokumente" className="scroll-mt-6 rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-primary" /><div><h2 className="font-semibold text-foreground">Dokumente</h2><p className="text-sm text-muted-foreground">Документи за Finanzamt и институции</p></div></div><div className="mt-5"><EmptyState title="Все още няма качени документи" description="Когато добавиш документ, той ще се появи тук по съответната тема." href="/documents" action="Към документите" /></div></div><div id="vertraege" className="scroll-mt-6 rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><WalletCards className="h-5 w-5 text-accent" /><div><h2 className="font-semibold text-foreground">Verträge</h2><p className="text-sm text-muted-foreground">Договори и текущи тарифи</p></div></div><div className="mt-5"><EmptyState title="Няма добавени договори" description="Добави договор само когато искаш да го прегледаш в Kundenbereich." href="/tarife" action="Към договорите" /></div></div><div className="rounded-2xl border border-border bg-card p-6"><div className="flex items-center gap-3"><LifeBuoy className="h-5 w-5 text-primary" /><div><h2 className="font-semibold text-foreground">Нужна ти е помощ?</h2><p className="text-sm text-muted-foreground">Избери тема, за да продължиш с ясна следваща стъпка.</p></div></div><Button asChild variant="outline" className="mt-5"><Link href="/uslugi">Разгледай услугите <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button></div></section>
    </div>
  </main>
}

/* Loading and server errors are handled by the route-level Next.js boundaries. */
export function DashboardLoadingState() { return <div className="min-h-screen bg-background p-6"><div className="mx-auto max-w-6xl animate-pulse space-y-6"><div className="h-6 w-48 rounded bg-muted" /><div className="h-32 rounded-2xl bg-muted" /><div className="grid gap-4 md:grid-cols-3"><div className="h-40 rounded-2xl bg-muted" /><div className="h-40 rounded-2xl bg-muted" /><div className="h-40 rounded-2xl bg-muted" /></div></div></div> }

export function DashboardErrorState() { return <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-5 text-center"><p className="text-lg font-semibold text-foreground">Таблото не можа да се зареди</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Провери връзката и опитай отново. Данните ти не са променени.</p><Button className="mt-5" onClick={() => window.location.reload()}>Опитай отново</Button></div> }
