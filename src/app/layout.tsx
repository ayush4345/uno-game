import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './provider'
import { Analytics } from "@vercel/analytics/react"
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { CampModal } from "@campnetwork/origin/react";

const inter = Inter({ subsets: ['latin'] })

// Define miniapp configuration
const miniappConfig = {
  version: "1",
  imageUrl: "https://uno-game-pi.vercel.app/images/hero-1.png",
  button: {
    title: "Start Game",
    action: {
      type: "launch_miniapp",
      url: "https://zunno.xyz/images/logo.png",
      name: "Zunno",
      splashImageUrl: "https://zunno.xyz/images/logo.png",
      splashBackgroundColor: "#0000a8"
    }
  }
};

// For backward compatibility
const frameConfig = {
  version: "1",
  imageUrl: "https://uno-game-pi.vercel.app/images/hero-1.png",
  button: {
    title: "Start Game",
    action: {
      type: "launch_frame",
      name: "Zunno",
      url: "https://uno-game-pi.vercel.app/",
      splashImageUrl: "https://zunno.xyz/images/logo.png",
      splashBackgroundColor: "#0000a8"
    }
  }
};

export const metadata = {
  title: 'UNO Game',
  description: 'A decentralized UNO game built on EVM chain',
  other: {
    'fc:miniapp': JSON.stringify(miniappConfig),
    'fc:frame': JSON.stringify(frameConfig),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-cover bg-black ${inter.className}`}>
        <Analytics />
        <Providers>
          {children}
          {/* <CampModal /> */}
        </Providers>
      </body>
    </html>
  )
}