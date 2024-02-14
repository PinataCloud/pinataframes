import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { mintFrame } from "@/utils/steveMint";
import { getConnectedAddressForUser } from "@/utils/fc";

const HUB_URL = process.env['HUB_URL'] || "hub-grpc.pinata.cloud"
const client = getSSLHubRpcClient(HUB_URL);

export const config = {
  maxDuration: 300,
};

const availableSteves = [
  {
    index: 1,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/0.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/1",
  },
  {
    index: 2,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/1.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/2",
  },
  {
    index: 3,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/2.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/3",
  },
  {
    index: 4,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/3.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/4",
  },
  {
    index: 5,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/4.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/5",
  },
  {
    index: 6,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/5.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/6",
  },
  {
    index: 7,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/6.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/7",
  },
  {
    index: 8,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/7.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/8",
  },
  {
    index: 9,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/8.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/9",
  },
  {
    index: 10,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/9.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/10",
  },
  {
    index: 11,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/10.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/11",
  },
  {
    index: 12,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/11.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/12",
  },
  {
    index: 13,
    image: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/12.png",
    tokenUri: "https://dweb.mypinata.cloud/ipfs/QmWB2suVCz7xZ1dk6CSYcUfYAJfmQdqTTguKQpf6XTnfvW/13",
  },
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { id } = req.query
      if (req.body.untrustedData.buttonIndex === 1) {
        const randomSteve = availableSteves[Math.floor(Math.random()*availableSteves.length)];
        //  Template should have a post_url that matches the index of the plane selected
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="${randomSteve.image}" />
          <meta property="fc:frame:button:1" content="Different Steve" />
          <meta property="fc:frame:button:2" content="Mint Steve" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/steve-frames/${randomSteve.index}" />
        <title>MHFC</title>
        </head>
        <body>
          <img src="${randomSteve.image}" />
        </body>
      </html>`
        return res.send(template1);
      } else {        
        //  Verify the signature from the payload
        const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'));
        const result = await client.validateMessage(frameMessage);
        if (result.isOk() && result.value.valid) {          
          const selectedSteve = availableSteves.find((p: any) => p.index === parseInt(id as string, 10));
          if (!selectedSteve) {
            return res.status(400).send("No plane found");
          }

          const connectedAddressData = await getConnectedAddressForUser(req.body.untrustedData.fid);
          if(!connectedAddressData || connectedAddressData.length === 0) {
            console.log("No connected address");
            return res.status(400).send("No connected address")
          }

          const connectedAddress = connectedAddressData[0];          
          const tx = await mintFrame(connectedAddress, selectedSteve.tokenUri)
          console.log({tx});          
          const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://dweb.mypinata.cloud/ipfs/QmPEQPdNtqBr1jsRqD3zAcvNQ9HjnibrpTsrKXPYT5VYZM" />
          <meta property="fc:frame:button:1" content="Start over, but don't be greedy" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/steve-frames" />
        <title>MHFC</title>
        </head>
        <body>
          <img src="${selectedSteve.image}" />
        </body>
      </html>`
          return res.send(template1);
        } else {
          return res.status(401).send("Unauthorized");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
