import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const reviewSchema = z.object({ documentId: z.string().uuid(), facts: z.record(z.unknown()), confirm: z.boolean() }).strict()

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ code: "REVIEW_NOT_AUTHENTICATED" }, { status: 401 })
    const parsed = reviewSchema.safeParse(await request.json())
    if (!parsed.success || !parsed.data.confirm) return NextResponse.json({ code: "REVIEW_CONFIRMATION_REQUIRED" }, { status: 400 })
    const { documentId, facts } = parsed.data
    const { data: document, error: documentError } = await supabase.from("documents").select("id,user_id,status").eq("id", documentId).eq("user_id", user.id).maybeSingle()
    if (documentError) return NextResponse.json({ code: "SCHEMA_NOT_VERIFIED" }, { status: 503 })
    if (!document) return NextResponse.json({ code: "HOUSEHOLD_ACCESS_DENIED" }, { status: 403 })
    if (document.status !== "needs_review") return NextResponse.json({ code: "REVIEW_NOT_AVAILABLE" }, { status: 409 })
    const { error: reviewError } = await supabase.from("document_reviews").insert({ document_id: documentId, user_id: user.id, facts, confirmed_at: new Date().toISOString() })
    if (reviewError) return NextResponse.json({ code: "SCHEMA_NOT_VERIFIED" }, { status: 503 })
    const { error: updateError } = await supabase.from("documents").update({ status: "reviewed" }).eq("id", documentId).eq("user_id", user.id)
    if (updateError) return NextResponse.json({ code: "SCHEMA_NOT_VERIFIED" }, { status: 503 })
    await supabase.from("audit_events").insert({ user_id: user.id, document_id: documentId, event_type: "document.reviewed", metadata: { confirmed: true } })
    return NextResponse.json({ documentId, status: "reviewed", confirmedAt: new Date().toISOString() })
  } catch {
    return NextResponse.json({ code: "REVIEW_FAILED" }, { status: 502 })
  }
}
