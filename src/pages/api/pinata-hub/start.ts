import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { getUserByFid } from "@/utils/fc";
import { addHubster } from "@/utils/storage";

const HUB_URL = process.env['HUB_URL'] || "http://54.88.44.144:2281"
const client = getSSLHubRpcClient(HUB_URL);

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
if (req.method === "POST") {
    try {
      //  Verify the signature from the payload
      const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'));
      const result = await client.validateMessage(frameMessage);
      if (result.isOk() && result.value.valid) {
        //  Template should have a post_url that matches the index of the plane selected
        const template1 = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta property="fc:frame:image" content="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmdCtKwGbjxyT3ys9Rhs7rkWwfpf1Ag2peVnC5h33xWv5D" />
            <meta property="fc:frame" content="vNext" />          
          <title>Pinata Hub</title>
          </head>
          <body>
            <img src="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmdCtKwGbjxyT3ys9Rhs7rkWwfpf1Ag2peVnC5h33xWv5D" />
          </body>
        </html>`
        
        return res.send(template1);
      } else {
        return res.status(401).send("Unauthorized");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
