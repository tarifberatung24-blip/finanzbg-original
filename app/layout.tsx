import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n/dictionaries"
import { LOCALE_COOKIE_KEY } from "@/lib/i18n/language-context"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://finanzbg.de"),
  title: {
    default: "FinanzBG — Финансовият ти помощник в Германия",
    template: "%s · FinanzBG",
  },
  description:
    "FinanzBG проверява данъци, държавни помощи, договори и месечни разходи за живота ти в Германия. Не оставяй пари на масата.",
  generator: "v0.app",
  applicationName: "FinanzBG",
  keywords: [
    "FinanzBG",
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
    siteName: "FinanzBG",
    title: "FinanzBG — Финансовият ти помощник в Германия",
    description: "Провери данъци, държавни помощи, договори и разходи — на едно място.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
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
    <html lang={initialLocale} className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <LanguageProvider initialLocale={initialLocale}>{children}</LanguageProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}