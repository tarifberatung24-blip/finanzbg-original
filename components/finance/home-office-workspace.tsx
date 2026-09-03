"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DocumentIntake, type DemoDocument } from "./document-intake"
import { DocumentFactsReview, type DemoFacts } from "./document-facts-review"
import { DocumentExplanation } from "./document-explanation"
import { ResponseDraftReview } from "./response-draft-review"
import { ReminderReview } from "./reminder-review"

const states = ["EMPTY", "NOT_CONFIGURED", "NEEDS_REVIEW", "USER_CONFIRMED", "READY_FOR_ACTION"]

export function HomeOfficeWorkspace() {
  const [document, setDocument] = useState<DemoDocument | null>(null)
  const [facts, setFacts] = useState<DemoFacts | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const analyze = () => { if (document) setFacts({ sender: "Finanzamt (Demo)", documentType: document.type === "application/pdf" ? "Bescheid (Demo)" : "Schreiben (Demo)", amount: "1.250,00 € (Demo)", deadline: "31.12.2026 (Demo)" }) }
  const save = () => { setConfirmed(true) }
  return <main className="min-h-screen bg-background"><header className="border-b border-border bg-card/90"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5"><Link href="/protected" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" aria-hidden="true" />Dashboard</Link><span className="text-sm text-muted-foreground">FinanzberaterBG</span></div></header><div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10"><section aria-labelledby="home-office-title"><div className="flex flex-wrap items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck aria-hidden="true" /></span><Badge variant="secondary">Lokaler Demo-Modus · keine Produktion</Badge></div><h1 id="home-office-title" className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground">AI Digital Home Office</h1><p className="mt-3 max-w-2xl text-pretty leading-7 text-muted-foreground">Dokumente lokal prüfen, Fakten bearbeiten und erst nach deiner Bestätigung weiterarbeiten.</p><div className="mt-5 flex flex-wrap gap-2" aria-label="Verfügbare Statuszustände">{states.map((state) => <Badge key={state} variant={state === "NEEDS_REVIEW" ? "default" : "outline"}>{state}</Badge>)}</div></section><div className="grid gap-5 lg:grid-cols-2"><DocumentIntake document={document} onSelect={(next) => { setDocument(next); setFacts(null); setConfirmed(false) }} onAnalyze={analyze} canAnalyze={Boolean(document)} isAnalyzed={Boolean(facts)} /><DocumentFactsReview facts={facts} confirmed={confirmed} onChange={(next) => { setFacts(next); setConfirmed(false) }} onSave={save} /><DocumentExplanation /><ResponseDraftReview /><ReminderReview /></div><aside className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">DEMO DATA — keine echte Verarbeitung.</strong> Supabase-Schema und KI-Anbieter sind für diesen Ablauf nicht erforderlich. Es wird nichts gespeichert, übertragen, versendet oder extern ausgeführt.</aside></div></main>
}
