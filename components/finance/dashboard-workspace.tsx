"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRight, Bell, Bot, CheckCircle2, ChevronRight, CircleAlert, FileText, FolderOpen, Inbox, LifeBuoy, Menu, ShieldCheck, WalletCards, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

type Reminder = { id: string; title: string; due_at: string | null }
type Props = { userId: string; householdId?: string | null; firstName?: string | null; initialReminders: Reminder[] }

type NavItem = { href: string; label: string; icon: typeof Inbox }
const navItems: NavItem[] = [
  { href: "#uebersicht", label: "Обзор", icon: Inbox },
  { href: "#vertraege", label: "Моите договори", icon: WalletCards },
  { href: "#dokumente", label: "Документи", icon: FileText },
  { href: "#faelle", label: "Случаи и задачи", icon: FolderOpen },
  { href: "#nachrichten", label: "Съобщения", icon: Inbox },
  { href: "#assistant", label: "AI Assistant", icon: Bot },
  { href: "#benachrichtigungen", label: "Известия", icon: Bell },
  { href: "/profil", label: "Профил и настройки", icon: ShieldCheck },
]

const commands = ["Местя се на 1 октомври.", "Получих писмо от Inkasso.", "Обясни ми тази фактура."]

function EmptyState({ title, description, href, action }: { title: string; description: string; href?: string; action?: string }) {
  return <div className="rounded-xl border border-dashed border-border bg-muted/20 p-5"><p className="font-medium text-foreground">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>{href && action ? <Button asChild variant="outline" size="sm" className="mt-4"><Link href={href}>{action}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button> : null}</div>
}

function SectionHeading({ eyebrow, title, icon: Icon }: { eyebrow?: string; title: string; icon: typeof Inbox }) {
  return <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><div>{eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p> : null}<h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">{title}</h2></div></div>
}

export function DashboardWorkspace({ userId, householdId, firstName, initialReminders }: Props) {
  const [reminders, setReminders] = useState(initialReminders)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function addReminder() {
    if (!householdId) {
      setError("Създай първо Haushalt, за да запазиш задача.")
      return
    }
    setSaving(true); setError(null)
    const supabase = createClient()
    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert({ household_id: householdId, title: "Следваща административна стъпка" })
      .select("id,title,due_at")
      .single()
    if (insertError) setError("Задачата не можа да бъде запазена. Опитай отново.")
    if (data) setReminders((current) => [...current, data])
    setSaving(false)
  }

  return <main className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6"><Link href="/" className="text-lg font-bold tracking-tight text-primary">FinanzberaterBG</Link><div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground lg:block">Dein persönlicher Kundenbereich</span><form action="/auth/logout" method="post"><Button variant="outline" size="sm">Изход</Button></form><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Отвори навигацията" onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X /> : <Menu />}</Button></div></div></header>
    <div className="mx-auto flex max-w-7xl">
      <aside className={`fixed inset-x-0 top-[73px] z-10 border-b border-border bg-card p-4 lg:sticky lg:top-[73px] lg:block lg:h-[calc(100vh-73px)] lg:w-64 lg:shrink-0 lg:border-0 lg:border-r lg:bg-transparent lg:p-6 ${mobileOpen ? "block" : "hidden"}`}><nav aria-label="Навигация в Kundenbereich" className="flex flex-col gap-1">{navItems.map(({ href, label, icon: Icon }, index) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${index === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav><div className="mt-8 rounded-xl border border-success/20 bg-success/10 p-4"><ShieldCheck className="h-5 w-5 text-success" /><p className="mt-3 text-sm font-semibold">Сигурен Kundenbereich</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Оригиналните документи и потвърдените от теб данни са водещи.</p></div></aside>
      <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <section id="uebersicht" className="scroll-mt-24 border-b border-border pb-8"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">AI Home Office</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Здравей{firstName ? `, ${firstName}` : ""}.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">Твоят спокоен контролен център за договори, документи и административни задачи в Германия.</p></div><div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success"><ShieldCheck className="h-4 w-4" /> Защитено пространство</div></div></section>
        <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6" id="assistant"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">AI Assistant</p><h2 className="mt-1 text-xl font-bold">Какво искаш да подредим?</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Опиши намерението си на български. Асистентът ще подготви структура и немски Entwurf за твой преглед.</p></div></div><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input aria-label="Команда към AI Assistant" placeholder="Например: Искам да прекратя интернет договора." className="min-h-11 flex-1 rounded-lg border border-border bg-background px-4 text-sm outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-4" /><Button>Подготви Entwurf</Button></div><div className="mt-4 flex flex-wrap gap-2">{commands.map((command) => <span key={command} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground">„{command}“</span>)}</div><p className="mt-4 text-xs text-muted-foreground">AI-generated content · Няма да бъде изпратено съобщение без твоето изрично одобрение.</p></section>
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><div className="rounded-2xl border border-warning/30 bg-warning/10 p-5"><CircleAlert className="h-5 w-5 text-warning" /><p className="mt-4 text-sm font-semibold">Спешни срокове</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Няма потвърдени срокове за показване.</p></div><div className="rounded-2xl border border-border bg-card p-5"><WalletCards className="h-5 w-5 text-primary" /><p className="mt-4 text-sm font-semibold">Договори за внимание</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Все още няма добавени Verträge.</p></div><div className="rounded-2xl border border-border bg-card p-5"><FileText className="h-5 w-5 text-primary" /><p className="mt-4 text-sm font-semibold">Нови документи</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Качи първия документ за анализ.</p></div><div className="rounded-2xl border border-border bg-card p-5"><Inbox className="h-5 w-5 text-primary" /><p className="mt-4 text-sm font-semibold">Непрочетени отговори</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Няма налични съобщения.</p></div></section>
        <section id="vertraege" className="mt-10 scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6"><SectionHeading eyebrow="Verträge" title="Моите договори" icon={WalletCards} /><div className="mt-5"><EmptyState title="Няма добавени договори" description="Тук ще виждаш Strom, Gas, Internet, Mobilfunk, Versicherungen и други договори с Preis, Kündigungsfrist и статус." href="/tarife" action="Добави договор" /></div></section>
        <section id="dokumente" className="mt-6 scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6"><SectionHeading eyebrow="Dokumente" title="Последно получени документи" icon={FileText} /><div className="mt-5"><EmptyState title="Все още няма качени документи" description="Оригиналният файл ще остане различим от всяка AI-interpretation. Поддържай фактури, писма и Bescheide на едно сигурно място." href="/documents" action="Към сигурно качване" /></div></section>
        <div className="mt-6 grid gap-6 lg:grid-cols-2"><section id="faelle" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6"><SectionHeading eyebrow="Fälle & Aufgaben" title="Активни случаи и задачи" icon={FolderOpen} /><div className="mt-5"><EmptyState title="Няма активни случаи" description="Примерен workflow за Inkasso и Ratenzahlung ще се появи тук само след твое действие. Това не е правен съвет." /></div></section><section id="benachrichtigungen" className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6"><SectionHeading eyebrow="Fristen" title="Срокове и плащания" icon={Bell} /><div className="mt-5">{reminders.length ? <ul className="divide-y divide-border">{reminders.map((item) => <li key={item.id} className="flex items-center gap-3 py-3 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /><span className="flex-1">{item.title}</span><span className="text-xs text-muted-foreground">{item.due_at ? new Date(item.due_at).toLocaleDateString("bg-BG") : "Без срок"}</span></li>)}</ul> : <EmptyState title="Няма потвърдени напомняния" description="Ще показваме само срокове и плащания, които са свързани с твоите данни." />} {error ? <p role="alert" className="mt-3 text-sm text-destructive">{error}</p> : null}<Button variant="ghost" size="sm" className="mt-3 px-0 text-primary hover:bg-transparent hover:text-primary" onClick={addReminder} disabled={saving}>{saving ? "Запазване …" : "Добави задача за по-късно"}<ChevronRight className="ml-1 h-4 w-4" /></Button></div></section></div>
        <section id="nachrichten" className="mt-6 scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6"><SectionHeading eyebrow="Nachrichten" title="Съобщения от доставчици и институции" icon={Inbox} /><div className="mt-5"><EmptyState title="Няма получени отговори" description="Все още няма свързана поща или импортирани отговори. Изпращането през Gmail/Outlook не е активно." /></div></section>
        <section className="mt-6 rounded-2xl border border-border bg-muted/20 p-5 sm:p-6"><div className="flex items-start gap-3"><LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="font-semibold">Препоръчана следваща стъпка</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Започни с профила или качи един оригинален документ. AI може да помага със структура, но ти потвърждаваш фактите и всяко действие.</p><Button asChild variant="outline" size="sm" className="mt-4"><Link href="/profil">Отвори профил и настройки<ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button></div></div></section>
      </div>
    </div>
  </main>
}

export function DashboardLoadingState() { return <div className="min-h-screen bg-background p-6"><div className="mx-auto max-w-7xl animate-pulse space-y-6"><div className="h-8 w-48 rounded bg-muted" /><div className="h-36 rounded-2xl bg-muted" /><div className="grid gap-4 md:grid-cols-4"><div className="h-28 rounded-2xl bg-muted" /><div className="h-28 rounded-2xl bg-muted" /><div className="h-28 rounded-2xl bg-muted" /><div className="h-28 rounded-2xl bg-muted" /></div></div></div> }
export function DashboardErrorState() { return <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-5 text-center"><p className="text-lg font-semibold">Таблото не може да се зареди</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Провери връзката и опитай отново. Данните ти не са променени.</p><Button className="mt-5" onClick={() => window.location.reload()}>Опитай отново</Button></div> }

// Интерактивните действия са frontend foundation; изпращане и AI generation още не са свързани.
export type DashboardWorkspaceProps = Props
