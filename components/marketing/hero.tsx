"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { SmartDashboardPreview } from "@/components/dashboard/smart-dashboard-preview"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="kintex-marketing-section border-b bg-background">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-14 md:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] md:items-center md:px-8 md:py-24">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-primary" />
            KintexBG · BY VZG CONSULT
          </span>
          <h1 className="mt-7 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl">
            {t.home.heroTitle}
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-8 text-muted-foreground">
            Твоят дигитален финансов и административен помощник в Германия. {t.home.heroDescription}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="px-6 text-base">
              <Link href="/check">
                {t.home.ctaPrimary}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-card px-6 text-base">
              <Link href="/tarife">{t.home.ctaSecondary}</Link>
            </Button>
          </div>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">{t.home.trust}</p>
        </div>
        <div className="md:pl-4">
          <SmartDashboardPreview mode="preview" />
          <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">
            Produktvorschau ohne Kontodaten. Im persönlichen Bereich erscheinen ausschließlich bestätigte Inhalte.
          </p>
        </div>
      </div>
    </section>
  )
}
