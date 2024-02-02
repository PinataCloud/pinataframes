import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { mintFrame } from "@/utils/tfocMint";
import { getConnectedAddressForUser } from "@/utils/fc";

const HUB_URL = process.env["HUB_URL"] || "hub.pinata.cloud";
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
      //  Template should have a post_url that matches the index of the plane selected
      const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta property="fc:frame:image" content="https://dweb.mypinata.cloud/ipfs/QmeaE5X1KEWRm6izD7xoVtggBdb26tKZCW3q2JjpvBuujz/" />
          <meta property="fc:frame:button:1" content="Mint" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/tfoc" />
          <meta property="fc:frame" content="vNext" />          
        <title>MHFC</title>
        </head>
        <body>
          <img src="https://dweb.mypinata.cloud/ipfs/QmeaE5X1KEWRm6izD7xoVtggBdb26tKZCW3q2JjpvBuujz/" />
        </body>
      </html>`;
      res.send(template1);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
      const { id } = req.query;
      console.log({ id });
      console.log(req.body);
      if (req.body.untrustedData.buttonIndex === 1) {
        //  Template should have a post_url that matches the index of the plane selected
        console.log("MINTING");
        //  Verify the signature from the payload
        const frameMessage = Message.decode(
          Buffer.from(req.body?.trustedData?.messageBytes || "", "hex"),
        );
        const result = await client.validateMessage(frameMessage);
        // if (result.isOk() && result.value.valid) {
        console.log(id);
        //  If verified, randomly select a plane to display

        const connectedAddressData = await getConnectedAddressForUser(
          req.body.untrustedData.fid,
        );
        if (!connectedAddressData || connectedAddressData.length === 0) {
          console.log("No connected address");
          return res.status(400).send("No connected address");
        }

        const connectedAddress = connectedAddressData[0].connectedAddress;
        //  Mint the plane to the wallet
        const tx = await mintFrame(connectedAddress, "ipfs://QmUNnKKACgaVCMdeqzmyfyg4QbdcLfPhVBhr7jNTTJzJ33");
        console.log({ tx });
        //  Template should have a post_url that matches the index of the plane selected
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://dweb.mypinata.cloud/ipfs/QmeaE5X1KEWRm6izD7xoVtggBdb26tKZCW3q2JjpvBuujz" />
          <meta property="fc:frame:button:1" content="Mint another but don't get greedy" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/tfoc" />
        <title>TFOC</title>
        </head>
        <body>
          <img src="https://dweb.mypinata.cloud/ipfs/QmeaE5X1KEWRm6izD7xoVtggBdb26tKZCW3q2JjpvBuujz" />
        </body>
      </html>`;
        return res.send(template1);
        // } else {
        //   return res.status(401).send("Unauthorized");
        // }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
