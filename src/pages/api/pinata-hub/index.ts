import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { getUserByFid } from "@/utils/fc";
import { addHubster } from "@/utils/storage";

const HUB_URL = process.env['HUB_URL'] || "hub.pinata.cloud"
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
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWbcF2CPpHbLoXMnarUMRpNu1dvqMS3b4MQG3wDPAnHHh" />
          <meta property="fc:frame:button:1" content="Get started" />
          <meta property="fc:frame" content="vNext" />          
        <title>Pinata Hub</title>
        </head>
        <body>
          <img src="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWbcF2CPpHbLoXMnarUMRpNu1dvqMS3b4MQG3wDPAnHHh" />
        </body>
      </html>`
      res.send(template1);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
      console.log(req.body);
      //  Verify the signature from the payload
      const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'));
      const result = await client.validateMessage(frameMessage);
      console.log(result);
      // if (result.isOk() && result.value.valid) {
        //  Template should have a post_url that matches the index of the plane selected
        const template1 = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta property="fc:frame:image" content="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmS61nyZqrxbUZrbRbDX6LuqpSk6D8iRLHetVd2ByR9K19" />
            <meta property="fc:frame:button:1" content="Ready to party?" />
            <meta property="fc:frame" content="vNext" />    
            <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/pinata-hub/start" />      
          <title>Pinata Hub</title>
          </head>
          <body>
            <img src="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmS61nyZqrxbUZrbRbDX6LuqpSk6D8iRLHetVd2ByR9K19" />
          </body>
        </html>`

        return res.send(template1)
      // } else {
      //   return res.status(401).send("Unauthorized");
      // }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
