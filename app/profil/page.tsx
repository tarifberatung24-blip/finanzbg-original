import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/finance/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")
  const { data: profile } = await supabase.from("financial_profiles").select("employment_status,household_size,monthly_income,monthly_fixed_costs,completeness").eq("user_id", user.id).maybeSingle()
  return <ProfileForm userId={user.id} initialProfile={profile} />
}
