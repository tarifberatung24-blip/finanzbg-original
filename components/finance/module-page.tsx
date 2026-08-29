import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinanceModulePage({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" /> Към началото · Zur Startseite</Link>
        <div className="mt-10 overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl shadow-primary/5">
          <div className="border-b border-border bg-secondary/40 p-7 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FinanzberaterBG · Persönlicher Finanzbereich</p><span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" /> Sicherer Arbeitsbereich</span></div>
            <h1 className="mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">{description}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Провери стъпките си спокойно. · Prüfe deine nächsten Schritte in Ruhe.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Button asChild><Link href="/auth/sign-up">Започни проверката · Prüfung starten <ArrowRight data-icon="inline-end" /></Link></Button><Button asChild variant="outline"><Link href="/protected">Към таблото · Zum Dashboard</Link></Button></div>
          </div>
          <div className="p-7 md:p-10"><h2 className="text-xl font-semibold text-foreground">Какво ще направиш · Was dich erwartet</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{items.map((item, index) => <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span><div><CheckCircle2 className="mb-2 size-4 text-primary" /><span className="text-sm leading-6 text-foreground">{item}</span></div></div>)}</div><div className="mt-7 flex items-start gap-3 rounded-2xl border border-border bg-muted/60 p-4 text-sm leading-6 text-muted-foreground"><CircleAlert className="mt-0.5 size-5 shrink-0" /><span>Това е структурирана предварителна проверка. · Dies ist eine strukturierte Vorprüfung. FinanzberaterBG ersetzt keine Steuer- oder Rechtsberatung.</span></div></div>
        </div>
      </div>
    </main>
  )
}
