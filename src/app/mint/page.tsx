"use client";

import { useAuth } from "@campnetwork/origin/react";
import {
  CampModal,
  useAuthState,
  useModal as useCampModal,
  useConnect,
} from "@campnetwork/origin/react";
import { Button } from "@/components/ui/button";
import { WalletConnection } from "@/components/WalletConnection";
import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

export default function Mint() {
  const { jwt, origin, viem } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const { toast } = useToast();

  async function assignImage(imageId: string, jwt: string) {
    await fetch(`https://api.origin.campnetwork.xyz/auth/merv/assign-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_id: imageId }),
  });
}

  const handleMint = async () => {
    if (!origin || !jwt) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to mint an NFT",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const licence = {
        price: 0n,
        duration: 10,
        royaltyBps: 0,
        paymentToken: "0x0000000000000000000000000000000000000000",
      } as const;

      const parentId = 4n; // optional: define if this is a derivative
      const file = new File(
        [new Blob()],
        `/Users/ayush/gameofuno/unogameui/public/images/hero-1.png`,
        {
          type: "image/png",
        }
      );
      const meta = {
        name: "Zunno NFT",
        description: "A decentralized UNO game built on EVM chain. This NFT grants you access to exclusive features in the Zunno game.",
        image: "https://uno-game-pi.vercel.app/images/hero-1.png",
      };
      
      const result = await origin.mintFile(file, meta, licence, parentId);
      console.log(result);
      await assignImage("1", jwt);
      
      setMintSuccess(true);
      toast({
        title: "NFT Minted Successfully!",
        description: "Your Zunno NFT has been minted and assigned to your account.",
        variant: "default"
      });
    } catch (error) {
      console.error("Minting error:", error);
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFT. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">Mint Your IP</h1>
          </div>
          
          {/* NFT Preview Card */}
          <div className="grid grid-cols-1 gap-8 items-center mb-12">
            {/* Mint Section */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 max-w-sm m-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Mint Details</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-bold">FREE</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Chain:</span>
                      <span className="font-bold">Basecamp</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  {mintSuccess ? (
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold">Minting Successful!</h4>
                      <p className="text-gray-400">Your Zunno NFT has been minted and assigned to your account.</p>
                      <Button 
                        variant="secondary" 
                        onClick={() => window.location.href = "/play"}
                      >
                        Play Now
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <WalletConnection />
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 rounded-xl transition-all" 
                        onClick={handleMint}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Minting...
                          </>
                        ) : "Mint NFT"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Camp Modal */}
      <div className="fixed bottom-4 right-4">
        <CampModal injectButton={true} />
      </div>
    </div>
  );
}
