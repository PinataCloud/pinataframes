// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

const emojiMapper = [
  ['😂', '😬', '😎', '😢'], 
  ['🎮', '💄', '🏈', '🏀'], 
  ['🍻', '🍷', '🌮', '🍔']
]

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if(req.method === "GET") {
    try {
      let imgUrl = ""
      //  Return the initial frame
      const initialFrame = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta property="fc:frame:button:1" content="Start emoji chatting" /> 
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imgUrl}?filename=t3.png" />
    <body>
    <img src="${imgUrl}?filename=t3.png" />
  </body>
</html>`
      res.send(initialFrame);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if(req.method === "POST") {
    try {
      const { untrustedData } = req.body;
      //  Check the button index
      const buttonIndex = untrustedData.buttonIndex;
      const fid = untrustedData.fid;
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
    <meta property="fc:frame:button:4" content="Send" />    
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imgUrl}?filename=t3.png" />
    <meta property="fc:frame:post_url" content="${process.env.POST_URL}" />
    <body>
    <img src="${imgUrl}?filename=t3.png" />
  </body>
</html>`

const adTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta property="fc:frame:button:1" content="See messages" />    
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imgUrl}?filename=t3.png" />
    <meta property="fc:frame:post_url" content="${process.env.AD_POST_URL}" />
    <body>
    <img src="${imgUrl}?filename=t3.png" />
  </body>
</html>
`

      switch(buttonIndex) {
        case 1: 
          //  Grab random emoji from correct index
          const emoji1 = emojiMapper[0][Math.floor(Math.random()*emojiMapper[0].length)]
          //  Render input with emoji and chat messages
          //  Set imgUrl variable
          //  Save current message for FID to Pinata          
          return res.send(template1);        
        case 2: 
          //  Grab random emoji from correct index
          const emoji2 = emojiMapper[1][Math.floor(Math.random()*emojiMapper[1].length)]
          //  Render input with emoji and chat messages
          //  Set imgUrl variable
          //  Save current message for FID to Pinata
          return res.send(template1);
        case 3: 
          //  Grab random emoji from correct index
          const emoji3 = emojiMapper[2][Math.floor(Math.random()*emojiMapper[2].length)]
          //  Render input with emoji and chat messages
          //  Set imgUrl variable
          //  Save current message for FID to Pinata
          return res.send(template1);
        case 4: 
          //  Save final message
          //  Return ad template
          return res.send(adTemplate)        
      }
      //  Render image accordingly
      //  Set buttons in OG button tags
      //  Return frame
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
