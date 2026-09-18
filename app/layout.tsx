import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TaskPulse — Minimalist Task Engine',
  description: 'A calm, local-first task manager for focused days.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2026-09-18_at_7.37.15_PM-removebg-preview-ZFIQjEuSvl2GIafvYSMpyLRFFtwZxu.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp_Image_2026-09-18_at_7.37.15_PM-removebg-preview-ZFIQjEuSvl2GIafvYSMpyLRFFtwZxu.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#090a0f',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
