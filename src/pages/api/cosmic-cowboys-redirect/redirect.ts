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
        const redirectUrl = 'https://www.cosmiccowboys.cloud/';
        // Set the Location header for redirection
        res.setHeader('Location', redirectUrl);
        // Set the status code for redirection (302 is the default for temporary redirection)
        res.status(302);
        // End the response to trigger the redirection
        res.end();
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
        const redirectUrl = 'https://www.cosmiccowboys.cloud/';
        // Set the Location header for redirection
        res.setHeader('Location', redirectUrl);
        // Set the status code for redirection (302 is the default for temporary redirection)
        res.status(302);
        // End the response to trigger the redirection
        res.end();
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
