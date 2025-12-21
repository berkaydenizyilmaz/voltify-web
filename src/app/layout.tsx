import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { Sidebar, Header } from '@/components/layout'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Voltify - Elektrik Tüketim Tahmini',
  description: 'Türkiye geneli saatlik elektrik tüketimi tahmin uygulaması',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={jetbrainsMono.variable}>
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
