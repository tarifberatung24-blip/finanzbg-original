"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* subtle layered background, no decorative blobs */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(60rem 30rem at 80% -10%, color-mix(in oklch, var(--primary) 14%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            {t.home.promise}
          </span>

          <h1 className="mt-5 text-pretty text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
            {t.home.heroTitle}
          </h1>
          <p className="mt-4 text-balance text-lg font-medium text-foreground/80">{t.home.heroSubtitle}</p>
          <p className="mt-3 max-w-md text-pretty leading-relaxed text-muted-foreground">{t.home.heroDescription}</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 text-base">
              <Link href="/check">
                {t.home.ctaPrimary}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 text-base">
              <Link href="/tarife">{t.home.ctaSecondary}</Link>
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t.home.trust}</p>
        </div>

        <div className="relative">
          <PromiseCard />
        </div>
      </div>
    </section>
  )
}

function PromiseCard() {
  const { t } = useLanguage()
  const rows = [
    { label: t.home.what1, tone: "text-success" },
    { label: t.home.what2, tone: "text-primary" },
    { label: t.home.what3, tone: "text-accent-foreground" },
    { label: t.home.what4, tone: "text-foreground" },
  ]
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold text-muted-foreground">{t.home.promise}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.home.promiseSub}</p>
      <ul className="mt-5 space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
              {i + 1}
            </span>
            <span className="text-sm font-medium text-foreground">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}