'use client';

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "../lib/wagmi";
import { WagmiProvider } from 'wagmi';
import RecoilProvider from '../userstate/RecoilProvider';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { MiniKitContextProvider } from '../providers/MiniKitProvider';
import { base, baseSepolia } from 'wagmi/chains';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RecoilProvider>
          <OnchainKitProvider
            chain={baseSepolia}
            config={{
              appearance: {
                name: 'Zunno',
                mode: 'dark',
                theme: 'default',
              },
              wallet: {
                display: 'modal',
              },
            }}
          >
            <MiniKitContextProvider>
              {children}
            </MiniKitContextProvider>
          </OnchainKitProvider>
        </RecoilProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}