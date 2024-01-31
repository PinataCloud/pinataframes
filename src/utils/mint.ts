import { Alchemy, Network, TokenBalancesResponse } from "alchemy-sdk";
const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL_BASE)

const wallet = new ethers.Wallet(
  process.env.SERVER_WALLET_PRIVATE_KEY,
  provider
);
const config = {
  apiKey: process.env.ALCHEMY_KEY,
  network: Network.BASE_SEPOLIA,
};
const contractAbi = require("./milehigh.json");
const alchemy = new Alchemy(config);

const contract = new ethers.Contract(
  process.env.MILE_HIGH_CONTRACT_ADDRESS,
  contractAbi,
  wallet
);

export const mintFrame = async (address: string, uri: string) => {
  const tx = await contract.mintFrame(address, `ipfs://${uri}`, { gasLimit: "0x1000000" });
  console.log(tx);
  return tx;
}
