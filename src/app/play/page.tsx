"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UnoGameContract } from "@/lib/types";
import { getContractNew } from "@/lib/web3";
import io, { Socket } from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useUserAccount } from "@/userstate/useUserAccount";
import { WalletConnection } from "@/components/WalletConnection";
import {
  useAccount,
  useConnect,
  useWalletClient,
} from "wagmi";
import BottomNavigation from "@/components/BottomNavigation";
import GameCard from "./gameCard";
import Link from "next/link";

const CONNECTION =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
  "https://zkuno-669372856670.us-central1.run.app";

// DIAM wallet integration removed

export default function PlayGame() {
  const [contract, setContract] = useState<UnoGameContract | null>(null);
  const [open, setOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [joiningGameId, setJoiningGameId] = useState<BigInt | null>(null);
  const [gameId, setGameId] = useState<BigInt | null>(null);
  const [games, setGames] = useState<BigInt[]>([]);
  const router = useRouter();

  // Use Wagmi hooks for wallet functionality
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { account: recoilAccount } = useUserAccount();

  const socket = useRef<Socket | null>(null);

  const { toast } = useToast();

  // Using Wagmi hooks for wallet connection
  const { connect, connectors } = useConnect();

  async function handleConnectWallet() {
    try {
      // Find the first available connector (usually injected like MetaMask)
      const connector = connectors.find((c) => c.ready);

      if (connector) {
        connect({ connector });
      } else {
        toast({
          title: "Use Connect Wallet Button",
          description:
            "Please use the Connect Wallet button to connect your wallet.",
        });
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      toast({
        title: "Connection Failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }

  const fetchGames = async () => {
    if (contract) {
      try {
        console.log("Fetching active games...");
        const activeGames = await contract.getNotStartedGames();
        console.log("Active games:", activeGames);
        setGames(activeGames);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    }
  };

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(CONNECTION, {
        transports: ["websocket"],
      }) as any; // Type assertion to fix the type mismatch

      console.log("Socket connection established");
    }
  }, [socket]);

  useEffect(() => {
    if (contract) {
      console.log("Contract initialized, calling fetchGames"); // Add this line
      fetchGames();

      if (socket.current) {
        console.log("Socket connection established");
        // Add listener for gameRoomCreated event
        socket.current.on("gameRoomCreated", () => {
          console.log("Game room created event received"); // Add this line
          fetchGames();
        });

        // Cleanup function
        return () => {
          if (socket.current) {
            socket.current.off("gameRoomCreated");
          }
        };
      }
    } else {
      console.log("Contract not initialized yet"); // Add this line
    }
  }, [contract, socket]);

  const ISSERVER = typeof window === "undefined";

  const openHandler = () => {
    setOpen(false);
  };

  const createGame = async () => {
    console.log(contract);
    console.log(address);
    if (contract && address) {
      try {
        setCreateLoading(true);

        console.log("Creating game...");

        // Using Wagmi address directly with the contract
        const tx = await contract.createGame(address as `0x${string}`);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();
        console.log("Game created successfully");

        if (socket && socket.current) {
          socket.current.emit("createGameRoom");
        }

        fetchGames();
        setCreateLoading(false);
      } catch (error) {
        console.error("Failed to create game:", error);
        setCreateLoading(false);
        toast({
          title: "Transaction Failed",
          description: "Failed to create game.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a game.",
        variant: "destructive",
      });
    }
  };

  const joinGame = async (gameId: BigInt) => {
    if (contract && address) {
      try {
        setJoiningGameId(gameId);

        console.log(`Joining game ${gameId.toString()}...`);

        const gameIdBigint = BigInt(gameId.toString());
        // Using Wagmi address directly
        const tx = await contract.joinGame(gameIdBigint, address as `0x${string}`);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();

        console.log("Joined game successfully");
        router.push(`/game/${gameId.toString()}`);
      } catch (error) {
        console.error("Failed to join game:", error);
        setJoiningGameId(null);
        toast({
          title: "Transaction Failed",
          description: "Failed to join game.",
          variant: "destructive",
        });
      }
    } else {
      setJoiningGameId(null);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to join a game.",
        variant: "destructive",
      });
    }
  };

  const setup = async () => {
    if (address) {
      try {
        const { contract } = await getContractNew();
        setContract(contract);
      } catch (error) {
        console.error("Failed to setup contract:", error);
      }
    }
  };

  useEffect(() => {
    if (address) {
      setup();
    } else {
      setContract(null);
    }
  }, [address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Link href="/">
              <img src="/logo.jpg" alt="" />
            </Link>
          </div>
        </div>
        
        {isConnected && (
          <div className="flex items-center space-x-2">
            <WalletConnection />
          </div>
        )}
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-gray-300 text-lg">Ready to challenge?</p>
          </div>
          <WalletConnection />
        </div>
      ) : (
        <div className="px-4">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-gray-300">Ready to challenge?</p>
          </div>

          {/* Game Modes Section */}
          <div className="mb-8">
            {/* <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Game Modes</h2>
              <button className="text-cyan-400 text-sm font-medium">View All</button>
            </div> */}

            <div className="grid grid-cols-2 gap-4">
              {/* Quick Match Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 relative overflow-hidden min-h-[160px]">
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-blue-400/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
                <div className="mt-16">
                  <h3 className="font-bold text-lg mb-2">Quick Match</h3>
                  <p className="text-blue-100 text-sm mb-3">Instant play with auto-matching</p>
                  {/* <div className="flex items-center text-blue-100 text-sm">
                    <span className="mr-2">👥</span>
                    <span>{games.length} online</span>
                  </div> */}
                    <div className="flex items-center text-blue-100 text-sm">
                    <span>Coming soon...</span>
                  </div>
                </div>
              </div>

              {/* Create Room Card */}
              <div 
                className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 relative overflow-hidden min-h-[160px] cursor-pointer transform transition-transform hover:scale-105 active:scale-95" 
                onClick={createGame}
              >
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-orange-400/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">+</span>
                  </div>
                </div>
                <div className="mt-16">
                  <h3 className="font-bold text-lg mb-2">Create Room</h3>
                  <p className="text-orange-100 text-sm mb-3">Custom settings & invite friends</p>
                  {/* <div className="flex items-center text-orange-100 text-sm">
                    <span className="mr-2">⚙️</span>
                    <span>Full customization</span>
                  </div> */}
                </div>
                {createLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
                    <div className="text-white font-medium">Creating...</div>
                  </div>
                )}
              </div>

              {/* Tournament Card */}
              {/* <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-6 relative overflow-hidden min-h-[160px]">
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-purple-400/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>
                <div className="mt-16">
                  <h3 className="font-bold text-lg mb-2">Tournament</h3>
                  <p className="text-purple-100 text-sm mb-3">Compete for big prizes</p>
                  <div className="flex items-center text-yellow-300 text-sm font-medium">
                    <span className="mr-2">💰</span>
                    <span>10,000 ZUNNO</span>
                  </div>
                  <div className="text-yellow-300 text-xs">Prize Pool</div>
                </div>
              </div> */}

              {/* Practice Card */}
              {/* <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-6 relative overflow-hidden min-h-[160px]">
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-green-400/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>
                <div className="mt-16">
                  <h3 className="font-bold text-lg mb-2">Practice</h3>
                  <p className="text-green-100 text-sm mb-3">Play against AI opponents</p>
                  <div className="flex items-center text-green-100 text-sm">
                    <span className="mr-2">🤖</span>
                    <span>No gas fees</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Available Rooms Section */}
          <div className="mb-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Available Rooms</h2>
              <button
                onClick={createGame}
                disabled={createLoading}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 px-4 py-2 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 active:scale-95"
              >
                {createLoading ? "Creating..." : "+ Create"}
              </button>
            </div>
            
            {games.length > 0 ? (
              <div className="bg-gray-800/30 rounded-3xl p-4">
                <ScrollArea className="max-h-80">
                  <div className="space-y-3">
                    {games.toReversed().map((gameId, index) => (
                      <GameCard
                        key={index}
                        index={index}
                        gameId={gameId}
                        joinGame={joinGame}
                        joinLoading={joiningGameId !== null && joiningGameId.toString() === gameId.toString()}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="bg-gray-800/30 rounded-3xl p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="text-4xl">🎮</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Active Rooms</h3>
                <p className="text-gray-400 text-sm mb-4">Be the first to create a room and start playing!</p>
                <button
                  onClick={createGame}
                  disabled={createLoading}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95"
                >
                  {createLoading ? "Creating Room..." : "Create First Room"}
                </button>
              </div>
            )}
          </div>
        </div>
      )} 
      
      <BottomNavigation />
      
      <Toaster />
    </div>
  );
}
