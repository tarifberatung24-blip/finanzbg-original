import { NextResponse } from "next/server"
import { analyzeWithGroq } from "@/lib/home-office/groq-provider"

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: unknown }
    if (typeof body.text !== "string" || !body.text.trim()) return NextResponse.json({ code: "ANALYSIS_FAILED" }, { status: 400 })
    const analysis = await analyzeWithGroq(body.text)
    return NextResponse.json({ analysis, label: "AI-generated / Needs review", isDemo: false })
  } catch (error) {
    const code = error instanceof Error && error.message === "AI_PROVIDER_NOT_CONFIGURED" ? "AI_PROVIDER_NOT_CONFIGURED" : "ANALYSIS_FAILED"
    return NextResponse.json({ code }, { status: code === "AI_PROVIDER_NOT_CONFIGURED" ? 503 : 502 })
  }
}
