"use client"

import { useRef } from "react"
import { FileUp, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"

export type DemoDocument = {
  name: string
  size: number
  type: string
  text: string
}

type Props = {
  document: DemoDocument | null
  onSelect: (document: DemoDocument) => void
  onAnalyze: () => void
  canAnalyze: boolean
  isAnalyzed: boolean
}

const acceptedTypes = ["application/pdf", "image/jpeg", "image/png"]
const maxSize = 10 * 1024 * 1024

export function DocumentIntake({ document, onSelect, onAnalyze, canAnalyze, isAnalyzed }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFile = (file?: File) => {
    if (!file || !acceptedTypes.includes(file.type) || file.size > maxSize) return
    onSelect({ name: file.name, size: file.size, type: file.type, text: file.type === "application/pdf" ? "PDF-Dokument" : "Bilddokument" })
  }

  return <section className="rounded-2xl border border-dashed border-primary/35 bg-primary/[0.04] p-6" aria-labelledby="intake-title">
    <div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileUp aria-hidden="true" /></span><div><div className="flex flex-wrap items-center gap-2"><h2 id="intake-title" className="font-semibold text-foreground">Dokument hinzufügen</h2><span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Lokaler Demo-Modus</span></div><p className="mt-1 text-sm leading-6 text-muted-foreground">Datei bleibt in dieser Vorschau und wird nicht an Supabase oder einen KI-Anbieter übertragen.</p></div></div>
    <input ref={inputRef} className="sr-only" type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => handleFile(event.target.files?.[0])} />
    <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-foreground">{document ? document.name : "Noch keine Datei ausgewählt"}</p><p className="text-xs text-muted-foreground">PDF, JPG oder PNG · maximal 10 MB</p></div><div className="flex gap-2"><Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>Datei auswählen</Button><Button type="button" onClick={onAnalyze} disabled={!canAnalyze || isAnalyzed}>{isAnalyzed ? "Analysiert" : "Analysieren"}</Button></div></div>
    <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole aria-hidden="true" className="size-3.5" />Lokale Validierung: Dateityp und Dateigröße werden geprüft.</p>
  </section>
}
