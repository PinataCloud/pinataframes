import { Alchemy, Network, TokenBalancesResponse } from "alchemy-sdk";
const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL)

const wallet = new ethers.Wallet(
  process.env.SERVER_WALLET_PRIVATE_KEY,
  provider
);
const config = {
  apiKey: process.env.ALCHEMY_KEY,
  network: Network.BASE_SEPOLIA,
};
const contractAbi = require("./weekend.json").output.abi;
const alchemy = new Alchemy(config);

const contract = new ethers.Contract(
  process.env.WEEKEND_CONTRACT_ADDRESS,
  contractAbi,
  wallet
);

export const mintFrame = async (address: string, uri: string) => {
  try {
    console.log(address, uri);
    const tx = await contract.safeMint(address, `${uri}`, { gasLimit: "0x1000000" });
    console.log(tx);
    return tx; 
  } catch (error) {
    console.log("Minting error");
  }
}

