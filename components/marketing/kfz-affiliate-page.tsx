"use client"

import Link from "next/link"
import Script from "next/script"
import { useParams } from "next/navigation"
import { ArrowRight, Check, ExternalLink, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const copy = {
  bg: {
    eyebrow: "Автозастраховка",
    title: "Автозастраховка, обяснена на български",
    intro: "Haftpflicht, Teilkasko и Vollkasko — какво покрива всяко и кое ви трябва.",
    cta: "Виж автозастраховки",
    back: "Към тарифите",
    widgetTitle: "Сравни автозастраховки",
    loading: "Калкулаторът за автозастраховки се зарежда…",
    blocked: "Ако калкулаторът не се зареди, проверете блокираните скриптове или опитайте отново. Формулярът се обслужва от партньора.",
    how: "Как се използва калкулаторът",
    steps: ["Подгответе Zulassungsbescheinigung Teil I, HSN/TSN или модел, първа регистрация, годишен пробег, място на паркиране, възраст и опит на водача, SF клас и текущ застраховател, желана Selbstbeteiligung и период на плащане.", "Въведете данните в калкулатора на партньора. Не въвеждайте ненужни чувствителни данни във FinanzberaterBG — партньорският widget обработва собствената си форма.", "Сравнете премията, покритието, самоучастието, изключенията, бонуса, срока и условията за прекратяване.", "Отворете избраната оферта през официалния поток на партньора, прегледайте всички условия на застрахователя и запазете потвърждението и полицата."],
    prepare: "Какво означават покритията",
    coverages: ["Haftpflicht: законово задължителната отговорност към трети лица.", "Teilkasko: например кражба, счупено стъкло, природни явления, пожар или щети от животни — според конкретната полица.", "Vollkasko: защита при собствен сблъсък и вандализъм, обикновено заедно с компонентите на Teilkasko, когато полицата го предвижда."],
    note: "Покритието зависи от избрания застраховател и текста на полицата. Официалните условия на застрахователя са водещи. FinanzberaterBG не обещава фиксирана икономия и не предоставя застрахователен или правен съвет.",
    disclosure: "Партньорско разкриване: страницата може да съдържа партньорски/affiliate линкове. Клиентът не плаща допълнителна такса, а FinanzberaterBG може да получи комисиона.",
    preview: "Отвори партньорския калкулатор",
  },
  de: {
    eyebrow: "Kfz-Versicherung",
    title: "Kfz-Versicherung verständlich vergleichen",
    intro: "Haftpflicht, Teilkasko und Vollkasko — was deckt welcher Schutz ab und was passt zu Ihnen?",
    cta: "Kfz-Versicherungen ansehen",
    back: "Zu den Tarifen",
    widgetTitle: "Kfz-Versicherungen vergleichen",
    loading: "Der Kfz-Versicherungsrechner wird geladen…",
    blocked: "Wenn der Rechner nicht lädt, prüfen Sie blockierte Skripte oder versuchen Sie es erneut. Das Formular wird vom Partner bereitgestellt.",
    how: "So verwenden Sie den Rechner",
    steps: ["Halten Sie Zulassungsbescheinigung Teil I, HSN/TSN oder Modell, Erstzulassung, Jahresfahrleistung, Stellplatz, Alter und Fahrerfahrung, SF-Klasse und aktuellen Versicherer sowie gewünschte Selbstbeteiligung und Zahlungsweise bereit.", "Geben Sie die Daten in den Partner-Rechner ein. Tragen Sie keine unnötigen sensiblen Daten bei FinanzberaterBG ein — das Partner-Widget verarbeitet sein eigenes Formular.", "Vergleichen Sie Beitrag, Leistungsumfang, Selbstbeteiligung, Ausschlüsse, Bonus, Laufzeit und Kündigungsbedingungen.", "Öffnen Sie das ausgewählte Angebot über den offiziellen Partnerprozess, prüfen Sie die Versicherungsbedingungen und speichern Sie Bestätigung und Vertragsunterlagen."],
    prepare: "Deckungen verständlich erklärt",
    coverages: ["Haftpflicht: die gesetzlich vorgeschriebene Haftung für Schäden gegenüber Dritten.", "Teilkasko: zum Beispiel Diebstahl, Glasschäden, Wetter-/Elementarschäden, Feuer oder Tierschäden — je nach Vertrag.", "Vollkasko: Schutz für selbst verursachte Unfallschäden und Vandalismus, gegebenenfalls einschließlich Teilkasko-Bausteinen."],
    note: "Der Versicherungsschutz hängt vom gewählten Versicherer und den konkreten Vertragsbedingungen ab. Die offiziellen Bedingungen des Versicherers sind maßgeblich. FinanzberaterBG verspricht keine feste Ersparnis und bietet keine Versicherungs- oder Rechtsberatung.",
    disclosure: "Affiliate-Hinweis: Diese Seite kann Partner-/Affiliate-Links enthalten. Für Kunden entstehen keine zusätzlichen Kosten; FinanzberaterBG kann eine Provision erhalten.",
    preview: "Partner-Rechner öffnen",
  },
} as const

export default function KfzAffiliatePage() {
  const locale = useParams<{ locale?: string }>().locale === "de" ? "de" : "bg"
  const t = copy[locale]
  return <main className="min-h-screen bg-background"><section className="border-b border-border bg-muted/20"><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8"><div className="max-w-3xl space-y-5"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t.eyebrow}</p><h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{t.title}</h1><p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{t.intro}</p><div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/tarife"><ArrowRight className="mr-2 h-4 w-4 rotate-180" />{t.back}</Link></Button><Button asChild><a href="#kfz-widget">{t.cta}</a></Button></div></div></div></section><div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8"><Card id="kfz-widget" className="overflow-hidden border-border bg-card/80"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />{t.widgetTitle}</CardTitle></CardHeader><CardContent><div className="overflow-x-auto rounded-lg border border-border bg-background p-2"><div style={{ width: "100%", minWidth: 900 }} id="tcpp-iframe-kfz"><p className="p-6 text-center text-sm text-muted-foreground">{t.loading}</p></div><Script src="https://form.partner-versicherung.de/widgets/203170/tcpp-iframe-kfz/kfz-iframe.js" strategy="afterInteractive" onError={() => undefined} /></div><p className="mt-4 text-sm leading-6 text-muted-foreground">{t.blocked}</p></CardContent></Card><section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"><Card><CardHeader><CardTitle>{t.how}</CardTitle></CardHeader><CardContent><ol className="space-y-5">{t.steps.map((step, index) => <li key={step} className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{index + 1}</span><p className="leading-7 text-muted-foreground">{step}</p></li>)}</ol></CardContent></Card><Card><CardHeader><CardTitle>{t.prepare}</CardTitle></CardHeader><CardContent className="space-y-5"><ul className="space-y-3">{t.coverages.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul><p className="border-t border-border pt-5 text-sm leading-6 text-muted-foreground">{t.note}</p><p className="text-sm leading-6 text-muted-foreground">{t.disclosure}</p><Button asChild variant="outline" className="w-full"><a href="#kfz-widget"><ExternalLink className="mr-2 h-4 w-4" />{t.preview}</a></Button></CardContent></Card></section></div></main>
}
