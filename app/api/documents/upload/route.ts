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
    const storagePath = `households/${user.id}/${crypto.randomUUID()}-${metadata.name}`
    const { data: document, error: insertError } = await supabase.from("documents").insert({
      user_id: user.id,
      name: metadata.name,
      storage_path: storagePath,
      document_type: metadata.type,
      metadata: { byte_size: metadata.size },
      status: "awaiting_analysis",
    }).select("id,name,storage_path,document_type,metadata,status,created_at").single()
    if (insertError || !document) return NextResponse.json({ code: "DOCUMENT_RECORD_FAILED" }, { status: 502 })

    const { error: uploadError } = await supabase.storage.from("documents").upload(storagePath, file, { contentType: metadata.type, upsert: false })
    if (uploadError) {
      await supabase.from("documents").delete().eq("id", document.id).eq("user_id", user.id)
      return NextResponse.json({ code: "STORAGE_UPLOAD_FAILED" }, { status: 502 })
    }
    return NextResponse.json({ code: "DOCUMENT_UPLOADED", document }, { status: 201 })
  } catch (error) {
    if (error instanceof DocumentValidationError) return NextResponse.json({ code: error.code }, { status: 400 })
    return NextResponse.json({ code: "STORAGE_NOT_CONFIGURED" }, { status: 503 })
  }
}
