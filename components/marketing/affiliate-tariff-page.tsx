"use client"

import Link from "next/link"
import Script from "next/script"
import { useParams } from "next/navigation"
import { ArrowRight, Check, ExternalLink, Info, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const copy = {
  bg: {
    eyebrow: "Сравнение на комунални услуги",
    title: "Сравни ток и газ в Германия с CHECK24",
    intro: "Използвай официалните калкулатори на CHECK24, за да сравниш наличните оферти според твоя адрес, потребление и договор.",
    back: "Към тарифите",
    preview: "Виж CHECK24 preview",
    electricity: "Електроенергия",
    gas: "Газ",
    widgetHint: "Калкулаторът се зарежда директно от CHECK24. За оптимално изживяване е нужна ширина поне 900 px.",
    blocked: "Ако калкулаторът не се зареди, отвори CHECK24 preview или провери блокиращите скриптове в браузъра.",
    how: "Как да използваш сравнението",
    prepare: "Подготви предварително",
    steps: ["Избери електроенергия или газ и въведи немския пощенски код и адрес.", "Въведи годишното потребление в kWh от последната сметка. Обикновено е означено като Jahresverbrauch или Verbrauch. Ако липсва, използвай само разумна приблизителна стойност.", "Провери текущата тарифа и договора: бонуси, ценова гаранция, срок, срок за предизвестие и прогнозна годишна цена.", "Сравни офертите и отвори избрания доставчик през официалния резултатен поток на CHECK24.", "Преди смяна потвърди началната дата, кой подава предизвестието, данните на електромера, начина на плащане и запази потвърждението."],
    checklist: ["Последната годишна сметка", "Пощенски код и адрес в Германия", "Годишно потребление в kWh", "Номер/данни на електромера, ако са поискани", "Текущ доставчик и договорни срокове"],
    note: "Не обещаваме фиксиран процент спестяване. Цените и възможната разлика зависят от местоположението, потреблението, договора и пазарните условия.",
    disclosure: "Партньорско разкриване: страницата може да съдържа партньорски/affiliate линкове. За клиента няма допълнителна такса, а FinanzberaterBG може да получи комисиона.",
    loading: "CHECK24 калкулаторът се зарежда…",
  },
  de: {
    eyebrow: "Vergleich von Energieverträgen",
    title: "Strom und Gas in Deutschland mit CHECK24 vergleichen",
    intro: "Nutze die offiziellen CHECK24-Rechner, um Angebote nach deiner Adresse, deinem Verbrauch und deinem Vertrag zu vergleichen.",
    back: "Zu den Tarifen",
    preview: "CHECK24-Vorschau öffnen",
    electricity: "Strom",
    gas: "Gas",
    widgetHint: "Der Rechner wird direkt von CHECK24 geladen. Für eine optimale Darstellung werden mindestens 900 px Breite empfohlen.",
    blocked: "Wenn der Rechner nicht lädt, öffne die CHECK24-Vorschau oder prüfe blockierte Skripte im Browser.",
    how: "So funktioniert der Vergleich",
    prepare: "Vorbereiten",
    steps: ["Wähle Strom oder Gas und gib deine deutsche Postleitzahl und Adresse ein.", "Gib den Jahresverbrauch in kWh aus der letzten Rechnung ein. Er steht meist als Jahresverbrauch oder Verbrauch dort. Schätze nur, wenn die Angabe wirklich fehlt.", "Prüfe aktuellen Tarif und Vertrag: Bonusbedingungen, Preisgarantie, Laufzeit, Kündigungsfrist und geschätzte Jahreskosten.", "Vergleiche die Angebote und öffne den ausgewählten Anbieter über den offiziellen CHECK24-Ergebnisfluss.", "Bestätige vor dem Wechsel Startdatum, Kündigungsverantwortung, Zählerdaten und Zahlungsart und speichere die Bestätigung."],
    checklist: ["Letzte Jahresabrechnung", "Deutsche Postleitzahl und Adresse", "Jahresverbrauch in kWh", "Zählerdaten, falls angefordert", "Aktueller Anbieter und Vertragsfristen"],
    note: "Wir versprechen keinen festen Prozentsatz an Ersparnis. Preise und mögliche Einsparungen hängen von Standort, Verbrauch, Vertrag und Marktlage ab.",
    disclosure: "Affiliate-Hinweis: Diese Seite kann Partner-/Affiliate-Links enthalten. Für Kunden entstehen keine zusätzlichen Kosten; FinanzberaterBG kann eine Provision erhalten.",
    loading: "CHECK24-Rechner wird geladen…",
  },
} as const

function Widget({ kind, title, loading }: { kind: "power" | "gas"; title: string; loading: string }) {
  const id = kind === "power" ? "c24pp-power-iframe" : "c24pp-gas-iframe"
  const src = kind === "power" ? "https://files.check24.net/widgets/auto/1174585/c24pp-power-iframe/power-iframe.js" : "https://files.check24.net/widgets/auto/1174585/c24pp-gas-iframe/gas-iframe.js"
  return <Card className="overflow-hidden border-border bg-card/80"><CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />{title}</CardTitle></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">{loading}</p><div className="overflow-x-auto rounded-lg border border-border bg-background p-2"><div style={{ width: "100%", minWidth: 900 }} id={id} data-scrollto="begin"><p className="p-6 text-center text-sm text-muted-foreground">{loading}</p></div><Script src={src} strategy="afterInteractive" onError={() => undefined} /></div></CardContent></Card>
}

export default function AffiliateTariffPage() {
  const locale = (useParams<{ locale?: string }>().locale === "de" ? "de" : "bg") as keyof typeof copy
  const t = copy[locale]
  return <main className="min-h-screen bg-background"><section className="border-b border-border bg-muted/20"><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"><div className="max-w-3xl space-y-5"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t.eyebrow}</p><h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{t.title}</h1><p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{t.intro}</p><div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/tarife"><ArrowRight className="mr-2 h-4 w-4 rotate-180" />{t.back}</Link></Button><Button asChild><a href="https://a.check24.net/misc/click.php?pid=1174585&aid=19&product_id=2&style=" target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />{t.preview}</a></Button></div></div></div></section><div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8"><div className="grid gap-6 lg:grid-cols-2"><Widget kind="power" title={t.electricity} loading={t.loading} /><Widget kind="gas" title={t.gas} loading={t.loading} /></div><p className="text-sm leading-6 text-muted-foreground">{t.widgetHint} {t.blocked}</p><section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"><Card><CardHeader><CardTitle>{t.how}</CardTitle></CardHeader><CardContent><ol className="space-y-5">{t.steps.map((step, index) => <li key={step} className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{index + 1}</span><p className="leading-7 text-muted-foreground">{step}</p></li>)}</ol></CardContent></Card><Card><CardHeader><CardTitle>{t.prepare}</CardTitle></CardHeader><CardContent className="space-y-5"><ul className="space-y-3">{t.checklist.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul><div className="flex gap-3 border-t border-border pt-5 text-sm leading-6 text-muted-foreground"><Info className="mt-1 h-4 w-4 shrink-0 text-primary" />{t.note}</div></CardContent></Card></section><p className="border-t border-border pt-6 text-sm leading-6 text-muted-foreground">{t.disclosure}</p></div></main>
}
