"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { client } from "@/utils/thirdWebClient";
import { baseSepolia } from "@/lib/chains";

const wallet = inAppWallet();

interface WalletConnectionProps {
  onConnect?: (publicKey: string | null) => void;
}

export function WalletConnection({ onConnect }: WalletConnectionProps) {

  // Use Wagmi hooks for Base Account integration
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const { connect } = useConnect();
  // Once connected, you can access the active account
  const activeAccount = useActiveAccount();

  // When address changes or subaccount is selected, notify parent component
  useEffect(() => {
    if (onConnect) {
      const activeAddress = address;
      onConnect(activeAddress || null);
    }
  }, [address, onConnect]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="max-w-xs">
        <ConnectButton client={client} chain={baseSepolia} />
      </div>
    </div>
  );
}
