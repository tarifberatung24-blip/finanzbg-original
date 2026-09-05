"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sanitizeNextPath } from "@/lib/supabase/auth-routing"
import { useLanguage } from "@/lib/i18n/language-context"

export default function LoginPage() {
  const { locale } = useLanguage()
  const de = locale === "de"
  const copy = de
    ? {
        title: "Anmelden",
        intro: "Oeffne deinen KintexBG Kundenbereich.",
        email: "E-Mail",
        password: "Passwort",
        login: "Mit E-Mail anmelden",
        loading: "Anmeldung...",
        error: "E-Mail oder Passwort ist nicht korrekt.",
        confirm: "Bitte bestaetige zuerst deine E-Mail-Adresse.",
        forgot: "Passwort vergessen?",
        noAccount: "Noch kein Konto?",
        signup: "Konto erstellen",
        terms: "Mit der Anmeldung akzeptierst du unsere Datenschutzerklaerung und Nutzungsbedingungen.",
      }
    : {
        title: "Вход",
        intro: "Отвори клиентската зона на KintexBG.",
        email: "Имейл",
        password: "Парола",
        login: "Вход с имейл",
        loading: "Влизане...",
        error: "Имейлът или паролата не са правилни.",
        confirm: "Първо потвърди имейл адреса си.",
        forgot: "Забравена парола?",
        noAccount: "Все още нямаш акаунт?",
        signup: "Създай акаунт",
        terms: "С входа приемаш политиката за поверителност и условията за ползване.",
      }
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const signUpPath = `/${locale}/auth/sign-up`

  function destination() {
    return sanitizeNextPath(new URLSearchParams(window.location.search).get("next"))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) setError(error.message.toLowerCase().includes("confirm") ? copy.confirm : copy.error)
    else router.push(destination())
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <Link href={`/${locale}`} className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          KintexBG
          <span className="mt-1 block text-[10px] text-muted-foreground">BY VZG CONSULT</span>
        </Link>
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground">{copy.title}</h1>
        <p className="mt-2 text-muted-foreground">{copy.intro}</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{copy.email}</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">{copy.password}</Label>
              <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">{copy.forgot}</Link>
            </div>
            <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? copy.loading : copy.login}</Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {copy.noAccount} <Link href={signUpPath} className="font-medium text-primary">{copy.signup}</Link>
        </p>
        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">{copy.terms}</p>
      </div>
    </main>
  )
}
