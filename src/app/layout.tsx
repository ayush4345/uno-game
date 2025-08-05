import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './provider'
import { Analytics } from "@vercel/analytics/react"
import '@coinbase/onchainkit/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UNO Game',
  description: 'A decentralized UNO game built on EVM chain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-cover bg-[url("/bg-2.jpg")] ${inter.className}`}>
        <Analytics />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}