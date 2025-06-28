import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

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
        url: "https://res.cloudinary.com/dhbuw3k2w/image/upload/v1751102482/altamsh-portfolio/assets/gv7ys815nddftwwlvbko.jpg",
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
    images: ["https://res.cloudinary.com/dhbuw3k2w/image/upload/v1751102482/altamsh-portfolio/assets/gv7ys815nddftwwlvbko.jpg"],
  },
  icons: {
    icon: "https://res.cloudinary.com/dhbuw3k2w/image/upload/v1751102482/altamsh-portfolio/assets/gv7ys815nddftwwlvbko.jpg",
    shortcut: "https://res.cloudinary.com/dhbuw3k2w/image/upload/v1751102482/altamsh-portfolio/assets/gv7ys815nddftwwlvbko.jpg",
    apple: "https://res.cloudinary.com/dhbuw3k2w/image/upload/v1751102482/altamsh-portfolio/assets/gv7ys815nddftwwlvbko.jpg",
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
