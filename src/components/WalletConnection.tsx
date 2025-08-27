"use client";

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
import StyledButton from "@/components/styled-button";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/components/ui/use-toast.jsx";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";

interface WalletConnectionProps {
  onConnect?: (publicKey: string | null) => void;
}

export function WalletConnection({ onConnect }: WalletConnectionProps) {
  const { account, isConnected } = useWallet();
  const { toast } = useToast();
  const [subAccounts, setSubAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Use Wagmi hooks for Base Account integration
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();

  // Define provider type for Base Account API
  interface BaseAccountProvider {
    request?: (args: { method: string; params?: any[] }) => Promise<any>;
  }

  // Check for Base Account subaccounts when connected
  useEffect(() => {
    async function checkForSubAccounts() {
      if (address && connector) {
        try {
          // Check if connector supports Base Account subaccounts
          if (connector.id === "base" || connector.id === "coinbaseWallet") {
            // For Base Wallet or Coinbase Wallet, we can check for subaccounts
            const provider =
              (await connector.getProvider()) as BaseAccountProvider;

            if (provider && provider.request) {
              try {
                // Try to get subaccounts using the Base Account API
                const accounts = await provider
                  .request({
                    method: "eth_getSubAccounts",
                  })
                  .catch(() => []);

                if (Array.isArray(accounts) && accounts.length > 0) {
                  setSubAccounts(accounts);
                  console.log("Found Base subaccounts:", accounts);
                }
              } catch (error) {
                console.log("No subaccounts available or not supported");
              }
            }
          }
        } catch (error) {
          console.error("Error checking for subaccounts:", error);
        }
      }
    }

    checkForSubAccounts();
  }, [address, connector]);

  // When address changes or subaccount is selected, notify parent component
  useEffect(() => {
    if (onConnect) {
      const activeAddress = selectedAccount || address;
      onConnect(activeAddress || null);
    }
  }, [address, selectedAccount, onConnect]);

  // Handle subaccount selection
  const handleSelectSubAccount = (subAccountAddress: string) => {
    setSelectedAccount(subAccountAddress);
    toast({
      title: "Subaccount Selected",
      description: `Using subaccount ${subAccountAddress.substring(
        0,
        6
      )}...${subAccountAddress.substring(subAccountAddress.length - 4)}`,
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="max-w-xs">
        <Wallet>
          <ConnectWallet
            className="bg-[#ff9000] text-xl rounded-3xl text-white group hover:brightness-110 disabled:filter-none inline-block pb-[6px] cursor-pointer select-none overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.8)] duration-75 transition-[padding,transform,filter] translate-y-0 active:translate-y-1 disabled:translate-y-0 disabled:pb-[6px] disabled:bg-gray-600 font-extrabold relative px-8 py-2 bg-gradient-to-b from-white/30 to-white/0 group-disabled:opacity-60 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.6),rgba(255,255,255,0))]"
            disconnectedLabel="Connect Wallet"
          >
            <Avatar className="h-6 w-6 mr-2" />
            <Name />
          </ConnectWallet>
          <WalletDropdown className="z-50 top-0">
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
            </Identity>

            {/* Show subaccounts if available */}
            {subAccounts.length > 0 && (
              <div className="border-t border-gray-200 py-2 px-4">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Subaccounts
                </p>
                {subAccounts.map((subAccount) => (
                  <button
                    key={subAccount}
                    onClick={() => handleSelectSubAccount(subAccount)}
                    className={`w-full text-left py-2 px-2 rounded-md text-sm ${
                      selectedAccount === subAccount
                        ? "bg-blue-100 text-blue-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {subAccount.substring(0, 6)}...
                    {subAccount.substring(subAccount.length - 4)}
                    {selectedAccount === subAccount && (
                      <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    </div>
  );
}
