"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { isGermanMobile, normalizeGermanMobile, phoneAuthMessage } from "@/lib/supabase/phone-auth"
import { useLanguage } from "@/lib/i18n/language-context"

export default function SignUpPage() {
  const { locale } = useLanguage()
  const de = locale === "de"
  const copy = de ? { title: "Konto erstellen", intro: "Starte mit einem klaren Blick auf deine Finanzen.", phone: "Deutsche Mobilnummer", send: "SMS-Code senden", sending: "Wird gesendet…", otp: "SMS-Code eingeben", verify: "Registrierung bestätigen", verifying: "Prüfung…", login: "Anmelden", existing: "Schon registriert?" } : { title: "Създай акаунт", intro: "Започни с ясен поглед върху финансите си.", phone: "Немски мобилен номер", send: "Регистрирай се със SMS код", sending: "Изпращане…", otp: "Въведи кода от SMS", verify: "Потвърди регистрацията", verifying: "Проверка…", login: "Вход", existing: "Вече си регистриран?" }
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [smsError, setSmsError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setEmailError(null)
    const { data, error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        data: { first_name: name },
      },
    })
    if (error) setEmailError(error.message.includes("password") ? "Das Passwort muss mindestens 6 Zeichen haben." : "Registrierung konnte nicht abgeschlossen werden.")
    else router.push(data.session ? "/protected" : "/auth/sign-up-success")
    setLoading(false)
  }

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSmsError(null)
    const normalized = normalizeGermanMobile(phone)
    if (cooldown > 0) {
      setSmsError(`Bitte warte noch ${cooldown} Sekunden, bevor du einen neuen Code anforderst.`)
      return
    }
    if (!isGermanMobile(normalized)) {
      setSmsError("Bitte gib eine gültige deutsche Mobilnummer mit +49 ein.")
      return
    }
    setLoading(true)
    const { error } = await createClient().auth.signInWithOtp({ phone: normalized, options: { shouldCreateUser: true } })
    if (error) setSmsError(phoneAuthMessage(error.message))
    else {
      setPhone(normalized)
      setOtpSent(true)
      setCooldown(60)
    }
    setLoading(false)
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSmsError(null)
    if (!/^\d{6}$/.test(otp)) {
      setSmsError("Bitte gib den 6-stelligen SMS-Code ein.")
      return
    }
    const normalized = normalizeGermanMobile(phone)
    if (!isGermanMobile(normalized)) {
      setSmsError("Bitte fordere zuerst einen neuen SMS-Code an.")
      return
    }
    setLoading(true)
    const { error } = await createClient().auth.verifyOtp({ phone: normalized, token: otp, type: "sms" })
    if (error) setSmsError(phoneAuthMessage(error.message))
    else router.push("/protected")
    setLoading(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm"><Link href="/" className="text-sm font-semibold text-primary">FinanzberaterBG</Link><h1 className="mt-8 text-3xl font-bold text-foreground">{copy.title}</h1><p className="mt-2 text-muted-foreground">{copy.intro}</p>{!otpSent ? <form onSubmit={sendOtp} className="mt-8 space-y-4"><div className="space-y-2"><Label htmlFor="phone">{copy.phone}</Label><div className="flex gap-2"><span className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm" aria-hidden="true">+49</span><Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="151 12345678" required value={phone} onChange={(e) => setPhone(e.target.value)} /></div></div>{smsError && <p role="alert" className="text-sm text-destructive">{smsError}</p>}<Button className="w-full" disabled={loading}>{loading ? copy.sending : copy.send}</Button></form> : <form onSubmit={verifyOtp} className="mt-8 space-y-4"><div className="space-y-2"><Label htmlFor="otp">{copy.otp}</Label><Input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="123456" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} /></div>{smsError && <p role="alert" className="text-sm text-destructive">{smsError}</p>}<Button className="w-full" disabled={loading}>{loading ? copy.verifying : copy.verify}</Button><Button type="button" variant="ghost" className="w-full" disabled={loading || cooldown > 0} onClick={() => { setOtpSent(false); setOtp(""); setSmsError(null) }}>{cooldown > 0 ? `Нов код след ${cooldown} сек.` : "Изпрати нов код"}</Button></form>}<div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />oder mit E-Mail<span className="h-px flex-1 bg-border" /></div><form onSubmit={submit} className="space-y-5"><div className="space-y-2"><Label htmlFor="name">Vorname</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="email">E-Mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="password">Passwort</Label><Input id="password" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>{emailError && <p role="alert" className="text-sm text-destructive">{emailError}</p>}<Button variant="secondary" className="w-full" disabled={loading}>{loading ? "Wird erstellt…" : "Konto mit E-Mail erstellen"}</Button></form><p className="mt-6 text-center text-sm text-muted-foreground">Schon registriert? <Link href="/auth/login" className="font-medium text-primary">Anmelden</Link></p></div></main>
}
