import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ContractCenterWorkspace } from "@/components/finance/contract-center-workspace"

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  return <ContractCenterWorkspace firstName={user.user_metadata?.first_name} />
}
