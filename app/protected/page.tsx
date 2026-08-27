import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardWorkspace } from "@/components/finance/dashboard-workspace"

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: reminders } = await supabase
    .from("reminders")
    .select("id,title,due_at")
    .eq("user_id", user.id)
    .eq("status", "open")
    .order("due_at", { ascending: true })
    .limit(3)

  return <DashboardWorkspace userId={user.id} firstName={user.user_metadata?.first_name} initialReminders={reminders ?? []} />
}
