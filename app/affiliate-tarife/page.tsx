import type { Metadata } from "next"
import AffiliateTariffPage from "@/components/marketing/affiliate-tariff-page"

export const metadata: Metadata = {
  title: "Strom & Gas vergleichen | FinanzberaterBG",
  description: "Vergleiche Strom- und Gastarife in Deutschland mit den offiziellen CHECK24-Rechnern.",
}

export default function Page() {
  return <AffiliateTariffPage />
}
