import type { NextApiRequest, NextApiResponse } from "next";
import {PinataFDK} from "pinata-fdk";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT!,
  pinata_gateway: process.env.GATEWAY_URL!.split("https://")[1],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/frame-mint-tutorial?id=2`,
        aspect_ratio: "1.91:1",
        buttons: [{ label: "Read On 👉", action: "post" }],
        cid: "QmV64KsFDVA2dZFZEPYxdKAU2GtB9qxSmi5BeQ7fW7V9L6/1.png",
      });
      res.send(frameMetadata);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    const { id }: any = req.query;
    const idAsNumber = parseInt(id);
    if (idAsNumber === 4) {
      try {
        const frameMetadata = await fdk.getFrameMetadata({
          post_url: `${process.env.HOSTED_URL}/api/frame-mint-tutorial/redirect`,
          aspect_ratio: "1.91:1",
          buttons: [{ label: "Read Full Post", action: "post_redirect" }, { label: "Watch Video", action: "post_redirect"}],
          cid: `QmV64KsFDVA2dZFZEPYxdKAU2GtB9qxSmi5BeQ7fW7V9L6/${id}.png`,
        });
        res.send(frameMetadata);
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }
    } else {
      const nextId = idAsNumber + 1;
      try {
        const frameMetadata = await fdk.getFrameMetadata({
          post_url: `${process.env.HOSTED_URL}/api/frame-mint-tutorial?id=${nextId}`,
          aspect_ratio: "1.91:1",
          buttons: [{ label: "Next", action: "post" }],
          cid: `QmV64KsFDVA2dZFZEPYxdKAU2GtB9qxSmi5BeQ7fW7V9L6/${id}.png`,
        });
        res.send(frameMetadata);
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }
    }
  }
}
