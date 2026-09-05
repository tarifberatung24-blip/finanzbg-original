import { FinanceModulePage } from "@/components/finance/module-page"
import { DocumentWorkspace } from "@/components/finance/module-workspaces"
export default function Page() { return <main><FinanceModulePage title="Dokumente" description="Organisiere wichtige Unterlagen als Grundlage für deine Finanzthemen." items={["Steuerbescheide und Lohnabrechnungen sammeln", "Dokumente nach Thema ordnen", "Fehlende Unterlagen erkennen", "Bereit für die nächste Prüfung bleiben"]} /><div className="mx-auto -mt-10 max-w-4xl px-4 pb-10 sm:px-6 lg:px-8"><DocumentWorkspace /></div></main> }
