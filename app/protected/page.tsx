import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardWorkspace } from "@/components/finance/dashboard-workspace"

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: household } = await supabase
    .from("households")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  const { data: reminders } = household
    ? await supabase
        .from("tasks")
        .select("id,title,due_at:due_at")
        .eq("household_id", household.id)
        .in("status", ["open", "in_progress", "waiting"])
        .order("due_at", { ascending: true, nullsFirst: false })
        .limit(3)
    : { data: [] }

  return <DashboardWorkspace userId={user.id} householdId={household?.id ?? null} firstName={user.user_metadata?.first_name} initialReminders={reminders ?? []} />
}
