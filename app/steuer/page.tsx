import { redirect } from "next/navigation"
import { FinanceModulePage } from "@/components/finance/module-page"
import { TaxFormRegistry } from "@/components/finance/tax-form-registry"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: forms } = await supabase
    .from("tax_form_registry")
    .select("official_name,form_identifier,tax_year,form_version,required_or_conditional,verification_status,mapping_status,technical_pdf_status")
    .eq("tax_year", 2025)
    .order("required_or_conditional", { ascending: true })
    .order("official_name", { ascending: true })

  return <main className="min-h-screen bg-background"><FinanceModulePage title="Steuererklärung" description="Sammle deine steuerrelevanten Informationen und erkenne fehlende Angaben." items={["Persönliche Situation und Steuerjahr erfassen", "Werbungskosten und abzugsfähige Ausgaben sammeln", "Belege sicher zuordnen", "Ergebnis vor dem Einreichen prüfen"]} /><div className="mx-auto -mt-10 max-w-3xl px-4 pb-10"><TaxFormRegistry forms={forms ?? []} /></div></main>
}
