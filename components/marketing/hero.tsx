"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, FileCheck2, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

export function Hero() {
  const { locale } = useLanguage()

  const copy = locale === "de"
    ? {
        eyebrow: "Dein digitales Zuhause in Deutschland",
        lineOne: "Dokumente. Verträge. Fristen.",
        lineTwo: "Einfach unter Kontrolle.",
        description: "KintexBG bündelt deine wichtigsten finanziellen und administrativen Aufgaben in einem klaren, sicheren Arbeitsbereich.",
        enter: "Kostenlos starten",
        explore: "Funktionen entdecken",
        proof: ["Verständliche Schritte", "Du behältst die Kontrolle", "Deutsch & Bulgarisch"],
      }
    : {
        eyebrow: "Твоят дигитален дом в Германия",
        lineOne: "Документи. Договори. Срокове.",
        lineTwo: "Лесно под контрол.",
        description: "KintexBG събира най-важните ти финансови и административни задачи в едно ясно и сигурно работно пространство.",
        enter: "Започни безплатно",
        explore: "Разгледай функциите",
        proof: ["Разбираеми стъпки", "Ти запазваш контрола", "На български и немски"],
      }

  return (
    <section className="kintex-entry-hero border-b border-white/10 bg-[#09090b] text-white">
      <div className="kintex-entry-orb kintex-entry-orb-left" aria-hidden="true" />
      <div className="kintex-entry-orb kintex-entry-orb-right" aria-hidden="true" />
      <div className="kintex-entry-grid" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-[1440px] flex-col justify-center px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/75 backdrop-blur">
            <CheckCircle2 className="size-3.5 text-primary" />
            {copy.eyebrow}
          </span>
          <h1 className="mx-auto mt-8 max-w-5xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl lg:text-[5.8rem]">
            <span className="block text-white/95">{copy.lineOne}</span>
            <span className="kintex-entry-gradient mt-2 block">{copy.lineTwo}</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-7 text-white/60 sm:text-lg">
            {copy.description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 text-base text-[#09090b] shadow-[0_0_40px_rgba(255,255,255,.12)] hover:bg-white/90">
              <Link href={`/${locale}/auth/sign-up`}>
                {copy.enter}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-base text-white hover:bg-white/10 hover:text-white">
              <Link href={`/${locale}#features`}>{copy.explore}</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-16 grid w-full max-w-4xl gap-3 sm:grid-cols-3">
          {copy.proof.map((item, index) => {
            const Icon = [FileCheck2, ShieldCheck, Sparkles][index]
            return (
              <div key={item} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm text-white/65 backdrop-blur">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {item}
              </div>
            )
          })}
          </div>
        </div>
    </section>
  )
}
