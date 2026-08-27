import Link from "next/link"

export default function SignUpSuccessPage() { return <main className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center"><h1 className="text-2xl font-bold text-foreground">Prüfe deine E-Mail</h1><p className="mt-3 leading-relaxed text-muted-foreground">Wir haben dir einen Bestätigungslink geschickt. Nach der Bestätigung kannst du dich anmelden.</p><Link href="/auth/login" className="mt-6 inline-flex font-medium text-primary">Zur Anmeldung</Link></div></main> }
