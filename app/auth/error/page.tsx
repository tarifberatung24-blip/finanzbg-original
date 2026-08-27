import Link from "next/link"

export default function AuthErrorPage() { return <main className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center"><h1 className="text-2xl font-bold text-foreground">Link abgelaufen</h1><p className="mt-3 text-muted-foreground">Der Bestätigungslink ist ungültig oder abgelaufen.</p><Link href="/auth/login" className="mt-6 inline-flex font-medium text-primary">Zur Anmeldung</Link></div></main> }
