import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { mintFrame } from "@/utils/weekendMint";
import { getConnectedAddressForUser } from "@/utils/fc";

const HUB_URL = "hub-grpc.pinata.cloud:2283";
const client = getSSLHubRpcClient(HUB_URL);

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.body)
  var date = new Date();
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60 + 5);
  var dayOfWeek = date.getDay();
  console.log(dayOfWeek);
  var hours = date.getHours();
  console.log(hours);
  // Check if it's the weekend or not
  var isWeekend =
    dayOfWeek === 0 ||
    dayOfWeek === 6 ||
    (dayOfWeek === 5 && hours >= 17) ||
    (dayOfWeek === 1 && hours < 24);
  try {
    console.log(req.body);
    if (req.body.untrustedData.buttonIndex === 1) {
      //  Template should have a post_url that matches the index of the plane selected
      console.log("MINTING");
      //  Verify the signature from the payload
      const frameMessage = Message.decode(
        Buffer.from(req.body?.trustedData?.messageBytes || "", "hex"),
      );
      const result = await client.validateMessage(frameMessage);
      console.log(result)
      // if (result.isOk() && result.value.valid) {
      //  If verified, randomly select a plane to display
      if (result.isOk() && result.value.valid && isWeekend) {
        const connectedAddressData = await getConnectedAddressForUser(
          req.body.untrustedData.fid,
        );
        if (!connectedAddressData || connectedAddressData.length === 0) {
          console.log("No connected address");
          return res.status(400).send("No connected address");
        }

        const connectedAddress = connectedAddressData[0].connectedAddress;
        //  Mint the plane to the wallet
        const tx = await mintFrame(connectedAddress, "ipfs://QmRYNWE6AGNc11MZrPGuqe47Rr35aLqpuPRnTQdPpxu5Hk");
        console.log({ tx });
        //  Template should have a post_url that matches the index of the plane selected
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://dweb.mypinata.cloud/ipfs/QmZpFMrCFc8Xs3orLBUukiG3f1VfNaHweSZYTB2SyZGyfc" />
          <meta property="fc:frame:button:1" content="Check again" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/the-weekend" />
        <title>The Weekend</title>
        </head>
        <body>
          <img src="https://dweb.mypinata.cloud/ipfs/QmZpFMrCFc8Xs3orLBUukiG3f1VfNaHweSZYTB2SyZGyfc" />
        </body>
      </html>`;
        return res.send(template1);
      } else {
        console.log("already minted or not the weekend")
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://dweb.mypinata.cloud/ipfs/QmRfY43eP6ySdEPE94ZQ2fDve3VQEpdbmYAgj4jdCgDsjR" />
          <meta property="fc:frame:button:1" content="Check Again" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/the-weekend" />
        <title>The Weekend</title>
        </head>
        <body>
          <img src="https://dweb.mypinata.cloud/ipfs/QmRfY43eP6ySdEPE94ZQ2fDve3VQEpdbmYAgj4jdCgDsjR" />
        </body>
      </html>`;
        return res.send(template1);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
}
