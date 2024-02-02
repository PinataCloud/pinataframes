// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateImage } from "@/utils/satori";
import { getLastFourMessages } from "@/utils/storage";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      //add ipfs url here
      let imgUrl = `https://scarlet-muddy-pike-648.mypinata.cloud/ipfs/QmTeLL1Uu78tBtQTsmE8Qapop1HbtqSq1NYTpEhSt56XiQ`
      const initialFrame = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta property="fc:frame" content="vNext" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta property="fc:frame:image" content="${imgUrl}" />
          <meta property="fc:frame:button:1" content="Play Beta" />
          <meta property="fc:frame:button:1:action" content="post_redirect" />
          <meta property="fc:frame:post_url "content="${process.env.HOSTED_URL}/api/redirect/cosmiccowboys" />
        <title>Cosmic Cowboys</title>
        </head>
        <body>
          <img src="${imgUrl}" />
        </body>
      </html>`
      res.send(initialFrame);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
      
      res.send("");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
