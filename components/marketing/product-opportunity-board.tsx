"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, ChevronRight, CircleDollarSign, Gauge, Lightbulb, ShieldCheck, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Product = {
  id: string
  label: string
  title: string
  description: string
  icon: typeof Lightbulb
  accent: string
  eyebrow: string
  detail: string[]
  action: string
  href?: string
}

const products: Product[] = [
  {
    id: "strom",
    label: "Strom",
    title: "Stromkosten im Blick",
    description: "Vergleiche deinen aktuellen Vertrag mit passenden Stromtarifen.",
    icon: Lightbulb,
    accent: "bg-[#1677FF]/15 text-[#9DCAFF]",
    eyebrow: "Mögliche monatliche Optimierung",
    detail: ["Verbrauch strukturiert erfassen", "Preis und Laufzeit vergleichen", "Wechsel transparent vorbereiten"],
    action: "Tarife vergleichen",
    href: "https://www.check24.de/strom/?utm_source=finanzbg&utm_medium=partner&utm_campaign=produkte_strom",
  },
  {
    id: "internet",
    label: "Internet",
    title: "Vertrag, der zu dir passt",
    description: "Finde heraus, ob dein Internetvertrag noch zu deinem Alltag passt.",
    icon: Wifi,
    accent: "bg-[#1677FF]/15 text-[#9DCAFF]",
    eyebrow: "Noch nicht verfügbar",
    detail: ["Bandbreite und Bedarf klären", "Vertragslaufzeit prüfen", "Anbieterangebote später vergleichen"],
    action: "Auf die Merkliste",
  },
  {
    id: "versicherungen",
    label: "Versicherungen",
    title: "Schutz ohne Lücken",
    description: "Ordne deine Verträge und erkenne, wo Prüfung sinnvoll ist.",
    icon: ShieldCheck,
    accent: "bg-[#0B3D91]/25 text-[#BBD9FF]",
    eyebrow: "Noch nicht verfügbar",
    detail: ["Bestehende Verträge sammeln", "Deckung und Selbstbehalt prüfen", "Doppelte Absicherung vermeiden"],
    action: "Verträge prüfen",
  },
  {
    id: "kredit",
    label: "Kredit",
    title: "Finanzierung mit Klarheit",
    description: "Bereite deine Finanzierungsfragen vor, bevor du Angebote vergleichst.",
    icon: CircleDollarSign,
    accent: "bg-[#071B45]/70 text-[#9DCAFF]",
    eyebrow: "Noch nicht verfügbar",
    detail: ["Finanzierungsziel festhalten", "Rate und Laufzeit verstehen", "Keine Empfehlung ohne echte Anbieterbasis"],
    action: "Vormerken",
  },
]

export function ProductOpportunityBoard() {
  const [activeId, setActiveId] = useState("strom")
  const active = products.find((product) => product.id === activeId) ?? products[0]
  const ActiveIcon = active.icon

  return (
    <section className="relative overflow-hidden border-b border-[#0B3D91]/40 bg-[#030817] text-[#F4F8FF]" aria-labelledby="produkte-title">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:px-8">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-5 rounded-full border-[#1677FF]/40 bg-[#071B45]/70 px-3 py-1 text-[#BBD9FF] shadow-[0_0_24px_rgba(22,119,255,0.18)]">
            Dein Finanzradar
          </Badge>
          <h1 id="produkte-title" className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Finde die Hebel, die <span className="text-[#6EAFFF] drop-shadow-[0_0_18px_rgba(22,119,255,0.55)]">wirklich zählen.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            FinanzBG verbindet deine persönlichen Daten mit konkreten nächsten Schritten. Nicht alles ist sofort verfügbar — aber alles bleibt nachvollziehbar.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" role="tablist" aria-label="Finanzbereiche">
            {products.map((product) => {
              const Icon = product.icon
              const isActive = product.id === active.id
              return (
                <button
                  key={product.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(product.id)}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 motion-reduce:transform-none motion-reduce:transition-none ${isActive ? "border-[#1677FF]/70 bg-[#071B45]/90 shadow-[0_18px_50px_rgba(3,8,23,0.65),0_0_28px_rgba(22,119,255,0.16)] [transform:perspective(900px)_rotateX(2deg)_translateZ(8px)]" : "border-[#0B3D91]/45 bg-[#071B45]/45 hover:border-[#1677FF]/50 hover:bg-[#071B45]/75"}`}
                >
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${product.accent}`}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">{product.label}</span>
                    <span className="mt-1 block truncate text-sm text-muted-foreground">{product.title}</span>
                  </span>
                  <ChevronRight aria-hidden="true" className={`size-4 shrink-0 text-[#6EAFFF] transition-transform ${isActive ? "translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                </button>
              )
            })}
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-[#1677FF]/35 bg-[linear-gradient(145deg,rgba(11,61,145,0.42),rgba(7,27,69,0.9)_54%,rgba(3,8,23,0.98))] p-6 shadow-[0_32px_90px_rgba(3,8,23,0.82),inset_0_1px_0_rgba(157,202,255,0.2)] [transform:perspective(1400px)_rotateY(-2deg)] sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full border border-[#1677FF]/30 bg-[#1677FF]/10 shadow-[0_0_70px_rgba(22,119,255,0.25)]" />
            <div className="pointer-events-none absolute bottom-8 right-8 size-20 rounded-full border border-border bg-background/60" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className={`flex size-14 items-center justify-center rounded-2xl ${active.accent}`}>
                  <ActiveIcon aria-hidden="true" className="size-7" />
                </span>
                <Badge variant={active.href ? "default" : "secondary"}>{active.href ? "Partner verfügbar" : "In Vorbereitung"}</Badge>
              </div>
              <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{active.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{active.title}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{active.description}</p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {active.detail.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-foreground">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row sm:items-center">
                {active.href ? (
                  <Button asChild size="lg">
                    <a href={active.href} target="_blank" rel="sponsored noopener noreferrer">
                      {active.action}
                      <ArrowUpRight data-icon="inline-end" />
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" disabled>{active.action}</Button>
                )}
                <Link href="/steuer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Erst Potenziale prüfen
                  <Gauge aria-hidden="true" className="size-4" />
                </Link>
              </div>
              {active.href && <p className="mt-4 text-xs leading-5 text-muted-foreground">Anzeige / Partnerlink. FinanzBG erhält möglicherweise eine Vergütung. Die Konditionen werden beim Partner angezeigt.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
