'use client';

import { ReactNode } from 'react';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { getMiniKitChain, getMiniKitApiKey, getMiniKitAppearance } from '@/lib/minikit-utils';

interface MiniKitContextProviderProps {
  children: ReactNode;
}

export function MiniKitContextProvider({ children }: MiniKitContextProviderProps) {
  // Get MiniKit configuration from utility functions
  const chain = getMiniKitChain();
  const apiKey = getMiniKitApiKey();

  return (
    <MiniKitProvider
      // @ts-ignore - Ignoring type issues with chain prop
      chain={chain}
      apiKey={apiKey}
      config={{
        appearance: {
          mode: 'dark',
          theme: 'default',
          name: 'Zunno',
        },
      }}
    >
      {children}
    </MiniKitProvider>
  );
}
