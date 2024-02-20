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
          aspectRatio: "1.91:1",
          buttons: [
            {
              label: "Read Full Post",
              action: "link",
              target:
                "https://www.pinata.cloud/blog/how-to-build-a-farcaster-frame-that-mints-nfts",
            },
            {
              label: "Watch Video",
              action: "link",
              target: "https://youtu.be/5VVOMolm-TA",
            },
          ],
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
          aspectRatio: "1.91:1",
          buttons: [
            { label: "Next", action: "post" },
            {
              label: "Watch Video",
              action: "link",
              target: "https://youtu.be/5VVOMolm-TA",
            },
          ],
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
