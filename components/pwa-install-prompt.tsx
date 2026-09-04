"use client"

import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"

const DISMISSED_KEY = "finanzbg:pwa-install-dismissed"
const OPEN_EVENT = "finanzbg:open-install"

type DeferredPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> }

export function PwaInstallPrompt() {
  const { locale } = useLanguage()
  const [prompt, setPrompt] = useState<DeferredPrompt | null>(null)
  const [visible, setVisible] = useState(false)
  const de = locale === "de"

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setPrompt(event as DeferredPrompt)
      if (!window.matchMedia("(display-mode: standalone)").matches && !localStorage.getItem(DISMISSED_KEY)) setVisible(true)
    }
    const onOpen = () => {
      if (!localStorage.getItem(DISMISSED_KEY)) setVisible(true)
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener(OPEN_EVENT, onOpen)
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener(OPEN_EVENT, onOpen)
    }
  }, [])

  if (!visible || !prompt) return null

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1")
    setVisible(false)
  }

  const install = async () => {
    await prompt.prompt()
    await prompt.userChoice
    setPrompt(null)
    setVisible(false)
  }

  return (
    <aside className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-lg sm:inset-x-auto sm:right-4 sm:left-auto">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"><Download className="size-5" aria-hidden="true" /></div>
      <p className="min-w-0 flex-1 text-sm font-medium text-card-foreground">{de ? "FinanzberaterBG als App installieren" : "Инсталирай FinanzberaterBG като приложение"}</p>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button size="sm" onClick={install}>{de ? "Installieren" : "Инсталирай"}</Button>
        <Button size="icon" variant="ghost" onClick={dismiss} aria-label={de ? "Später" : "По-късно"}><X className="size-4" /></Button>
      </div>
    </aside>
  )
}

export function openPwaInstallPrompt() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}
