"use client";

import StyledButton from "@/components/styled-button";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TokenInfoBar from "@/components/TokenBar";
import { UnoGameContract } from "@/lib/types";
import { getContractNew } from "@/lib/web3";
import io, { Socket } from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserAccount } from "@/userstate/useUserAccount";
import { WalletConnection } from "@/components/WalletConnection";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useContractWrite,
  useWalletClient,
} from "wagmi";
import Link from "next/link";

const CONNECTION =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
  "https://unosocket-6k6gsdlfoa-el.a.run.app/";

// DIAM wallet integration removed

export default function PlayGame() {
  const [contract, setContract] = useState<UnoGameContract | null>(null);
  const [open, setOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [gameId, setGameId] = useState<BigInt | null>(null);
  const [games, setGames] = useState<BigInt[]>([]);
  const router = useRouter();

  // Use Wagmi hooks for wallet functionality
  const { address, isConnected } = useAccount();
  console.log(address);
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
        setJoinLoading(true);

        console.log(`Joining game ${gameId.toString()}...`);

        const gameIdBigint = BigInt(gameId.toString());
        // Using Wagmi address directly
        const tx = await contract.joinGame(gameIdBigint, address as `0x${string}`);
        console.log("Transaction hash:", tx.hash);
        await tx.wait();

        setJoinLoading(false);

        console.log("Joined game successfully");
        router.push(`/game/${gameId.toString()}`);
      } catch (error) {
        console.error("Failed to join game:", error);
        setJoinLoading(false);
        toast({
          title: "Transaction Failed",
          description: "Failed to join game.",
          variant: "destructive",
        });
      }
    } else {
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
    <div className="relative p-3 h-screen flex flex-col justify-between">
      <div>
        <div className="bg-white relative rounded-2xl flex gap-5 p-3 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Link href="/profile" className="cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/8.x/notionists/svg`}
                  alt="@user"
                />
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          {/* <span className='flex items-center'>
                        <div className='font-bold'>{"Hey"}</div>
                        <div className='font-light text-gray-500 text-sm'>Go to profile</div>
                    </span> */}
          <WalletConnection />
        </div>
        {!address ? (
          <div className="relative text-center flex justify-center">
            <img src="/login-button-bg.png" />
            <div className="left-1/2 -translate-x-1/2 absolute bottom-4">
              <WalletConnection />
            </div>
          </div>
        ) : (
          <div>
            <div>
              <h2 className="mt-3 text-white font-bold text-3xl">Games list</h2>
              <ScrollArea className="h-[calc(100vh-320px)] mt-3 rounded-2xl border-[1px] shadow-md border-[#000022] bg-[#b49fc9] p-4">
                {games.toReversed().map((gameId, index) => (
                  <div
                    key={index}
                    className="bg-[#000022]/10 rounded-2xl p-3 mt-3 flex gap-3 items-center justify-around hover:bg-[#000022]/20"
                  >
                    <div>
                      <span className="font-bold">Game </span>
                      <span className="font-bold">{gameId.toString()}</span>
                    </div>
                    <StyledButton
                      onClick={() => joinGame(gameId)}
                      className="bg-[#FF7033] max-w-24"
                    >
                      Join
                    </StyledButton>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="flex mt-3">
              <StyledButton
                onClick={() => createGame()}
                className="bg-[#FF7033] w-full"
              >
                {createLoading ? "Creating..." : "Create game"}
              </StyledButton>
            </div>
          </div>
        )}
      </div>
      {/* <div className='w-full'>
                <FooterNavigation />
            </div> */}

      {/*<TokenInfoBar />
            <div className='bg-white w-full max-w-[1280px] h-[720px] overflow-hidden mx-auto my-8 px-4 py-2 rounded-lg bg-cover bg-[url("/bg-2.jpg")] relative shadow-[0_0_20px_rgba(0,0,0,0.8)]'>
                <div className='absolute inset-0 bg-no-repeat bg-[url("/table-1.png")]'></div>
                <div className='absolute left-8 -right-8 top-14 -bottom-14 bg-no-repeat bg-[url("/dealer.png")] transform-gpu'>
                    <div className='absolute -left-8 right-8 -top-14 bottom-14 bg-no-repeat bg-[url("/card-0.png")] animate-pulse'></div>
                </div>
                <div className='absolute top-0 md:left-1/2 md:right-0 bottom-0 w-[calc(100%-2rem)] md:w-auto md:pr-20 py-12'>
                    {!address ?
                        <div className='relative text-center flex flex-col items-center'>
                            <img src='/login-button-bg.png' />
                            <div className='absolute bottom-4 w-full'>
                                <WalletConnection />
                            </div>
                        </div>
                        : <>
                            <StyledButton onClick={() => createGame()} className='w-fit bg-[#00b69a] bottom-4 text-2xl my-3 mx-auto'>{createLoading == true ? 'Creating...' : 'Create Game Room'}</StyledButton>
                            <p className='text-white text-sm font-mono'>Note: Don't join the room where game is already started</p>
                            {joinLoading == true && <div className='text-white mt-2 text-2xl shadow-lg'>Wait, while we are joining your game room...</div>}
                            <h2 className="text-2xl font-bold mb-4 text-white">Active Game Rooms:</h2>
                            <ScrollArea className="h-[620px] rounded-md border border-gray-200 bg-white p-4">
                                <ul className="space-y-2">
                                    {games.toReversed().map(gameId => (
                                        <li key={gameId.toString()} className="mb-2 bg-gray-100 p-4 rounded-lg shadow flex flex-row justify-between items-center">
                                            <h2 className="text-xl font-semibold text-gray-800">Game {gameId.toString()}</h2>
                                            <StyledButton onClick={() => joinGame(gameId)} className='w-fit bg-[#00b69a] bottom-4 text-2xl'>Join Game </StyledButton>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        </>
                    }
                </div>
            </div>*/}
      <Toaster />
    </div>
  );
}
