import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DocumentValidationError, isFrankfurtSupabase, validateDocument } from "@/lib/documents/validation"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ code: "UPLOAD_NOT_AUTHENTICATED" }, { status: 401 })
    if (!isFrankfurtSupabase()) return NextResponse.json({ code: "SCHEMA_NOT_VERIFIED" }, { status: 503 })
    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof File)) return NextResponse.json({ code: "FILE_EMPTY" }, { status: 400 })
    const metadata = await validateDocument(file)
    return NextResponse.json({ code: "SCHEMA_NOT_VERIFIED", metadata }, { status: 503 })
  } catch (error) {
    if (error instanceof DocumentValidationError) return NextResponse.json({ code: error.code }, { status: 400 })
    return NextResponse.json({ code: "STORAGE_NOT_CONFIGURED" }, { status: 503 })
  }
}
