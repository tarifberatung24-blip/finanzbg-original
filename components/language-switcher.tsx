"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { locales, type Locale } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

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
          onClick={() => setLocale(l)}
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