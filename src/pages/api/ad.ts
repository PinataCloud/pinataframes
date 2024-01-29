// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const emojiMapper = [
  ['😂', '😬', '😎', '😢'], 
  ['🎮', '💄', '🏈', '🏀'], 
  ['🍻', '🍷', '🌮', '🍔']
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
if(req.method === "POST") {
    try {      
      //  Render the chat messages, nothing in the input box
      let imgUrl = "";
      const template1 = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta property="fc:frame:button:1" content="${emojiMapper[0].join(" ")}" />
    <meta property="fc:frame:button:2" content="${emojiMapper[1].join(" ")}" />
    <meta property="fc:frame:button:3" content="${emojiMapper[2].join(" ")}" />  
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imgUrl}?filename=t3.png" />
    <meta property="fc:frame:post_url" content="${process.env.POST_URL}" />
    <body>
    <img src="${imgUrl}?filename=t3.png" />
  </body>
</html>`
      res.send(template1);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
