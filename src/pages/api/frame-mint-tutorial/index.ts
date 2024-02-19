import type { NextApiRequest, NextApiResponse } from "next";
import PinataFDK from "pinata-fdk";

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
        post_url: `${process.env.HOSTED_URL}/api/frame-mint-tutorial?id=0`,
        aspectRatio: "1.91:1",
        buttons: [{ label: "Read On 👉", action: "post" }],
        cid: "QmUcHr9v299Vszyhy3WQNE28EvP9vvzsrwFpae6RS4jTEG/0.png",
      });
      res.send(frameMetadata);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    const { id }: any = req.query;
    const idAsNumber = parseInt(id);
    const nextId = idAsNumber + 1;
    if (idAsNumber === 4) {
      try {
        const frameMetadata = await fdk.getFrameMetadata({
          post_url: `${process.env.HOSTED_URL}/api/frame-mint-tutorial/redirect`,
          aspectRatio: "1.91:1",
          buttons: [{ label: "Read Full Post", action: "post_redirect" }, { label: "Watch Video", action: "post_redirect"}],
          cid: `QmUcHr9v299Vszyhy3WQNE28EvP9vvzsrwFpae6RS4jTEG/${id}.png`,
        });
        res.send(frameMetadata);
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }
    } else {
      try {
        const frameMetadata = await fdk.getFrameMetadata({
          post_url: `${process.env.HOSTED_URL}/api/frame-mint-tutorial?id=${nextId}`,
          aspectRatio: "1.91:1",
          buttons: [{ label: "next", action: "post" }],
          cid: `QmUcHr9v299Vszyhy3WQNE28EvP9vvzsrwFpae6RS4jTEG/${id}.png`,
        });
        res.send(frameMetadata);
      } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
      }
    }
  }
}
