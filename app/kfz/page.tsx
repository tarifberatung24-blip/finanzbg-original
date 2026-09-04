import type { Metadata } from "next"
import KfzAffiliatePage from "@/components/marketing/kfz-affiliate-page"

export const metadata: Metadata = {
  title: "Kfz-Versicherung vergleichen | FinanzberaterBG",
  description: "Vergleiche Kfz-Versicherungen in Deutschland und verstehe Haftpflicht, Teilkasko und Vollkasko.",
}

export default function Page() {
  return <KfzAffiliatePage />
}
