"use client"

import Link from "next/link"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { ArrowDown, ArrowRight, Check, ChevronRight, Gauge, ShieldCheck, Wifi, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const modules = [
  { id: "strom", name: "Strom", icon: Gauge, min: 35, max: 180, initial: 86, tone: "from-[#1677ff]/30 to-[#071b45]" },
  { id: "gas", name: "Gas", icon: Gauge, min: 40, max: 220, initial: 118, tone: "from-[#0b3d91]/45 to-[#071b45]" },
  { id: "internet", name: "Internet", icon: Wifi, min: 20, max: 90, initial: 49, tone: "from-[#1677ff]/25 to-[#030817]" },
  { id: "versicherung", name: "Versicherungen", icon: ShieldCheck, min: 25, max: 260, initial: 112, tone: "from-[#0b3d91]/35 to-[#030817]" },
] as const

const outcomes = {
  bg: ["Нужна е проверка на тарифата", "Липсват данни за сравнение", "Готово за персонална проверка"],
  de: ["Tarifprüfung erforderlich", "Vergleichsdaten fehlen", "Bereit für die persönliche Prüfung"],
}

export function OpportunityDemo() {
  const { locale } = useLanguage()
  const de = locale === "de"
  const [isOpen, setIsOpen] = useState(false)
  const [values, setValues] = useState<Record<string, number>>(() => Object.fromEntries(modules.map((module) => [module.id, module.initial])))
  const [state, setState] = useState<"idle" | "analysing" | "done">("idle")
  const monthly = Object.values(values).reduce((sum, value) => sum + value, 0)

  function startCheck() {
    setState("analysing")
    window.setTimeout(() => setState("done"), 900)
  }

  return (
    <>
      <section className="relative overflow-hidden border-y border-[#0b3d91]/50 bg-[#030817] py-5 text-[#f4f8ff] sm:hidden" aria-label={de ? "Opportunity Demo öffnen" : "Отвори демо за възможности"}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9dcaff]">Opportunity Demo</p>
            <p className="mt-1 text-sm font-semibold text-[#f4f8ff]">{de ? "Verschaffe dir einen schnellen Überblick." : "Получи бърз преглед на възможностите."}</p>
          </div>
          <Button type="button" onClick={() => setIsOpen(true)} aria-label={de ? "Opportunity Demo öffnen" : "Отвори демо за възможности"} className="relative shrink-0 bg-[#1677ff] text-[#f4f8ff] shadow-[0_0_24px_rgba(22,119,255,0.32)] hover:bg-[#3b91ff]"><ArrowDown className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#6eafff]" aria-hidden="true" /><span>{de ? "Demo öffnen" : "Отвори демо"}</span><ChevronRight data-icon="inline-end" /></Button>
        </div>
      </section>
      <div className="relative hidden min-h-24 items-center justify-center overflow-hidden border-y border-[#0b3d91]/35 bg-[#030817] px-4 py-6 sm:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,119,255,0.12),transparent_55%)]" aria-hidden="true" />
        <Button type="button" onClick={() => setIsOpen(true)} className="relative bg-[#1677ff] text-[#f4f8ff] shadow-[0_5px_0_#0b3d91,0_0_28px_rgba(22,119,255,0.28)] transition-transform duration-200 hover:-translate-y-1 hover:bg-[#3b91ff] hover:shadow-[0_7px_0_#0b3d91,0_0_34px_rgba(22,119,255,0.38)] active:translate-y-1 active:shadow-[0_1px_0_#0b3d91,0_0_18px_rgba(22,119,255,0.25)] motion-reduce:transform-none">{de ? "Opportunity Demo öffnen" : "Отвори демо за възможности"}<ChevronRight data-icon="inline-end" /></Button>
      </div>
      <section className={`fixed inset-0 z-50 overflow-y-auto bg-[#030817]/90 px-4 py-8 backdrop-blur-sm sm:px-6 ${isOpen ? "block" : "hidden"}`} role="dialog" aria-modal="true" aria-labelledby="opportunity-demo-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(22,119,255,0.16),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(11,61,145,0.22),transparent_34%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <Button type="button" onClick={() => setIsOpen(false)} variant="outline" aria-label={de ? "Opportunity Demo schließen" : "Затвори демо за възможности"} className="absolute right-4 top-4 border-[#6eafff]/40 bg-[#071b45]/80 text-[#d8e8ff] hover:bg-[#1677ff]/20"><X data-icon="inline-start" />{de ? "Schließen" : "Затвори"}</Button>
        <div className="max-w-2xl">
          <p className="mb-2 hidden text-sm font-semibold text-[#6eafff] sm:block">Opportunity Demo</p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9dcaFF]">Opportunity Demo</p>
          <h2 id="opportunity-demo-title" className="mt-4 text-balance text-3xl font-bold tracking-tight text-[#f4f8ff] md:text-5xl">Намали разходите си от УТРЕ !</h2>
          <p className="mt-4 max-w-xl text-pretty leading-7 text-[#b8c8e2]">Тук само с няколко клика намаляш дългосрочно основните месечни разходи.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-stretch">
          <div className="grid gap-4 sm:grid-cols-2" aria-label="Разходни модули">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <label key={module.id} className={`group relative overflow-hidden rounded-3xl border border-[#1677ff]/35 bg-gradient-to-br ${module.tone} p-5 text-[#f4f8ff] shadow-[0_22px_55px_rgba(3,8,23,0.62)] transition duration-300 hover:-translate-y-1 hover:border-[#6eafff]/70 motion-reduce:transform-none ${index % 2 ? "lg:translate-y-5" : ""}`}>
                  <span className="absolute -right-8 -top-8 size-28 rounded-full border border-[#6eafff]/25 bg-[#1677ff]/10 shadow-[0_0_35px_rgba(22,119,255,0.25)]" />
                  <span className="relative flex items-center justify-between">
                    <span className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-2xl border border-[#6eafff]/35 bg-[#071b45]/80 text-[#9dcaFF]"><Icon aria-hidden="true" /></span><span className="font-semibold">{module.name}</span></span>
                    <span className="font-mono text-sm text-[#b8c8e2]">{values[module.id]} € / мес.</span>
                  </span>
                  <input className="relative mt-8 w-full accent-[#1677ff]" type="range" min={module.min} max={module.max} value={values[module.id]} aria-label={`Месечен разход за ${module.name}`} onChange={(event) => setValues((current) => ({ ...current, [module.id]: Number(event.target.value) }))} />
                  <span className="relative mt-2 flex justify-between text-xs text-[#8fa6c9]"><span>{module.min} €</span><span>{module.max} €</span></span>
                </label>
              )
            })}
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-[#1677ff]/45 bg-[#071b45]/75 p-6 shadow-[0_28px_70px_rgba(3,8,23,0.72),inset_0_1px_0_rgba(157,202,255,0.18)] [transform:perspective(1200px)_rotateY(-2deg)] motion-reduce:transform-none">
            <div>
              <p className="text-sm text-[#9dcaFF]">Твоят текущ ориентир</p>
              <p className="mt-3 font-mono text-4xl font-bold tracking-tight">{monthly} €<span className="ml-2 text-base font-normal text-[#8fa6c9]">/ мес.</span></p>
              <p className="mt-2 text-sm text-[#b8c8e2]">{monthly * 12} € годишно за избраните разходи</p>
              <div className="mt-6 rounded-2xl border border-[#1677ff]/25 bg-[#030817]/45 p-4" aria-live="polite">
                {state === "idle" && <p className="text-sm text-[#b8c8e2]">Готово за неутрална проверка на наличните възможности.</p>}
                {state === "analysing" && <p className="animate-pulse text-sm text-[#9dcaFF]">Анализираме избраните разходи…</p>}
                {state === "done" && <div className="flex items-start gap-2 text-sm text-[#d8e8ff]"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#6eafff]" /><span>{outcomes[de ? "de" : "bg"][monthly % 3]}</span></div>}
              </div>
            </div>
            <div className="mt-8">
              <Button type="button" onClick={startCheck} disabled={state === "analysing"} className="w-full bg-[#1677ff] text-[#f4f8ff] shadow-[0_0_28px_rgba(22,119,255,0.28)] hover:bg-[#3b91ff]">{state === "analysing" ? "Проверяваме…" : "Стартирай проверка"}<ChevronRight data-icon="inline-end" /></Button>
              {state === "done" && <p className="mt-4 text-center text-sm font-semibold text-[#9dcaFF]">4 разхода за проверка</p>}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#0b3d91]/60 bg-[#071b45]/45 p-5 text-sm leading-6 text-[#b8c8e2] md:flex-row md:items-center md:justify-between">
          <p>Реалните резултати изискват адрес, потребление, договорни данни и проверени партньорски оферти.</p>
          <Button asChild variant="outline" className="shrink-0 border-[#6eafff]/50 bg-transparent text-[#d8e8ff] hover:bg-[#1677ff]/15"><Link href="/auth/sign-up">Регистрирай се и направи реална проверка<ArrowRight data-icon="inline-end" /></Link></Button>
        </div>
        <p className="mt-5 max-w-4xl text-xs leading-5 text-[#8fa6c9]">Това е илюстративно демо, а не оферта или обещание за спестяване. Реалните резултати зависят от твоите данни и проверени партньорски оферти.</p>
      </div>
      </section>
    </>
  )
}
