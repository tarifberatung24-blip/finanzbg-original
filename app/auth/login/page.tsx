"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sanitizeNextPath } from "@/lib/supabase/auth-routing"
import { isGermanMobile, normalizeGermanMobile, phoneAuthMessage } from "@/lib/supabase/phone-auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  async function signInWithGoogle() {
    setLoading(true); setError(null)
    const next = destination()
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } })
    if (error) { setError("Google-Anmeldung konnte nicht gestartet werden. Bitte versuche es erneut."); setLoading(false) }
  }

  function destination() {
    return sanitizeNextPath(new URLSearchParams(window.location.search).get("next"))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(null)
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    if (error) setError(error.message.toLowerCase().includes("confirm") ? "Bitte bestätige zuerst deine E-Mail-Adresse." : "E-Mail oder Passwort ist nicht korrekt.")
    else router.push(destination())
    setLoading(false)
  }

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null)
    const normalized = normalizeGermanMobile(phone)
    if (cooldown > 0) { setError(`Bitte warte noch ${cooldown} Sekunden, bevor du einen neuen Code anforderst.`); return }
    if (!isGermanMobile(normalized)) { setError("Bitte gib eine gültige deutsche Mobilnummer mit +49 ein."); return }
    setLoading(true)
    const { error } = await createClient().auth.signInWithOtp({ phone: normalized, options: { shouldCreateUser: true } })
    if (error) setError(phoneAuthMessage(error.message))
    else { setPhone(normalized); setOtpSent(true); setCooldown(60) }
    setLoading(false)
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null)
    if (!/^\d{6}$/.test(otp)) { setError("Bitte gib den 6-stelligen SMS-Code ein."); return }
    setLoading(true)
    const normalized = normalizeGermanMobile(phone)
    if (!isGermanMobile(normalized)) { setError("Bitte fordere zuerst einen neuen SMS-Code an."); setLoading(false); return }
    const { error } = await createClient().auth.verifyOtp({ phone: normalized, token: otp, type: "sms" })
    if (error) setError(phoneAuthMessage(error.message))
    else router.push(destination())
    setLoading(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm"><Link href="/" className="text-sm font-semibold text-primary">FinanzberaterBG</Link><h1 className="mt-8 text-3xl font-bold text-foreground">Вход или регистрация</h1><p className="mt-2 text-muted-foreground">Sicher anmelden und deinen Finanzbereich öffnen.</p><Button type="button" variant="outline" className="mt-7 w-full gap-3" disabled={loading} onClick={signInWithGoogle}><span aria-hidden="true" className="flex size-5 items-center justify-center rounded-full bg-background text-sm font-bold text-primary">G</span>{loading ? "Weiterleitung…" : "Продължи с Google"}</Button><div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />oder<span className="h-px flex-1 bg-border" /></div>{!otpSent ? <form onSubmit={sendOtp} className="space-y-4"><div className="space-y-2"><Label htmlFor="phone">Deutsche Mobilnummer</Label><div className="flex gap-2"><span className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm" aria-hidden="true">🇩🇪 +49</span><Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="151 12345678" required value={phone} onChange={(e) => setPhone(e.target.value)} /></div></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full" disabled={loading}>{loading ? "Wird gesendet…" : "Изпрати код"}</Button></form> : <form onSubmit={verifyOtp} className="space-y-4"><div className="space-y-2"><Label htmlFor="otp">Въведете кода от SMS</Label><Input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="123456" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full" disabled={loading}>{loading ? "Проверка…" : "Потвърди кода"}</Button><Button type="button" variant="ghost" className="w-full" disabled={loading || cooldown > 0} onClick={() => { setOtpSent(false); setOtp(""); setError(null) }}>{cooldown > 0 ? `Нов код след ${cooldown} сек.` : "Изпрати нов код"}</Button></form>}<div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />oder mit E-Mail<span className="h-px flex-1 bg-border" /></div><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="email">E-Mail</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div><div className="space-y-2"><div className="flex items-center justify-between gap-3"><Label htmlFor="password">Passwort</Label><Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">Забравена парола?</Link></div><Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div><Button variant="secondary" className="w-full" disabled={loading}>{loading ? "Anmeldung…" : "Mit E-Mail anmelden"}</Button></form><p className="mt-6 text-center text-xs text-muted-foreground">Mit der Anmeldung akzeptierst du unsere <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link> und <Link href="/agb" className="underline">Nutzungsbedingungen</Link>.</p></div></main>
}
