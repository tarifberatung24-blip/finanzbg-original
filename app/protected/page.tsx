import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PersonalDashboard } from "@/components/finance/personal-dashboard"

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  return <PersonalDashboard firstName={user.user_metadata?.first_name} />
}
