"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const links = [
    { href: "/uslugi", label: t.nav.services },
    { href: "/anspruch", label: t.nav.benefits },
    { href: "/vertraege", label: t.nav.contracts },
    { href: "/za-nas", label: t.nav.about },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="FinanzBG" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/auth/login">{t.nav.login}</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/auth/sign-up">{t.nav.register}</Link>
          </Button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-border bg-background md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-3">
            <LanguageSwitcher />
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  {t.nav.login}
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                  {t.nav.register}
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}