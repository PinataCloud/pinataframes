import type { NextApiRequest, NextApiResponse } from "next";
import { PinataFDK } from "pinata-fdk";

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
        post_url: `${process.env.HOSTED_URL}/api/frame-analytics-tutorial?id=2`,
        aspect_ratio: "1.91:1",
        buttons: [{ label: "Read On 👉", action: "post" }],
        cid: "QmQEBDy135KEYJ6s56W8WTHKNN2gDsGpb8dMTn2JEqozpS/1.png",
      });
      res.send(frameMetadata);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    const body = req.body;
    const { id }: any = req.query;
    const idAsNumber = parseInt(id);
    if (idAsNumber === 4) {
      try {
        await fdk.sendAnalytics("analytics-tutorial-blog", body);
        const frameMetadata = await fdk.getFrameMetadata({
          post_url: `${process.env.HOSTED_URL}/api/frame-analytics-tutorial`,
          aspect_ratio: "1.91:1",
          buttons: [
            {
              label: "Read Full Post",
              action: "link",
              target:
                "https://www.pinata.cloud/blog/how-to-use-farcaster-frame-analytics",
            },
            {
              label: "Watch Video",
              action: "link",
              target: "https://youtu.be/vaynPsuLoQA",
            },
          ],
          cid: `QmQEBDy135KEYJ6s56W8WTHKNN2gDsGpb8dMTn2JEqozpS/${id}.png`,
        });
        res.send(frameMetadata);
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }
    } else {
      const nextId = idAsNumber + 1;
      try {
        await fdk.sendAnalytics("analytics-tutorial-blog", body);
        const frameMetadata = await fdk.getFrameMetadata({
          post_url: `${process.env.HOSTED_URL}/api/frame-analytics-tutorial?id=${nextId}`,
          aspect_ratio: "1.91:1",
          buttons: [
            {
              label: "Watch Video",
              action: "link",
              target: "https://youtu.be/vaynPsuLoQA",
            },
            { label: "Next", action: "post" },
          ],
          cid: `QmQEBDy135KEYJ6s56W8WTHKNN2gDsGpb8dMTn2JEqozpS/${id}.png`,
        });
        res.send(frameMetadata);
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }
    }
  }
}
