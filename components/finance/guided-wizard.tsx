"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, Check, CircleAlert, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n/language-context"

type WizardKind = "kindergeld" | "steuer"
type Answer = string | boolean

type Step = { id: string; title: string; question: string; help: string; fields: { id: string; label: string; type?: "date" | "number" | "text"; required?: boolean }[] }

const configs: Record<WizardKind, { steps: Step[]; href: string }> = {
  kindergeld: { href: "/kindergeld", steps: [
    { id: "applicant", title: "Antragsteller", question: "Wer stellt den Antrag?", help: "Diese Angaben werden später den persönlichen Feldern des KG1-Hauptantrags zugeordnet.", fields: [{ id: "firstName", label: "Vorname / Име", required: true }, { id: "lastName", label: "Nachname / Фамилия", required: true }, { id: "address", label: "Adresse / Адрес", required: true }] },
    { id: "child", title: "Kind", question: "Für welches Kind?", help: "Die Daten werden dem Kind-Abschnitt des KG1 und der Anlage Kind zugeordnet.", fields: [{ id: "childName", label: "Name des Kindes / Име на детето", required: true }, { id: "childBirthDate", label: "Geburtsdatum / Дата на раждане", type: "date", required: true }] },
    { id: "eligibility", title: "Voraussetzungen", question: "Welche Situation trifft zu?", help: "Es wird kein Anspruch berechnet. Die Auswahl markiert nur die Felder, die für eine spätere Prüfung relevant sind.", fields: [{ id: "livesInGermany", label: "Kind lebt in Deutschland / Детето живее в Германия", type: "text", required: true }, { id: "otherBenefits", label: "Andere Familienleistung / Друга семейна помощ", required: true }] },
  ] },
  steuer: { href: "/steuer", steps: [
    { id: "year", title: "Steuerjahr", question: "Für welches Steuerjahr?", help: "Das Steuerjahr bestimmt die verwendbaren Formulare und Fristen.", fields: [{ id: "taxYear", label: "Steuerjahr / Данъчна година", type: "number", required: true }] },
    { id: "employment", title: "Arbeit", question: "Welche Arbeitssituation trifft zu?", help: "Nur passende Folgefragen werden angezeigt.", fields: [{ id: "employmentType", label: "Arbeitsverhältnis / Трудова ситуация", required: true }, { id: "hasCommute", label: "Arbeitsweg vorhanden? / Имаш ли пътуване до работа?", required: true }] },
    { id: "expenses", title: "Ausgaben", question: "Welche abzugsfähigen Ausgaben möchtest du prüfen?", help: "Keine Beträge werden geschätzt. Belege können später ergänzt werden.", fields: [{ id: "hasHomeOffice", label: "Homeoffice / Работа от дома", required: true }, { id: "hasChildren", label: "Kinder / Деца", required: true }] },
  ] },
}

export function GuidedWizard({ kind }: { kind: WizardKind }) {
  const { locale } = useLanguage(); const de = locale === "de"; const config = configs[kind]
  const [step, setStep] = useState(0); const [answers, setAnswers] = useState<Record<string, Answer>>({}); const [savedAt, setSavedAt] = useState<string | null>(null); const [error, setError] = useState<string | null>(null)
  const current = config.steps[step]; const progress = Math.round(((step + 1) / config.steps.length) * 100)
  const requiredMissing = useMemo(() => current.fields.filter((field) => field.required && !String(answers[field.id] ?? "").trim()), [answers, current])
  useEffect(() => { const raw = window.sessionStorage.getItem(`finanzbg:${kind}:draft`); if (raw) setAnswers(JSON.parse(raw) as Record<string, Answer>) }, [kind])
  function update(id: string, value: Answer) { setAnswers((currentAnswers) => ({ ...currentAnswers, [id]: value })); setSavedAt(null) }
  function saveDraft() { window.sessionStorage.setItem(`finanzbg:${kind}:draft`, JSON.stringify(answers)); setSavedAt(new Date().toLocaleTimeString(locale === "de" ? "de-DE" : "bg-BG", { hour: "2-digit", minute: "2-digit" })) }
  function next() { if (requiredMissing.length) { setError(de ? "Bitte fülle die Pflichtfelder aus." : "Моля, попълни задължителните полета."); return } setError(null); saveDraft(); setStep((value) => Math.min(value + 1, config.steps.length - 1)) }
  return <main className="min-h-screen bg-background px-4 py-10"><div className="mx-auto max-w-3xl"><Link href={config.href} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />{de ? "Zurück" : "Назад"}</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-primary">FinanzberaterBG · {kind === "steuer" ? "Steuer" : "Kindergeld"}</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{de ? (kind === "steuer" ? "Steuererklärung vorbereiten" : "Kindergeld-Antrag vorbereiten") : (kind === "steuer" ? "Подготовка на данъчна декларация" : "Подготовка на заявление за Kindergeld")}</h1><p className="mt-3 text-muted-foreground">{de ? "Strukturierte Datenerfassung ohne erfundene Werte. Du prüfst alle Angaben vor dem nächsten Schritt." : "Структурирано събиране на данни без измислени стойности. Проверяваш всяка информация преди следващата стъпка."}</p><div className="mt-8 flex items-center gap-3" aria-label={de ? "Fortschritt" : "Напредък"}><div className="h-2 flex-1 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div><span className="text-sm font-medium">{progress}%</span></div><div className="mt-6 grid gap-2 sm:grid-cols-3">{config.steps.map((item, index) => <div key={item.id} className={`rounded-lg border p-3 text-sm ${index === step ? "border-primary bg-primary/10" : "border-border"}`}><span className="text-xs text-muted-foreground">{index + 1}</span><p className="font-medium">{item.title}</p></div>)}</div><section className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8"><div className="flex items-start gap-3"><CircleAlert className="mt-1 size-5 shrink-0 text-primary" /><div><h2 className="font-semibold">{current.question}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{current.help}</p></div></div><div className="mt-8 grid gap-5 sm:grid-cols-2">{current.fields.map((field) => <div key={field.id} className="space-y-2"><Label htmlFor={field.id}>{field.label}{field.required && <span className="text-destructive"> *</span>}</Label><Input id={field.id} type={field.type ?? "text"} value={String(answers[field.id] ?? "")} onChange={(event) => update(field.id, event.target.value)} autoComplete="off" /></div>)}</div>{error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}<div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><p className="text-sm text-muted-foreground">{savedAt ? `${de ? "Entwurf gespeichert" : "Черновата е запазена"} · ${savedAt}` : (de ? "Noch nicht gespeichert" : "Все още не е запазено")}</p><div className="flex gap-2"><Button type="button" variant="outline" onClick={saveDraft}><Save className="size-4" />{de ? "Speichern" : "Запази"}</Button><Button type="button" onClick={next}>{step === config.steps.length - 1 ? (de ? "Prüfung" : "Преглед") : (de ? "Weiter" : "Напред")} {step === config.steps.length - 1 ? <Check className="size-4" /> : <ArrowRight className="size-4" />}</Button></div></div></section></div></main>
}
