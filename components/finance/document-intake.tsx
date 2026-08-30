"use client"

import { FileUp, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DocumentIntake() {
  return <section className="rounded-2xl border border-dashed border-primary/35 bg-primary/[0.04] p-6" aria-labelledby="intake-title"><div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileUp aria-hidden="true" /></span><div><h2 id="intake-title" className="font-semibold text-foreground">Dokument hinzufügen</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Die Dokumentenverarbeitung ist in dieser Vorschau noch nicht konfiguriert.</p></div></div><div className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">PDF, JPG oder PNG · nur zur Vorbereitung</p><Button disabled variant="outline">Upload nicht verfügbar</Button></div><p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole aria-hidden="true" className="size-3.5" />Keine Datei wird gespeichert oder übertragen.</p></section>
}
