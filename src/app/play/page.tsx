"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UnoGameABI from "@/constants/UnoGame.json";
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
  useWriteContract,
  useWaitForTransactionReceipt,
  // useReadContract,
} from "wagmi";
import BottomNavigation from "@/components/BottomNavigation";
import GameCard from "./gameCard";
import Link from "next/link";
import { useChains } from 'wagmi'
import { client } from "@/utils/thirdWebClient";
import { baseSepolia } from "@/lib/chains";
import { unoGameABI } from "@/constants/unogameabi";
import { useReadContract, useActiveAccount, useSendTransaction } from "thirdweb/react";
import { waitForReceipt, getContract, prepareContractCall } from "thirdweb";

const CONNECTION =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
  "https://zkuno-669372856670.us-central1.run.app";

// DIAM wallet integration removed

export default function PlayGame() {
  const [open, setOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [computerCreateLoading, setComputerCreateLoading] = useState(false);
  const [joiningGameId, setJoiningGameId] = useState<BigInt | null>(null);
  const [gameId, setGameId] = useState<BigInt | null>(null);
  const router = useRouter();
  const chains = useChains();

  // Use Wagmi hooks for wallet functionality
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { account: recoilAccount } = useUserAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  
  // Wagmi contract write hooks
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const socket = useRef<Socket | null>(null);

  const { toast } = useToast();

  // Using Wagmi hooks for wallet connection
  const { connect, connectors } = useConnect();

  const contract = getContract({
    client,
    chain:  baseSepolia,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: unoGameABI,
  });

  const { data: activeGames, refetch: refetchGames } = useReadContract({
    contract,
    method: "getNotStartedGames",
  });

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

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(CONNECTION, {
        transports: ["websocket"],
      }) as any; // Type assertion to fix the type mismatch

      console.log("Socket connection established");
    }
  }, [socket]);

  useEffect(() => {
    if (socket.current) {
      console.log("Socket connection established");
      // Add listener for gameRoomCreated event
      socket.current.on("gameRoomCreated", () => {
        console.log("Game room created event received");
        refetchGames();
      });

      // Cleanup function
      return () => {
        if (socket.current) {
          socket.current.off("gameRoomCreated");
        }
      };
    }
  }, [socket, refetchGames]);

  const ISSERVER = typeof window === "undefined";

  const openHandler = () => {
    setOpen(false);
  };

  const createGame = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a game.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      setCreateLoading(true);
      console.log("Creating game...");

      const transaction = prepareContractCall({
        contract: {
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: unoGameABI,
          chain: baseSepolia,
          client,
        },
        method: "createGame",
        params: [address as `0x${string}`],
      });

      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Transaction successful:", result);
          toast({
            title: "Game created successfully!",
            description: "Game created successfully!",
            duration: 5000,
          });
          refetchGames();
          setCreateLoading(false);
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
          toast({
            title: "Error",
            description: "Failed to create game. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
          setCreateLoading(false);
        }
      });
    } catch (error) {
      console.error("Failed to create game:", error);
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setCreateLoading(false);
    }
  };

  const startComputerGame = async () => {
    if (contract && address) {
      try {
        setComputerCreateLoading(true);

        console.log("Creating computer game...");

        const transaction = prepareContractCall({
          contract: {
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
            abi: unoGameABI,
            chain: baseSepolia,
            client,
          },
          method: "createGame",
          params: [address as `0x${string}`],
        });
  
        sendTransaction(transaction, {
          onSuccess: async (result) => {
            console.log("Transaction successful:", result);
            toast({
              title: "Game created successfully!",
              description: "Game created successfully!",
              duration: 5000,
            });


            const receipt = await waitForReceipt({
              client,
              chain: baseSepolia,
              transactionHash: result.transactionHash,
            });

            const gameCreatedId = receipt.logs[0].topics[1]

            if (gameCreatedId) {
              const gameId = BigInt(gameCreatedId); // Convert hex to decimal
              setGameId(gameId);
    
              // Emit socket event to create computer game room
              if (socket.current) {
                socket.current.emit("createComputerGame", {
                  gameId: gameId.toString(),
                  playerAddress: address
                });
                console.log("Socket event emitted for computer game creation");
              }
    
              // Navigate to game room with computer mode flag
              router.push(`/game/${gameId}?mode=computer`);
            }

            refetchGames();
            setComputerCreateLoading(false);
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            toast({
              title: "Error",
              description: "Failed to create game. Please try again.",
              variant: "destructive",
              duration: 5000,
            });
            setComputerCreateLoading(false);
          }
        });

        // toast({
        //   title: "Computer Game Started",
        //   description: "Starting game against computer opponent!",
        //   duration: 3000,
        // });
      } catch (error) {
        console.error("Failed to create computer game:", error);
        toast({
          title: "Error",
          description: "Failed to start computer game. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setComputerCreateLoading(false);
      }
    } else {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to play against computer.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const joinGame = async (gameId: BigInt) => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to join a game.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      setJoiningGameId(gameId);
      console.log(`Joining game ${gameId.toString()}...`);

      const transaction = prepareContractCall({
        contract: {
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: unoGameABI,
          chain: baseSepolia,
          client,
        },
        method: "joinGame",
        params: [BigInt(gameId.toString()), address as `0x${string}`],
      });

      sendTransaction(transaction, {
        onSuccess: (result) => {
          console.log("Transaction successful:", result);
          toast({
            title: "Game joined successfully!",
            description: "Game joined successfully!",
            duration: 5000,
          });
          router.push(`/game/${gameId}`);
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
          toast({
            title: "Error",
            description: "Failed to join game. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
        }
      });

    } catch (error) {
      console.error("Failed to join game:", error);
      setJoiningGameId(null);
      toast({
        title: "Error",
        description: "Failed to join game. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log("Transaction confirmed with hash:", hash);
      
      // Check if this was a create game transaction
      if (createLoading) {
        console.log("Game created successfully");
        
        if (socket && socket.current) {
          socket.current.emit("createGameRoom");
        }
        
        refetchGames();
        setCreateLoading(false);
        
        toast({
          title: "Success",
          description: "Game created successfully!",
          duration: 3000,
        });
      }
      
      // Check if this was a join game transaction
      if (joiningGameId !== null) {
        console.log(`Joined game ${joiningGameId.toString()} successfully`);
        
        const gameIdToJoin = joiningGameId;
        setJoiningGameId(null);
        
        toast({
          title: "Success", 
          description: "Joined game successfully!",
          duration: 3000,
        });
        
        // Navigate to the game room
        router.push(`/game/${gameIdToJoin.toString()}`);
      }
    }
  }, [isConfirmed, hash, createLoading, joiningGameId]);

  // Handle transaction error
  useEffect(() => {
    if (error) {
      console.error("Transaction error:", error);
      setCreateLoading(false);
      setJoiningGameId(null);
      
      toast({
        title: "Transaction Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [error]);

  return (
    <div
    className="min-h-screen text-white relative overflow-hidden" 
    style={{
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' 
  }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-purple-500/10 to-transparent"></div>
        
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-purple-500/20 blur-[80px] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-pink-500/10 blur-[60px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <Link href="/">
              <img src="/images/logo.png" alt="" />
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
          <div className="text-center mb-2">
            <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-gray-300 text-lg">Ready to challenge?</p>
          </div>
          <WalletConnection />
        </div>
      ) : (
        <div className="px-4">
          {/* Welcome Section */}
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <p className="text-gray-300 text-sm mb-1">Ready to challenge?</p>
          </div>

          {/* Game Modes Section */}
          <div className="mb-8">
            {/* <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Game Modes</h2>
              <button className="text-cyan-400 text-sm font-medium">View All</button>
            </div> */}

            <div className="grid grid-cols-2 gap-4">
              {/* Quick Match Card */}
              <div 
                className="rounded-3xl relative overflow-hidden min-h-[160px] cursor-pointer transition-all duration-300 active:translate-y-1 border border-white/10"
                style={{
                  background: 'linear-gradient(180deg, #4a9eff 0%, #0069e3 100%)',
                  boxShadow: '0 10px 20px rgba(0, 105, 227, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
                }}
                onClick={startComputerGame}
              >
                {/* Glossy shine overlay */}
                <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none"></div>
                
                {/* Side shine effect */}
                <div className="absolute top-[5%] bottom-[5%] left-0 w-[3px] bg-gradient-to-b from-white/0 via-white/50 to-white/0 pointer-events-none"></div>
                
                {/* Content container with padding */}
                <div className="relative p-3 h-full flex flex-col">
                  {/* Icon */}
                  {/* <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg mb-4">
                    <span className="text-2xl text-white">⚡</span>
                  </div> */}
                  
                  {/* Text content */}
                  <div className="mt-auto">
                    <h3 className="font-bold text-2xl mb-2 text-white">Quick Match</h3>
                    <p className="text-white/80 text-sm mb-3">Play against AI opponent</p>
                    {/* <div className="flex items-center text-white/70 text-sm">
                      <span>Coming soon...</span>
                    </div> */}
                  </div>
                </div>
                {computerCreateLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
                    <div className="text-white font-medium">Creating...</div>
                  </div>
                )}
              </div>

              {/* Create Room Card */}
              <div 
                className="rounded-3xl relative overflow-hidden min-h-[160px] cursor-pointer transition-all duration-300 active:translate-y-1 border border-white/10"
                onClick={createGame}
                style={{
                  background: 'linear-gradient(180deg, #ff5a87 0%, #e3003a 100%)',
                  boxShadow: '0 10px 20px rgba(227, 0, 58, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                {/* Glossy shine overlay */}
                <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl pointer-events-none"></div>
                
                {/* Side shine effect */}
                <div className="absolute top-[5%] bottom-[5%] left-0 w-[3px] bg-gradient-to-b from-white/0 via-white/50 to-white/0 pointer-events-none"></div>
                
                {/* Content container with padding */}
                <div className="relative p-3 h-full flex flex-col">
                  {/* Icon */}
                  {/* <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg mb-4">
                    <span className="text-2xl font-bold text-white">+</span>
                  </div> */}
                  
                  {/* Text content */}
                  <div className="mt-auto">
                    <h3 className="font-bold text-2xl mb-2 text-white">Create Room</h3>
                    <p className="text-white/80 text-sm mb-3">Custom settings & invite friends</p>
                  </div>
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
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Available Rooms</h2>
              {/* <button
                onClick={createGame}
                disabled={createLoading}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 px-4 py-2 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 active:scale-95"
              >
                {createLoading ? "Creating..." : "+ Create"}
              </button> */}
            </div>
            
            {activeGames && activeGames.length > 0 ? (
              <div className="bg-gray-800/30 rounded-3xl p-4">
                <ScrollArea className="max-h-80">
                  <div className="space-y-3">
                    {activeGames.toReversed().map((gameId, index) => (
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
                  className={`glossy-button glossy-button-red transition-all duration-300 ${createLoading ? 'opacity-70' : ''}`}
                >
                  {createLoading ? "Creating Room..." : "Create Room"}
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
