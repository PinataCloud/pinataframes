import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";

const HUB_URL = process.env["HUB_URL"] || "hub-grpc.pinata.cloud";
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
      const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta property="fc:frame:image" content="https://dweb.mypinata.cloud/ipfs/QmTidtsgh4faygkV3Fj1f2gfdLNYCFh3gsgNVWRsGwSQbA" />
          <meta property="fc:frame:button:1" content="Is it the weekend?" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/the-weekend" />
          <meta property="fc:frame" content="vNext" />          
       <title>The Weekend</title>
        </head>
        <body>
          <img src="https://dweb.mypinata.cloud/ipfs/QmTidtsgh4faygkV3Fj1f2gfdLNYCFh3gsgNVWRsGwSQbA" />
        </body>
      </html>`;
      res.send(template1);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
      var date = new Date();
      date.setHours(date.getHours() - date.getTimezoneOffset() / 60 + 5);
      var dayOfWeek = date.getDay();
      console.log(dayOfWeek)
      var hours = date.getHours();
      console.log(hours)
      // Check if it's the weekend or not
      var isWeekend =
        dayOfWeek === 0 ||
        dayOfWeek === 6 ||
        (dayOfWeek === 5 && hours >= 17) ||
        (dayOfWeek === 1 && hours < 5);
      if (!isWeekend) {        
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>The Weekend</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://dweb.mypinata.cloud/ipfs/QmQgqbUnCVwcXvdXjPMxEvY2vTv9HLY3ZwjG6rQS9Jc8XN" />
          <meta property="fc:frame:button:1" content="Not the Weekend :(" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/the-weekend" />
        </head>
        <body>
          <img src="https://dweb.mypinata.cloud/ipfs/QmQgqbUnCVwcXvdXjPMxEvY2vTv9HLY3ZwjG6rQS9Jc8XN" />
        </body>
      </html>`;
        return res.send(template1);
      } else {
        const template1 = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>It is the weekend :)</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta property="fc:frame:image" content="https://dweb.mypinata.cloud/ipfs/QmeDejkafV9hwBE2zYmmfUkLb5AjqPFpRUY2XkbLd8iq6n" />
          <meta property="fc:frame:button:1" content="Mint the Weekend" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/the-weekend/mint" />
        </head>
        <body>
          <img src="https://dweb.mypinata.cloud/ipfs/QmeDejkafV9hwBE2zYmmfUkLb5AjqPFpRUY2XkbLd8iq6n" />
        </body>
      </html>`;
        return res.send(template1);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
