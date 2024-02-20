import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import {PinataFDK} from "pinata-fdk";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT!,
  pinata_gateway: process.env.GATEWAY_URL!.split("https://")[1],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const body = req.body;
    const buttonId = body.untrustedData.buttonIndex;
    const { isValid } = await fdk.validateFrameMessage(body);
    if (buttonId === 1) {
      try {
        return NextResponse.redirect(
          "https://www.pinata.cloud/blog/how-to-build-a-farcaster-frame-that-mints-nfts",
          { status: 302 },
        );
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error });
      }
    } else {
      try {
        return NextResponse.redirect("https://youtu.be/5VVOMolm-TA", {
          status: 302,
        });
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error });
      }
    }
  }
}
