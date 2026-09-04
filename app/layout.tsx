import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/marketing/site-header"
import { PwaInstallPrompt } from "@/components/pwa-install-prompt"
import { PwaServiceWorker } from "@/components/pwa-service-worker"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/dictionaries"
import { LOCALE_COOKIE_KEY } from "@/lib/i18n/language-context"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://finanzbg.de"),
  title: {
    default: "FinanzberaterBG — Финансовият ти помощник в Германия",
    template: "%s · FinanzberaterBG",
  },
  description:
    "FinanzberaterBG проверява данъци, държавни помощи, договори и месечни разходи за живота ти в Германия. Не оставяй пари на масата.",
  generator: "v0.app",
  applicationName: "FinanzberaterBG",
  keywords: [
    "FinanzberaterBG",
    "данъци Германия",
    "Steuererklärung",
    "Kindergeld",
    "Wohngeld",
    "Bürgergeld",
    "договори Германия",
    "българи в Германия",
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "FinanzberaterBG",
    title: "FinanzberaterBG — Финансовият ти помощник в Германия",
    description: "Провери данъци, държавни помощи, договори и разходи — на едно място.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/finanzbg-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "FinanzberaterBG",
    statusBarStyle: "black-translucent",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1526" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const stored = cookieStore.get(LOCALE_COOKIE_KEY)?.value
  const initialLocale: Locale = isLocale(stored) ? stored : defaultLocale

  return (
    <html lang={initialLocale} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider initialLocale={initialLocale}>
            <SiteHeader />
            {children}
            <PwaInstallPrompt />
            <PwaServiceWorker />
          </LanguageProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
