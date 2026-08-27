import { FinanceModulePage } from "@/components/finance/module-page"

export default function ContractsPage() {
  return <FinanceModulePage title="Verträge prüfen" description="Erkenne laufende Kosten und mögliche Einsparpotenziale in deinen Verträgen." items={["Verträge und Anbieter erfassen", "Monatliche Kosten sichtbar machen", "Auffällige Laufzeiten und Kündigungsfristen markieren", "Mögliche Einsparungen als nächste Schritte festhalten"]} />
}
