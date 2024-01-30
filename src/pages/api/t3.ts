// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getUserByFid } from "@/utils/fc";
import { generateImage } from "@/utils/satori";
import { addMessage, addOrUpdateUserInput, getCurrentInputForUser, getLastFourMessages } from "@/utils/storage";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  maxDuration: 300,
};


const emojiMapper = [
  ['😂', '😬', '😎', '😢'], 
  ['🎮', '💄', '🏈', '🏀'], 
  ['🍻', '🍷', '🌮', '🍔']
]

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
if(req.method === "POST") {
    try {
      const { untrustedData } = req.body;
      //  Check the button index
      const buttonIndex = untrustedData.buttonIndex;
      const fid = untrustedData.fid;


const adTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>T3 Emoji</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta property="fc:frame:button:1" content="See messages" />    
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://mktg.mypinata.cloud/ipfs/QmSAPdmCYuu9RyGi4KGnjagyLg3xYkVkjkTzA1ddqPjHnm?filename=t3.gif" />
    <meta property="fc:frame:post_url" content="${process.env.AD_POST_URL}" />
  </head>
  <body>
    <img src="https://mktg.mypinata.cloud/ipfs/QmSAPdmCYuu9RyGi4KGnjagyLg3xYkVkjkTzA1ddqPjHnm?filename=t3.gif" />
  </body>
</html>
`

      switch(buttonIndex) {
        case 1: 
          //  Grab random emoji from correct index
          const emoji1 = emojiMapper[0][Math.floor(Math.random()*emojiMapper[0].length)]
          //  Render input with emoji and chat messages
          const currentMessage0 = await getCurrentInputForUser(fid) || {input: ""};
          let newMessage0 = currentMessage0.input + emoji1;
          console.log(newMessage0)
          await addOrUpdateUserInput(fid, newMessage0);
          let messages0:any = await getLastFourMessages();
          messages0.reverse()
          const requestBody0 = {
            messages: messages0, 
            input: newMessage0
          }
          const imgUrl = await generateImage(requestBody0);  
const template1 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>T3 Emoji</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta property="fc:frame:button:1" content="${emojiMapper[0].join(" ")}" />
  <meta property="fc:frame:button:2" content="${emojiMapper[1].join(" ")}" />
  <meta property="fc:frame:button:3" content="${emojiMapper[2].join(" ")}" /> 
  <meta property="fc:frame:button:4" content="Send" />    
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imgUrl}" />
  <meta property="fc:frame:post_url" content="${process.env.POST_URL}" />
</head>
<body>
  <img src="${imgUrl}" />
</body>
</html>`    
          return res.setHeader('content-type', 'text/html').send(template1);        
        case 2: 
          //  Grab random emoji from correct index
          const emoji2 = emojiMapper[1][Math.floor(Math.random()*emojiMapper[1].length)]
          //  Render input with emoji and chat messages
          const currentMessage = await getCurrentInputForUser(fid) || {input: ""};
          let newMessage = currentMessage.input + emoji2;
          await addOrUpdateUserInput(fid, newMessage);
          let messages:any = await getLastFourMessages();
          messages.reverse()
          const requestBody = {
            messages, 
            input: newMessage
          }
          const imgUrl2 = await generateImage(requestBody);  
const template2 = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>T3 Emoji</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta property="fc:frame:button:1" content="${emojiMapper[0].join(" ")}" />
    <meta property="fc:frame:button:2" content="${emojiMapper[1].join(" ")}" />
    <meta property="fc:frame:button:3" content="${emojiMapper[2].join(" ")}" /> 
    <meta property="fc:frame:button:4" content="Send" />    
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imgUrl2}" />
    <meta property="fc:frame:post_url" content="${process.env.POST_URL}" />
  </head>
  <body>
    <img src="${imgUrl2}" />
  </body>
</html>` 
          return res.setHeader('content-type', 'text/html').send(template2);
        case 3: 
          //  Grab random emoji from correct index
          const emoji3 = emojiMapper[2][Math.floor(Math.random()*emojiMapper[2].length)]
          //  Render input with emoji and chat messages
          const currentMessage2 = await getCurrentInputForUser(fid) || {input: ""};
          let newMessage2 = currentMessage2.input + emoji3;
          await addOrUpdateUserInput(fid, newMessage2);
          let messages2:any = await getLastFourMessages();
          messages2.reverse()
          const requestBody2 = {
            messages: messages2, 
            input: newMessage2
          }
          const imgUrl3 = await generateImage(requestBody2);  
const template3 = `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>T3 Emoji</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta property="fc:frame:button:1" content="${emojiMapper[0].join(" ")}" />
  <meta property="fc:frame:button:2" content="${emojiMapper[1].join(" ")}" />
  <meta property="fc:frame:button:3" content="${emojiMapper[2].join(" ")}" /> 
  <meta property="fc:frame:button:4" content="Send" />    
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${imgUrl3}" />
  <meta property="fc:frame:post_url" content="${process.env.POST_URL}" />
</head>
<body>
  <img src="${imgUrl3}" />
</body>
</html>` 
          return res.setHeader('content-type', 'text/html').send(template3);
        case 4: 
          //  Save final message
          const user = await getUserByFid(fid);
          if(!user) {
            throw new Error("No user");
          }
          const finalMessage = await getCurrentInputForUser(fid) || {input: ""};
          await addMessage(user, finalMessage.input)
          await addOrUpdateUserInput(fid, "");
          //  Return ad template
          return res.setHeader('content-type', 'text/html').send(adTemplate)        
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
