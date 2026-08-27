import { FinanceModulePage } from "@/components/finance/module-page"
import { ContractsWorkspace } from "@/components/finance/contracts-workspace"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ContractsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?next=/vertraege")
  const { data: contracts } = await supabase.from("contracts").select("id,category,provider,monthly_cost,status").eq("user_id", user.id).order("created_at", { ascending: false })
  return <main className="min-h-screen bg-background"><FinanceModulePage title="Verträge prüfen" description="Erkenne laufende Kosten und mögliche Einsparpotenziale in deinen Verträgen." items={["Verträge und Anbieter erfassen", "Monatliche Kosten sichtbar machen", "Auffällige Laufzeiten und Kündigungsfristen markieren", "Mögliche Einsparungen als nächste Schritte festhalten"]} /><div className="mx-auto -mt-10 max-w-3xl px-4 pb-10"><ContractsWorkspace initialContracts={contracts ?? []} /></div></main>
}
