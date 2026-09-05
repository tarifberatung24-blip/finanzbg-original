"use client"

import { useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SiteHeader } from "@/components/marketing/site-header"
import { useLanguage } from "@/lib/i18n/language-context"
import { localizedPath, stripLocale } from "@/lib/i18n/routing"
import { activeKintexModule, isKintexWorkspacePath, kintexModules } from "@/lib/kintex-navigation"
import { cn } from "@/lib/utils"

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const search = useSearchParams()
  const { locale } = useLanguage()
  const [openAt, setOpenAt] = useState<string | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const location = `${pathname}?${search.toString()}`
  const open = openAt === location
  const active = activeKintexModule(pathname, search.get("module"))
  const de = locale === "de"
  const text = de
    ? { workspace: "Persönlicher Bereich", navigation: "Hauptnavigation", menu: "Menü", close: "Menü schließen", skip: "Zum Inhalt", planned: "In Vorbereitung", services: "Weitere Bereiche", tax: "Steuerunterlagen", benefits: "Kindergeld & Hilfen", security: "Sicherheit", logout: "Abmelden", pilot: "Pilotversion" }
    : { workspace: "Лично работно пространство", navigation: "Основна навигация", menu: "Меню", close: "Затвори менюто", skip: "Към съдържанието", planned: "В подготовка", services: "Още раздели", tax: "Данъчни документи", benefits: "Kindergeld и помощи", security: "Сигурност", logout: "Изход", pilot: "Пилотна версия" }

  if (!isKintexWorkspacePath(pathname)) return <><SiteHeader />{children}</>

  return (
    <div className="kintex-workspace min-h-screen bg-background text-foreground">
      <a href="#workspace-content" className="kintex-skip">{text.skip}</a>
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between gap-3 border-b border-border bg-background px-5 lg:px-8">
        <Link href={localizedPath("/protected", locale)} aria-label="KintexBG — BY VZG CONSULT" className="shrink-0">
          <span className="nm-brand-highlight block text-2xl font-bold leading-none tracking-tight">KintexBG<span className="text-primary">.</span></span>
          <span className="nm-kicker mt-2 block leading-none">BY VZG CONSULT</span>
        </Link>
        <span className="hidden text-sm text-muted-foreground md:block">{text.workspace}</span>
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="rounded-sm [&_button]:rounded-sm" />
          <form action="/auth/logout" method="post" className="hidden lg:block"><Button variant="ghost" type="submit">{text.logout}</Button></form>
          <Button ref={menuButton} variant="ghost" size="icon" className="lg:hidden" aria-label={open ? text.close : text.menu} aria-expanded={open} aria-controls="workspace-navigation" onClick={() => setOpenAt(open ? null : location)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside id="workspace-navigation" className={cn("border-b border-border bg-background lg:sticky lg:top-20 lg:block lg:h-[calc(100dvh-5rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r", open ? "block" : "hidden")}
          onKeyDown={(event) => { if (event.key === "Escape") { setOpenAt(null); menuButton.current?.focus() } }}>
          <div className="flex min-h-full flex-col px-4 py-6">
            <nav aria-label={text.navigation} className="space-y-1">
              {kintexModules.map((item) => <Link key={item.id} href={localizedPath(item.href, locale)} onClick={() => setOpenAt(null)} aria-current={active === item.id ? "page" : undefined}
                className={cn("flex min-h-11 items-center justify-between gap-3 border-l-2 px-4 py-3 text-sm leading-5 transition-colors", active === item.id ? "border-primary bg-secondary font-semibold" : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground")}>
                <span>{item[locale]}</span>{"planned" in item && <span className="size-1.5 shrink-0 bg-border" aria-label={text.planned} />}
              </Link>)}
            </nav>
            <div className="mt-7 border-t border-border px-4 pt-6">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{text.services}</p>
              <Link href={localizedPath("/steuer", locale)} aria-current={stripLocale(pathname).startsWith("/steuer") ? "page" : undefined} className="flex min-h-11 items-center text-sm hover:text-primary">{text.tax}</Link>
              <Link href={localizedPath("/kindergeld", locale)} className="flex min-h-11 items-center justify-between gap-2 text-sm hover:text-primary">{text.benefits}<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>
            </div>
            <div className="mt-auto px-4 pt-8">
              <Link href={localizedPath("/protected/security", locale)} aria-current={stripLocale(pathname) === "/protected/security" ? "page" : undefined} className="flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">{text.security}</Link>
              <form action="/auth/logout" method="post" className="lg:hidden"><Button variant="ghost" type="submit" className="px-0">{text.logout}</Button></form>
              <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">KintexBG <span className="mx-1" aria-hidden="true">/</span> {text.pilot}</p>
            </div>
          </div>
        </aside>
        <div id="workspace-content" tabIndex={-1} className="min-w-0 focus-visible:outline-none">{children}</div>
      </div>
    </div>
  )
}

