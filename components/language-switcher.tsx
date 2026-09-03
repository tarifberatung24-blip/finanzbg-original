"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n/language-context"
import { localizedPath, stripLocale } from "@/lib/i18n/routing"
import { locales, type Locale } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage()
  const pathname = usePathname() || "/"
  const router = useRouter()

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale)
    router.push(localizedPath(stripLocale(pathname), nextLocale))
  }

  return (
    <div
      className={cn("inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs", className)}
      role="group"
      aria-label="Language"
    >
      {locales.map((l: Locale) => (
        <button
          key={l}
          type="button"
          onClick={() => changeLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            "min-w-9 rounded-full px-2.5 py-1 font-semibold uppercase transition-colors",
            locale === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
