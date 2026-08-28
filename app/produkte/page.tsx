import type { Metadata } from "next"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { ProductOpportunityBoard } from "@/components/marketing/product-opportunity-board"

export const metadata: Metadata = {
  title: "Produkte & Möglichkeiten",
  description: "Entdecke konkrete Möglichkeiten, deine laufenden Kosten und finanziellen Entscheidungen in Deutschland besser zu strukturieren.",
}

export default function ProduktePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <ProductOpportunityBoard />
      </main>
      <SiteFooter />
    </div>
  )
}
