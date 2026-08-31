import type React from "react"
import type { Metadata } from "next"
import "@fontsource-variable/inter"
import "@fontsource-variable/playfair-display"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mohammadgolamsarowar.com"
const siteName = "Mohammad Golam Sarowar | Network Engineer & Researcher"
const siteDescription =
  "Portfolio of Mohammad Golam Sarowar - Network Engineer and Researcher specializing in Core IP Networks, Distributed Systems, IoT, AI/ML, and Federated Learning."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: "%s | Mohammad Golam Sarowar",
  },
  description: siteDescription,
  keywords: [
    "Mohammad Golam Sarowar",
    "Network Engineer",
    "Core IP Network",
    "BGP",
    "OSPF",
    "MPLS",
    "IoT",
    "AI/ML",
    "Federated Learning",
    "Distributed Systems",
    "Network Security",
    "Portfolio",
    "Researcher",
  ],
  authors: [{ name: "Mohammad Golam Sarowar" }],
  creator: "Mohammad Golam Sarowar",
  icons: {
    icon: "/icon",
    apple: "/icon",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    locale: "en_US",
    images: [
      {
        url: "/profile-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Mohammad Golam Sarowar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/profile-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
