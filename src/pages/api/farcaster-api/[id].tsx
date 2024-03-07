import type { NextApiRequest, NextApiResponse } from "next";
import { getSSLHubRpcClient, Message } from "@farcaster/hub-nodejs";
import { PinataFDK } from "pinata-fdk";
const fdk = new PinataFDK({
    pinata_jwt: process.env.PINATA_JWT as string,
    pinata_gateway: process.env.GATEWAY_URL as string}, 
);

const HUB_URL = process.env['HUB_URL'] || "hub-grpc.pinata.cloud"
const client = getSSLHubRpcClient(HUB_URL);

const STARTING_CID = "QmQYFeub8vRJzrX7EExfQqJoc3xswEk5NZyN8Yj2Ape6To"
const SUCCESS_CID = "QmPSoJTvnJ3jA5HTxX7q8EwdxZAQBJvx8fUce6grrmRP4K"
const TRYAGAIN_CID = "QmQkn6zGsPDbmkSzoJLDEi7Bp6RNY533nnhiH5AhicMpAE"
const DOCS_URL = ""
const HASH = ""

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const checkIfWeCanReleaseDocs = async () => {
    // const res = await fetch(`https://api.pinata.cloud/v3/farcaster/casts/${HASH}`, {
    //   headers: {
    //     Authorization: `Bearer ${process.env.PINATA_JWT}`
    //   }
    // })
    // const json = await res.json();
    // const likes = json?.data?.reactions?.likes.length || 0
    // console.log({likes})
    // if(likes > 623) {
    //   return true
    // }
    return false;
  }

  if (req.method === "POST") {
    try {
      const { id } = req.query
      switch(id) {
        case "check": 
        default:
          const canRelease = await checkIfWeCanReleaseDocs()
          if(canRelease) {
            const releaseMetadata = fdk.getFrameMetadata({
              post_url: `${process.env.HOSTED_URL}/api/farcaster-api/check`,
              aspect_ratio: "1.91:1",
              buttons: [
                { label: 'See the docs', action: 'link', target: DOCS_URL},              
              ],
              cid: SUCCESS_CID
            });
            return res.send(`<!DOCTYPE html>
            <html lang="en">
              <head>
                ${releaseMetadata}
              </head>
              <body>
                <div style="background: #fff;">
                  <img style="width: 50%; margin: auto;" src="${process.env.GATEWAY_URL}/ipfs/${SUCCESS_CID}" />
                </div>
              </body>
              </html>`)
          } else {
            const notEnoughLikesMetadata = fdk.getFrameMetadata({
              post_url: `${process.env.HOSTED_URL}/api/check`,
              aspect_ratio: "1.91:1",
              buttons: [
                { label: 'Check again', action: 'post' },              
              ],
              cid: TRYAGAIN_CID
            });
            return res.send(`<!DOCTYPE html>
            <html lang="en">
              <head>
                ${notEnoughLikesMetadata}
              </head>
              <body>
                <div style="background: #fff;">
                  <img style="width: 50%; margin: auto;" src="${process.env.GATEWAY_URL}/ipfs/${TRYAGAIN_CID}" />
                </div>
              </body>
              </html>`)
          }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else {
    try {
      const mainMeta = fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/check`,
        aspect_ratio: "1.91:1",
        buttons: [
          { label: 'Unlock Docs', action: 'post' },              
        ],
        cid: STARTING_CID
      });
      return res.send(`<!DOCTYPE html>
      <html lang="en">
        <head>
          ${mainMeta}
        </head>
        <body>
          <div style="background: #fff;">
            <img style="width: 50%; margin: auto;" src="${process.env.GATEWAY_URL}/ipfs/${STARTING_CID}" />
          </div>
        </body>
        </html>`)
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
