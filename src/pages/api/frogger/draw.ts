import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { getUserByFid } from "@/utils/fc";
import { addHubster } from "@/utils/storage";

const HUB_URL = process.env['HUB_URL'] || "hub-grpc.pinata.cloud"
const client = getSSLHubRpcClient(HUB_URL);

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      
      const dataUrl = ""
      res.send(dataUrl);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
    
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
