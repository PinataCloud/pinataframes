import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { mintFrame } from "@/utils/mint";

const HUB_URL = process.env['HUB_URL'] || "nemes.farcaster.xyz:2283"
const client = getSSLHubRpcClient(HUB_URL);

export const config = {
  maxDuration: 300,
};

const availablePlanes = [
  {
    index: 1,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmdfSmozLFGfrXfSKzZHobtQ6LDkCUt8rmJo9ZEXfdcDyz",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/1.json",
  },
  {
    index: 2,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmcBHH2iJbqxA4VKTREUK27SyotxBwxetnBSCQQU3BFvrx",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/2.json",
  },
  {
    index: 3,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmYsQNdMWM17p8AJaTQByo5Ae5UBh5apVbaxrJNkwDvG1G",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/3.json",
  },
  {
    index: 4,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmXKHR9QBtoeMD6pA8mqhay4jpRbD15D1axAFmkvrgihGU",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/4.json",
  },
  {
    index: 5,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmabNYmkeJSKJUYNd8CtyPdnJE2wz6q2YQAtnj59UZKbVp",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/5.json",
  },
  {
    index: 6,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmRXU6d5vzHQfEajUiia7TyhatjX3PpfNyvBNd5yQVsSWv",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/6.json",
  },
  {
    index: 7,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmUzXsoWmJ8w5ystUpVe1DZ5cs1AzxqcsYGrXebEa84cMs",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/7.json",
  },
  {
    index: 8,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/Qmbx3MkEhqSegyvqAYaHGvTsvFu1aq77LrzzbEnNsjexAs",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/8.json",
  },
  {
    index: 9,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmTntQR5SyFshiYkZQE3dCrj7xxjvKECkXvNzAn4AaiJA3",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/9.json",
  },
  {
    index: 10,
    image: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmU1FH4CrpGH9UZh85wX2BgoPeuehNwMo7CUmQxUEPpXXJ",
    tokenUri: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWZGdaNhRBgNeBcKZuAnsXeiEYwk91VmPb4M4gG8Rthmg/10.json",
  },
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { id } = req.query
      console.log({id});
      console.log(req.body);
      if (req.body.untrustedData.buttonIndex === 1) {
        const randomPlane = availablePlanes[Math.floor(Math.random()*availablePlanes.length)];
        console.log("Random plane: ")
        console.log(randomPlane);
        //  Template should have a post_url that matches the index of the plane selected
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="${randomPlane.image}" />
          <meta property="fc:frame:button:1" content="Different plane" />
          <meta property="fc:frame:button:2" content="Mint Plane" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/mile-high-frame/${randomPlane.index}" />
        <title>MHFC</title>
        </head>
        <body>
          <img src="${randomPlane.image}" />
        </body>
      </html>`
        return res.send(template1);
      } else {
        //  Verify the signature from the payload
        const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'));
        const result = await client.validateMessage(frameMessage);
        if (result.isOk() && result.value.valid) {
          //  If verified, randomly select a plane to display
          const selectedPlane = availablePlanes.find((p: any) => p.index === id);
          if (!selectedPlane) {
            return res.status(400).send("No plane found");
          }

          //  Mint the plane to the wallet
          const tx = await mintFrame("0x1612C6DFf0Eb5811108b709A30d8150495ce9CC5", selectedPlane.tokenUri)
          console.log({tx});
          //  Template should have a post_url that matches the index of the plane selected
          const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWNxYQSCvuB2PmLHYWthxPeUN1cqZhj4ZCFCUCpJrSQNy" />
          <meta property="fc:frame:button:1" content="Start over, but don't be greedy" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/mile" />
        <title>MHFC</title>
        </head>
        <body>
          <img src="${selectedPlane.image}" />
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
