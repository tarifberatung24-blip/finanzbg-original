"use client"

import { FormEvent, useMemo, useState } from "react"
import { Bot, Loader2, Send, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

type ChatMessage = { role: "user" | "assistant"; content: string }

const copy = {
  bg: { title: "AI помощник", intro: "Информационна помощ за документи и финансови административни стъпки.", placeholder: "Напиши въпрос…", send: "Изпрати", loading: "Обработва…", demo: "Локален demo режим: отговорите са примерни и не използват външен AI provider.", error: "AI provider не е наличен. Можеш да използваш demo режима.", empty: "Моля, въведи въпрос.", disclaimer: "Провери важните факти официално. Това не е правен, данъчен или финансов съвет." },
  de: { title: "AI-Assistent", intro: "Vorsichtige Informationen zu Dokumenten und finanziellen Verwaltungsschritten.", placeholder: "Frage eingeben…", send: "Senden", loading: "Verarbeitet…", demo: "Lokaler Demo-Modus: Antworten sind Beispiele und verwenden keinen externen AI-Provider.", error: "Der AI-Provider ist nicht verfügbar. Du kannst den Demo-Modus verwenden.", empty: "Bitte gib eine Frage ein.", disclaimer: "Wichtige Fakten offiziell prüfen. Dies ist keine Rechts-, Steuer- oder Finanzberatung." },
} as const

function demoReply(locale: "bg" | "de", message: string) {
  return locale === "bg"
    ? `Това е локален demo отговор на „${message}“. Не мога да потвърдя факти или право на получаване без проверка на оригиналния документ. За официално решение се обърни към отговорната институция.`
    : `Dies ist eine lokale Demo-Antwort auf „${message}“. Ohne Prüfung des Originaldokuments kann ich keine Fakten oder Anspruchsberechtigung bestätigen. Für eine verbindliche Entscheidung wende dich an die zuständige Stelle.`
}

export function AiAssistantPanel() {
  const { locale } = useLanguage()
  const text = useMemo(() => copy[locale], [locale])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)
  const [demo, setDemo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = value.trim()
    if (!content || content.length > 4000 || busy) { if (!content) setError(text.empty); return }
    const next = [...messages, { role: "user" as const, content }]
    setMessages(next)
    setValue("")
    setError(null)
    setBusy(true)
    try {
      const response = await fetch("/api/ai/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next, locale }) })
      if (!response.ok || !response.body) {
        setDemo(true)
        setMessages([...next, { role: "assistant", content: demoReply(locale, content) }])
        return
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistant = ""
      setMessages([...next, { role: "assistant", content: "" }])
      while (true) {
        const chunk = await reader.read()
        if (chunk.done) break
        assistant += decoder.decode(chunk.value, { stream: true })
        setMessages([...next, { role: "assistant", content: assistant }])
      }
    } catch {
      setDemo(true)
      setError(text.error)
      setMessages([...next, { role: "assistant", content: demoReply(locale, content) }])
    } finally { setBusy(false) }
  }

  return <section className="rounded-2xl border border-border bg-card p-6" aria-labelledby="ai-assistant-title">
    <div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Bot aria-hidden="true" className="size-5" /></span><div><h2 id="ai-assistant-title" className="font-semibold text-foreground">{text.title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{text.intro}</p></div></div>
    <div className="mt-5 min-h-24 space-y-3" aria-live="polite">{messages.length === 0 ? <p className="text-sm leading-6 text-muted-foreground">{text.disclaimer}</p> : messages.map((item, index) => <div key={`${item.role}-${index}`} className={`rounded-xl px-4 py-3 text-sm leading-6 ${item.role === "user" ? "ml-8 bg-secondary text-secondary-foreground" : "mr-8 bg-muted text-foreground"}`}><span className="sr-only">{item.role === "user" ? "You: " : "Assistant: "}</span>{item.content || <Loader2 className="size-4 animate-spin" aria-label={text.loading} />}</div>)}</div>
    {demo && <p className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 text-xs leading-5 text-muted-foreground">{text.demo}</p>}
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    <form className="mt-5 flex gap-2" onSubmit={submit}><label htmlFor="ai-assistant-input" className="sr-only">{text.placeholder}</label><input id="ai-assistant-input" value={value} onChange={(event) => setValue(event.target.value.slice(0, 4000))} placeholder={text.placeholder} maxLength={4000} disabled={busy} className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" /><Button type="submit" disabled={busy || !value.trim()} aria-label={text.send}><Send className="size-4" aria-hidden="true" /><span className="sr-only">{text.send}</span></Button></form>
    <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />{text.disclaimer}</p>
  </section>
}
