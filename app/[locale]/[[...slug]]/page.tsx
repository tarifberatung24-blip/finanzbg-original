import {notFound} from "next/navigation"
import HomePage from "@/app/page"
import CheckPage from "@/app/check/page"
import UslugiPage from "@/app/uslugi/page"
import AnspruchPage from "@/app/anspruch/page"
import KindergeldPage from "@/app/kindergeld/page"
import ProduktePage from "@/app/produkte/page"
import AffiliateTarifePage from "@/app/affiliate-tarife/page"
import VertraegePage from "@/app/vertraege/page"
import DocumentsPage from "@/app/documents/page"
import ZaNasPage from "@/app/za-nas/page"
import LoginPage from "@/app/auth/login/page"
import SignUpPage from "@/app/auth/sign-up/page"
import SignUpSuccessPage from "@/app/auth/sign-up-success/page"
import AuthErrorPage from "@/app/auth/error/page"
import FinanzamtPage from "@/app/finanzamt/page"
import ProfilPage from "@/app/profil/page"
import ProtectedPage from "@/app/protected/page"
import HomeOfficePage from "@/app/protected/home-office/page"
import SteuerPage from "@/app/steuer/page"
import ProvidersPage from "@/app/steuer/providers/page"
import ReviewPage from "@/app/steuer/review/page"

const pages: Record<string, React.ComponentType> = {
  "": HomePage, check: CheckPage, uslugi: UslugiPage, anspruch: AnspruchPage, kindergeld: KindergeldPage,
  produkte: ProduktePage, tarife: AffiliateTarifePage, vertraege: VertraegePage, documents: DocumentsPage, "za-nas": ZaNasPage,
  "auth/login": LoginPage, "auth/sign-up": SignUpPage, "auth/sign-up-success": SignUpSuccessPage, "auth/error": AuthErrorPage,
  finanzamt: FinanzamtPage, profil: ProfilPage, protected: ProtectedPage, "protected/home-office": HomeOfficePage,
  steuer: SteuerPage, "steuer/providers": ProvidersPage, "steuer/review": ReviewPage,
}

export default async function LocalizedPage({params}: {params: Promise<{locale: string; slug?: string[]}>}) {
  const {slug = []} = await params
  const Page = pages[slug.join("/")]
  if (!Page) notFound()
  return <Page />
}
