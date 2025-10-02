import { defineChain } from "thirdweb";

export const baseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpc: "https://sepolia.base.org",
  blockExplorers: [{
      name: "BaseScan",
      url: "https://sepolia.basescan.org",
  }],
  testnet: true,
});

export const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Celo",
    symbol: "CELO",
  },
  rpc: "https://forno.celo-sepolia.celo-testnet.org/",
  blockExplorers: [{
      name: "CeloScan",
      url: "https://celo-sepolia.blockscout.com/",
  }],
  testnet: true,
});

