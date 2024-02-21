// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateAnalyticsImage, generateImage } from "@/utils/satori";
import { getLastFourMessages } from "@/utils/storage";
import { FrameMetadata } from "@coinbase/onchainkit";
import type { NextApiRequest, NextApiResponse } from "next";
import { FrameHTMLType, PinataFDK } from "pinata-fdk";

let FRAME_ID: any = "frame-analytics"

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT!,
  pinata_gateway: process.env.GATEWAY_URL?.split("https://")[1]!
},
  //do not include https:// in your gateway url
);

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const query = req.query.frame_id;
      if(query) {
        FRAME_ID = query;
      }
      const imgUrl = query === "pinata_race" ? "https://dweb.mypinata.cloud/ipfs/Qma7ej7vBAprzbxuR4fkka4ecuw1427yzAVrfMXqsC8tUE" : await generateAnalyticsImage(FRAME_ID);
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/analytics-frame-general?frame_id=${query}`,        
        buttons: query === "pinata_race" ? [
          { label: 'Check race stats', action: 'post' },          
        ] : [
          { label: 'Refresh stats', action: 'post' },
          { label: 'Read docs', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk#frame-analytics" },
          { label: 'Read blog', action: "link", target: "https://www.pinata.cloud/blog/how-to-use-the-frame-development-kit-to-build-farcaster-frames" },
        ],
        image: { url: imgUrl }
      });
      const template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>T3 Emoji</title>
    ${frameMetadata}
  </head>
  <body>
    <img src="${imgUrl}" />
  </body>
</html>`
      return res.setHeader('content-type', 'text/html').send(template);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
      const query: any = req.query.frame_id;
      if(query) {
        FRAME_ID = query;
      }
      await fdk.sendAnalytics(FRAME_ID, req.body);
      const imgUrl = await generateAnalyticsImage(FRAME_ID);
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/analytics-frame`,
        aspect_ratio: "1:1",
        buttons: [
          { label: query === "pinata_race" ? "Check race stats" : 'Refresh stats', action: 'post' },
          { label: 'Build', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk#frame-analytics" },
          // { label: 'Read blog', action: "link", target: "https://www.pinata.cloud/blog/how-to-use-the-frame-development-kit-to-build-farcaster-frames" },
        ],
        image: { url: imgUrl }
      });
      const template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>T3 Emoji</title>
    ${frameMetadata}
  </head>
  <body>
    <img src="${imgUrl}" />
  </body>
</html>`
      return res.setHeader('content-type', 'text/html').send(template);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
