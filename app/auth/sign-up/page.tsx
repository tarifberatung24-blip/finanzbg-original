"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const router = useRouter(); const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(null); const { data, error } = await createClient().auth.signUp({ email, password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`, data: { first_name: name } } }); if (error) setError(error.message.includes("password") ? "Das Passwort muss mindestens 6 Zeichen haben." : "Registrierung konnte nicht abgeschlossen werden."); else router.push(data.session ? "/protected" : "/auth/sign-up-success"); setLoading(false) }
  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm"><Link href="/" className="text-sm font-semibold text-primary">FinanzBG</Link><h1 className="mt-8 text-3xl font-bold text-foreground">Konto erstellen</h1><p className="mt-2 text-muted-foreground">Starte mit einem klaren Blick auf deine Finanzen.</p><form onSubmit={submit} className="mt-8 space-y-5"><div className="space-y-2"><Label htmlFor="name">Vorname</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="email">E-Mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="password">Passwort</Label><Input id="password" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full" disabled={loading}>{loading ? "Wird erstellt…" : "Konto erstellen"}</Button></form><p className="mt-6 text-center text-sm text-muted-foreground">Schon registriert? <Link href="/auth/login" className="font-medium text-primary">Anmelden</Link></p></div></main>
}
