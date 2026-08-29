"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signInWithGoogle() {
    setLoading(true)
    setError(null)
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=/protected` } })
    if (error) {
      setError("Google-Anmeldung konnte nicht gestartet werden. Bitte versuche es erneut.")
      setLoading(false)
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(null)
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) setError(error.message.toLowerCase().includes("confirm") ? "Bitte bestätige zuerst deine E-Mail-Adresse." : "E-Mail oder Passwort ist nicht korrekt.")
    else router.push("/protected")
    setLoading(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm"><Link href="/" className="text-sm font-semibold text-primary">FinanzberaterBG</Link><h1 className="mt-8 text-3xl font-bold text-foreground">Willkommen zurück</h1><p className="mt-2 text-muted-foreground">Melde dich sicher an, um deinen Finanzbereich zu öffnen.</p><Button type="button" variant="outline" className="mt-7 w-full gap-3" disabled={loading} onClick={signInWithGoogle}><span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full bg-background text-sm font-bold text-primary">G</span>{loading ? "Weiterleitung…" : "Mit Google anmelden"}</Button><div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />oder mit E-Mail<span className="h-px flex-1 bg-border" /></div><form onSubmit={submit} className="space-y-5"><div className="space-y-2"><Label htmlFor="email">E-Mail</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="password">Passwort</Label><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full" disabled={loading}>{loading ? "Anmeldung…" : "Anmelden"}</Button></form><p className="mt-6 text-center text-sm text-muted-foreground">Noch kein Konto? <Link href="/auth/sign-up" className="font-medium text-primary">Registrieren</Link></p></div></main>
}
