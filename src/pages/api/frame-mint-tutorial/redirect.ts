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
  const buttonId = req.body.untrustedData.buttonIndex;
  if (buttonId === 1) {
    try {
      const headers = new Headers();
      headers.set("Location", `${process.env.HOSTED_URL}/`);
      const response = res.redirect(`${process.env.HOSTED_URL}/blog/frame-mint-tutorial`);
      return response;
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else {
    try {
      const headers = new Headers();
      headers.set("Location", `${process.env.HOSTED_URL}/`);
      const response = res.redirect(`${process.env.HOSTED_URL}/video/frame-mint-tutorial`);
      return response;
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
