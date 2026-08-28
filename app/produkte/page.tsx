import type { Metadata } from "next"
import Script from "next/script"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { ProductOpportunityBoard } from "@/components/marketing/product-opportunity-board"

export const metadata: Metadata = {
  title: "Produkte & Möglichkeiten",
  description: "Entdecke konkrete Möglichkeiten, deine laufenden Kosten und finanziellen Entscheidungen in Deutschland besser zu strukturieren.",
}

export default function ProduktePage() {
  return (
    <div className="min-h-screen bg-[#030817]">
      <SiteHeader />
      <main>
        <ProductOpportunityBoard />
        <section className="border-b border-[#0b3d91]/40 bg-[#030817] px-4 py-8 sm:px-6 md:py-12 lg:px-8" aria-labelledby="internet-banner-title">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#1677ff]/40 bg-[#071b45] shadow-[0_24px_70px_rgba(3,8,23,0.7)]">
            <div className="relative overflow-hidden">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Finansbg_internet_evtin-1GltpGteLsWt9BsGH2AHhB2ulqd0iH.png" alt="Сравнение на DSL, кабел и оптика за интернет" className="block h-auto w-full" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-[#030817] via-[#030817]/90 to-transparent px-5 pb-5 pt-12 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pb-7">
                <div><p id="internet-banner-title" className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9dcaff]">Internet vergleichen</p><p className="mt-1 text-sm text-[#d8e8ff]">Anzeige / Partnerlink</p></div>
                <Button asChild size="lg" className="group w-full bg-[#1677ff] text-[#f4f8ff] shadow-[0_10px_0_#0b3d91,0_18px_32px_rgba(22,119,255,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:bg-[#3b91ff] active:translate-y-1 active:shadow-[0_4px_0_#0b3d91,0_8px_18px_rgba(22,119,255,0.3)] sm:w-auto">
                  <a href="https://www.check24.de/internet/" target="_blank" rel="sponsored noopener noreferrer">Сравни интернет <ArrowUpRight data-icon="inline-end" /></a>
                </Button>
              </div>
            </div>
            <div id="c24pp-dsl-iframe" className="sr-only" aria-hidden="true" />
            <Script src="https://files.check24.net/widgets/auto/1174585/c24pp-dsl-iframe/dsl-iframe.js" strategy="lazyOnload" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
