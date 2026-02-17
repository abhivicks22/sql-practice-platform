import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Source_Sans_3, Orbitron } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from "@/contexts/theme-context"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SQL Navigator - Practice SQL Mastery',
  description: 'A futuristic SQL practice platform to master database queries',
}

export const viewport: Viewport = {
  themeColor: '#020617',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSans.variable} ${orbitron.variable}`} data-theme="neon-pulse">
      <body className="font-sans antialiased overflow-hidden">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
