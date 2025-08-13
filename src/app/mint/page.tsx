"use client";

import { useAuth } from "@campnetwork/origin/react";
import {
  CampModal,
  useAuthState,
  useModal as useCampModal,
  useConnect,
} from "@campnetwork/origin/react";

export async function assignImage(imageId: string, jwt: string) {
  await fetch(`https://api.origin.campnetwork.xyz/auth/merv/assign-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_id: imageId }),
  });
}

export default function Mint() {
  const { jwt, origin, viem } = useAuth();

  console.log(jwt, origin, viem);

  const handleMint = async () => {
    if (!origin || !jwt) throw new Error("User not authenticated");

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
      name: "Zunno",
      description: "A decentralized UNO game built on EVM chain",
      image: "https://uno-game-pi.vercel.app/images/hero-1.png",
    };
    const result = await origin.mintFile(file, meta, licence, parentId);
    console.log(result);
    await assignImage("1", jwt);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <CampModal injectButton={true} />
      <h1 className="text-6xl font-bold">Mint Page</h1>
      <button onClick={handleMint}>Mint</button>
    </div>
  );
}
