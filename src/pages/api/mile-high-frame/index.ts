import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";

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
  if (req.method === "GET") {
    try {
      const selectedPlane = availablePlanes[Math.floor(Math.random()*availablePlanes.length)];
        //  Template should have a post_url that matches the index of the plane selected
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmUUymhRMCkkNCWhCpsE2VtqitLFn4WJER1xDsLE7ayRcL" />
          <meta property="fc:frame:button:1" content="Find a plane to mint" />
          <meta property="fc:frame" content="vNext" />          
        <title>MHFC</title>
        </head>
        <body>
          <img src="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmUUymhRMCkkNCWhCpsE2VtqitLFn4WJER1xDsLE7ayRcL" />
        </body>
      </html>`
      res.send(template1);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
      //  Verify the signature from the payload
      const frameMessage = Message.decode(Buffer.from(req.body?.trustedData?.messageBytes || '', 'hex'));
      const result = await client.validateMessage(frameMessage);
      if (result.isOk() && result.value.valid) {
        //  If verified, randomly select a plane to display
        const selectedPlane = availablePlanes[Math.floor(Math.random()*availablePlanes.length)];
        //  Template should have a post_url that matches the index of the plane selected
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="${selectedPlane.image}" />
          <meta property="fc:frame:button:1" content="Different plane" />
          <meta property="fc:frame:button:2" content="Mint plane" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/mile-high-frame/${selectedPlane.index}" />
        <title>MHFC</title>
        </head>
        <body>
          <img src="${selectedPlane.image}" />
        </body>
      </html>`
        res.send(template1);
      } else {
        return res.status(401).send("Unauthorized");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
