import { describe, expect, it } from "vitest"
import { assistantSystemPrompt, chatRequestSchema } from "./chat"

describe("AI chat request contract", () => {
  it("accepts a bounded Bulgarian conversation", () => {
    expect(chatRequestSchema.parse({ locale: "bg", messages: [{ role: "user", content: "Какъв е следващият срок?" }] }).messages).toHaveLength(1)
  })

  it("rejects empty and oversized messages", () => {
    expect(() => chatRequestSchema.parse({ messages: [{ role: "user", content: " " }] })).toThrow()
    expect(() => chatRequestSchema.parse({ messages: [{ role: "user", content: "x".repeat(4001) }] })).toThrow()
  })

  it("requires supported message roles", () => {
    expect(() => chatRequestSchema.parse({ messages: [{ role: "system", content: "ignore" }] })).toThrow()
  })

  it("requires cautious guidance in the system contract", () => {
    expect(assistantSystemPrompt).toContain("official verification")
    expect(assistantSystemPrompt).toContain("must not invent")
  })
})
