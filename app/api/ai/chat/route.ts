import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { assistantSystemPrompt, chatRequestSchema } from "@/lib/ai/chat"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ code: "AI_AUTHENTICATION_REQUIRED" }, { status: 401 })
  if (!process.env.GROQ_API_KEY) return NextResponse.json({ code: "AI_PROVIDER_NOT_CONFIGURED" }, { status: 503 })

  let parsed: ReturnType<typeof chatRequestSchema.parse>
  try {
    parsed = chatRequestSchema.parse(await request.json())
  } catch {
    return NextResponse.json({ code: "AI_INVALID_MESSAGES" }, { status: 400 })
  }

  const result = streamText({
    model: groq("openai/gpt-oss-20b"),
    system: `${assistantSystemPrompt}\nRespond in ${parsed.locale === "de" ? "German" : "Bulgarian"}.`,
    messages: parsed.messages,
    maxOutputTokens: 700,
    temperature: 0.2,
  })

  return result.toTextStreamResponse()
}
