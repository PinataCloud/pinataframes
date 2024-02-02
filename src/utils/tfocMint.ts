import { Alchemy, Network, TokenBalancesResponse } from "alchemy-sdk";
const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(process.env.BASE_URL)

const wallet = new ethers.Wallet(
  process.env.BASE_SERVER_WALLET_PRIVATE_KEY,
  provider
);
const config = {
  apiKey: process.env.BASE_ALCHEMY_KEY,
  network: Network.BASE_MAINNET,
};
const contractAbi = require("./tfoc.json").output.abi;
const alchemy = new Alchemy(config);

const contract = new ethers.Contract(
  process.env.TFOC_CONTRACT_ADDRESS,
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
