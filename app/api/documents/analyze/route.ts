import { NextResponse } from "next/server"
import { analyzeWithGroq } from "@/lib/home-office/groq-provider"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ code: "UPLOAD_NOT_AUTHENTICATED" }, { status: 401 })
    const body = await request.json() as { documentId?: unknown; text?: unknown }
    if (typeof body.documentId !== "string" || !body.documentId || typeof body.text !== "string" || !body.text.trim()) return NextResponse.json({ code: "ANALYSIS_FAILED" }, { status: 400 })
    const { data: document, error: documentError } = await supabase.from("documents").select("id,status,user_id").eq("id", body.documentId).eq("user_id", user.id).maybeSingle()
    if (documentError) return NextResponse.json({ code: "SCHEMA_NOT_VERIFIED" }, { status: 503 })
    if (!document) return NextResponse.json({ code: "HOUSEHOLD_ACCESS_DENIED" }, { status: 403 })
    if (!["uploaded", "awaiting_analysis", "failed", "analysis_not_configured"].includes(document.status)) return NextResponse.json({ code: "ANALYSIS_ALREADY_RUNNING" }, { status: 409 })
    const claimed = await supabase.from("documents").update({ status: "processing" }).eq("id", document.id).eq("user_id", user.id).in("status", ["uploaded", "awaiting_analysis", "failed", "analysis_not_configured"]).select("id").maybeSingle()
    if (claimed.error) return NextResponse.json({ code: "SCHEMA_NOT_VERIFIED" }, { status: 503 })
    if (!claimed.data) return NextResponse.json({ code: "ANALYSIS_ALREADY_RUNNING" }, { status: 409 })
    try {
      const analysis = await analyzeWithGroq(body.text)
      const { error } = await supabase.from("document_analysis_results").insert({ document_id: document.id, user_id: user.id, result: analysis, source: "ai" })
      if (error) throw new Error("SCHEMA_NOT_VERIFIED")
      await supabase.from("documents").update({ status: "needs_review" }).eq("id", document.id).eq("user_id", user.id)
      await supabase.from("audit_events").insert({ user_id: user.id, document_id: document.id, event_type: "document.analyzed", metadata: { source: "ai" } })
      return NextResponse.json({ analysis, label: "AI-generated / Needs review", isDemo: false })
    } catch (error) {
      const code = error instanceof Error && error.message === "AI_PROVIDER_NOT_CONFIGURED" ? "AI_PROVIDER_NOT_CONFIGURED" : error instanceof Error && error.message === "SCHEMA_NOT_VERIFIED" ? "SCHEMA_NOT_VERIFIED" : "ANALYSIS_FAILED"
      await supabase.from("documents").update({ status: code === "AI_PROVIDER_NOT_CONFIGURED" ? "analysis_not_configured" : "failed" }).eq("id", document.id).eq("user_id", user.id)
      return NextResponse.json({ code }, { status: code === "AI_PROVIDER_NOT_CONFIGURED" ? 503 : 502 })
    }
  } catch {
    return NextResponse.json({ code: "ANALYSIS_FAILED" }, { status: 502 })
  }
}
