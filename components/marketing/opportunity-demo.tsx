"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Check, ChevronRight, Gauge, ShieldCheck, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"

const modules = [
  { id: "strom", name: "Strom", icon: Gauge, min: 35, max: 180, initial: 86, tone: "from-[#1677ff]/30 to-[#071b45]" },
  { id: "gas", name: "Gas", icon: Gauge, min: 40, max: 220, initial: 118, tone: "from-[#0b3d91]/45 to-[#071b45]" },
  { id: "internet", name: "Internet", icon: Wifi, min: 20, max: 90, initial: 49, tone: "from-[#1677ff]/25 to-[#030817]" },
  { id: "versicherung", name: "Versicherungen", icon: ShieldCheck, min: 25, max: 260, initial: 112, tone: "from-[#0b3d91]/35 to-[#030817]" },
] as const

const outcomes = [
  "Nужна е проверка на тарифата",
  "Липсват данни за сравнение",
  "Готово за персонална проверка",
]

export function OpportunityDemo() {
  const [values, setValues] = useState<Record<string, number>>(() => Object.fromEntries(modules.map((module) => [module.id, module.initial])))
  const [state, setState] = useState<"idle" | "analysing" | "done">("idle")
  const monthly = Object.values(values).reduce((sum, value) => sum + value, 0)

  function startCheck() {
    setState("analysing")
    window.setTimeout(() => setState("done"), 900)
  }

  return (
    <section className="relative overflow-hidden border-y border-[#0b3d91]/50 bg-[#030817] text-[#f4f8ff]" aria-labelledby="opportunity-demo-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(22,119,255,0.16),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(11,61,145,0.22),transparent_34%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9dcaFF]">Opportunity Demo</p>
          <h2 id="opportunity-demo-title" className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">Виж какво може да се провери.</h2>
          <p className="mt-4 max-w-xl text-pretty leading-7 text-[#b8c8e2]">Настрой ориентировъчните си месечни разходи. Това демо показва само текущия разход</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-stretch">
          <div className="grid gap-4 sm:grid-cols-2" aria-label="Разходни модули">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <label key={module.id} className={`group relative overflow-hidden rounded-3xl border border-[#1677ff]/35 bg-gradient-to-br ${module.tone} p-5 shadow-[0_22px_55px_rgba(3,8,23,0.62)] transition duration-300 hover:-translate-y-1 hover:border-[#6eafff]/70 motion-reduce:transform-none ${index % 2 ? "lg:translate-y-5" : ""}`}>
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
                {state === "done" && <div className="flex items-start gap-2 text-sm text-[#d8e8ff]"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#6eafff]" /><span>{outcomes[monthly % outcomes.length]}</span></div>}
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
  )
}
