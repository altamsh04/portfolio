import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, JetBrains_Mono, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Altamsh Bairagdar - Full Stack Developer Portfolio",
  description: "A passionate Full Stack Developer who loves building robust backend systems and creating seamless user experiences",
  keywords: ["Full Stack Developer", "React", "Node.js", "AI", "Portfolio", "Altamsh Bairagdar"],
  authors: [{ name: "Altamsh Bairagdar" }],
  creator: "Altamsh Bairagdar",
  openGraph: {
    title: "Altamsh Bairagdar - Full Stack Developer",
    description: "A passionate Full Stack Developer who loves building robust backend systems and creating seamless user experiences",
    url: "https://altamsh.me",
    siteName: "Altamsh Bairagdar Portfolio",
    images: [
      {
        url: "https://res.cloudinary.com/dhbuw3k2w/image/upload/fl_preserve_transparency/v1751700067/naruto_pfp.jpg",
        width: 1200,
        height: 630,
        alt: "Altamsh Bairagdar - Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Altamsh Bairagdar - Full Stack Developer",
    description: "A passionate Full Stack Developer who loves building robust backend systems and creating seamless user experiences",
    images: ["https://res.cloudinary.com/dhbuw3k2w/image/upload/fl_preserve_transparency/v1751700067/naruto_pfp.jpg"],
  },
  icons: {
    icon: "https://res.cloudinary.com/dhbuw3k2w/image/upload/fl_preserve_transparency/v1751700067/naruto_pfp.jpg",
    shortcut: "https://res.cloudinary.com/dhbuw3k2w/image/upload/fl_preserve_transparency/v1751700067/naruto_pfp.jpg",
    apple: "https://res.cloudinary.com/dhbuw3k2w/image/upload/fl_preserve_transparency/v1751700067/naruto_pfp.jpg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
