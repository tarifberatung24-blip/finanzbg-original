"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"
import { openPwaInstallPrompt } from "@/components/pwa-install-prompt"

export function SiteHeader() {
  const { t, locale } = useLanguage()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    void supabase.auth.getUser().then(({ data }) => { setAuthenticated(Boolean(data.user)); setAuthReady(true) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setAuthenticated(Boolean(session)))
    return () => listener.subscription.unsubscribe()
  }, [])

  const labels = locale === "de"
    ? { features: "Funktionen", how: "So funktioniert es", pricing: "Preise", about: "Über uns", contact: "Kontakt", profile: "Persönlicher Bereich", logout: "Abmelden", install: "App installieren", menu: "Menü" }
    : { features: "Функции", how: "Как работи", pricing: "Цени", about: "За нас", contact: "Контакт", profile: "Личен профил", logout: "Изход", install: "Инсталирай приложението", menu: "Меню" }
  const links = [
    { href: "#features", label: labels.features },
    { href: "#how-it-works", label: labels.how },
    { href: "#pricing", label: labels.pricing },
    { href: "#about", label: labels.about },
    { href: "#contact", label: labels.contact },
  ]
  const localizedHref = (href: string) => `/${locale}${href}`
  const closeMenu = () => setOpen(false)
  async function logout() { await createClient().auth.signOut(); closeMenu(); router.push("/") }

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090b]/90 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
        <Link href={`/${locale}`} aria-label="KintexBG — BY VZG" className="shrink-0">
          <Logo textClassName="text-white [&_span]:text-white/55" />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={localizedHref(l.href)}
              className="rounded-full px-3 py-2 text-[13px] font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden border-white/15 bg-white/5 text-white sm:inline-flex [&_button:not([aria-pressed=true])]:text-white/60" />
          {authReady && authenticated ? (
            <>
                <Button asChild variant="ghost" size="sm" className="hidden text-white hover:bg-white/10 hover:text-white md:inline-flex"><Link href={`/${locale}/protected`}>{labels.profile}</Link></Button>
              <Button variant="outline" size="sm" className="hidden border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white md:inline-flex" onClick={logout}>{labels.logout}</Button>
            </>
          ) : authReady ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden text-white hover:bg-white/10 hover:text-white md:inline-flex"><Link href={`/${locale}/auth/login`}>{t.nav.login}</Link></Button>
              <Button asChild size="sm" className="hidden rounded-full bg-white px-5 text-[#09090b] hover:bg-white/90 md:inline-flex"><Link href={`/${locale}/auth/sign-up`}>{t.nav.register}</Link></Button>
            </>
          ) : null}

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white md:hidden"
            aria-label={labels.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-white/10 bg-[#09090b] md:hidden", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={localizedHref(l.href)}
              onClick={closeMenu}
              className="rounded-md px-3 py-3 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" size="sm" className="justify-start" onClick={openPwaInstallPrompt}>{labels.install}</Button>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>
            <div className="flex gap-2">
              {authReady && authenticated ? (
                <>
                  <Button asChild variant="outline" size="sm"><Link href={`/${locale}/protected`} onClick={closeMenu}>{labels.profile}</Link></Button>
                  <Button variant="outline" size="sm" onClick={logout}>{labels.logout}</Button>
                </>
              ) : authReady ? (
                <>
                  <Button asChild variant="outline" size="sm"><Link href={`/${locale}/auth/login`} onClick={closeMenu}>{t.nav.login}</Link></Button>
                  <Button asChild size="sm"><Link href={`/${locale}/auth/sign-up`} onClick={closeMenu}>{t.nav.register}</Link></Button>
                </>
              ) : null}
            </div>
          </div>
        </nav>
      </div>
    </header>
    </>
  )
}
