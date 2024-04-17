// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateBalanceImage } from "@/utils/balanceHelper";
import { generateAnalyticsImage, generateImage } from "@/utils/satori";
import { getLastFourMessages } from "@/utils/storage";
import { FrameMetadata } from "@coinbase/onchainkit";
import type { NextApiRequest, NextApiResponse } from "next";
import { FrameHTMLType, PinataFDK } from "pinata-fdk";

const FRAME_ID = "frame-analytics"

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT!,
  pinata_gateway: process.env.GATEWAY_URL?.split("https://")[1]!
},
  //do not include https:// in your gateway url
);

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { balance } = JSON.parse(req.body);
      console.log(balance)
      const cid = await generateBalanceImage(balance)
      res.send(cid);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
