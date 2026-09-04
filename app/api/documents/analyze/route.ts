import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { analyzeWithGroq } from "@/lib/home-office/groq-provider"

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: unknown; documentId?: unknown }
    if (typeof body.text !== "string" || !body.text.trim() || typeof body.documentId !== "string") return NextResponse.json({ code: "ANALYSIS_FAILED" }, { status: 400 })
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ code: "ANALYSIS_NOT_AUTHENTICATED" }, { status: 401 })
    const { data: document } = await supabase.from("documents").select("id").eq("id", body.documentId).eq("user_id", user.id).single()
    if (!document) return NextResponse.json({ code: "DOCUMENT_NOT_FOUND" }, { status: 404 })
    const analysis = await analyzeWithGroq(body.text)
    const { error } = await supabase.from("documents").update({ status: "needs_review", metadata: { analysis } }).eq("id", document.id).eq("user_id", user.id)
    if (error) return NextResponse.json({ code: "ANALYSIS_SAVE_FAILED" }, { status: 502 })
    return NextResponse.json({ analysis, label: "AI-generated / Needs review", isDemo: false })
  } catch (error) {
    const code = error instanceof Error && error.message === "AI_PROVIDER_NOT_CONFIGURED" ? "AI_PROVIDER_NOT_CONFIGURED" : "ANALYSIS_FAILED"
    return NextResponse.json({ code }, { status: code === "AI_PROVIDER_NOT_CONFIGURED" ? 503 : 502 })
  }
}
