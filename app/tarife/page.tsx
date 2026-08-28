import { FinanceModulePage } from "@/components/finance/module-page"
import { TariffWorkspace } from "@/components/finance/module-workspaces"
export default function Page() { return <><FinanceModulePage title="Verträge & Tarife" description="Mache laufende Verträge sichtbar und entdecke mögliche Einsparungen." items={["Vertrag und Anbieter erfassen", "Monatliche Kosten vergleichen", "Laufzeit und Kündigungsfristen prüfen", "Einsparpotenziale priorisieren"]} /><div className="mx-auto -mt-10 max-w-4xl px-4 pb-10 sm:px-6 lg:px-8"><TariffWorkspace /></div></> }
