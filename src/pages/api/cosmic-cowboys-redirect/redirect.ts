// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { generateImage } from "@/utils/satori";
import { getLastFourMessages } from "@/utils/storage";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  maxDuration: 300,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
        res.redirect("cosmicowboys.cloud");
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
        res.redirect("cosmicowboys.cloud");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
