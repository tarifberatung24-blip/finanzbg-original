"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark")
    setIsDark(dark)
  }, [])

  return (
    <button
      type="button"
      aria-label={isDark ? "Светла тема" : "Тъмна тема"}
      aria-pressed={isDark}
      title={isDark ? "Светла тема" : "Тъмна тема"}
      onClick={() => {
        const next = !isDark
        document.documentElement.classList.toggle("dark", next)
        document.cookie = `finanzbg_theme=${next ? "dark" : "light"}; path=/; max-age=31536000; samesite=lax`
        setIsDark(next)
      }}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
      <span className="sr-only sm:not-sr-only">{isDark ? "Light" : "Dark"}</span>
    </button>
  )
}
