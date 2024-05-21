import { getUserByFid } from "@/utils/fc";
import { addToGatewayPluginInterestList } from "@/utils/storage";
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
        post_url: `${process.env.HOSTED_URL}/api/gateway-plugins?id=1`,
        aspect_ratio: "1.91:1",
        buttons: [{ label: "Read On 👉", action: "post" }, { label: "Interested?", action: "post" }],
        cid: "QmfR42WZxgZoz1mfga7xJGqd3EDXK1ashfig12nzQzjo5a",
      });
      res.send(frameMetadata);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    const body = req.body;
    let { id }: any = req.query;
    if (!id) {
      id = "4"
    }

    const idAsNumber = parseInt(id);

    let idToUseInQuery = idAsNumber + 1;

    let joinText = "Interested?"

    if (body.untrustedData.buttonIndex === 2) {
      //  Add to list
      const user = await getUserByFid(body?.untrustedData?.fid)
      if (user) {
        await addToGatewayPluginInterestList(user.fid, user.username)
        joinText = "You're on the list!"
      }    
    }

    const cidMap = ["QmRWQVGXLTEyhrpeGLz7erMRVXbejgaTmGdNpKMzeUcimS", "QmSv13jHnSZjoQQytLjNSb5M9tGQZ4b6ZaLGznkGU71qbh", "QmcZ7vRi7W9yUWBM2EDrsybCaaQjuDKPfuHggG6CMmMgXT"]
    try {
      const buttonToShow: any = idAsNumber === 3 ? {
        label: "Read online",
        action: "link",
        target: "https://www.pinata.cloud/blog/introducing-pinata-gateway-plugins"
      } : {
        label: "Continue",
        action: "post"
      }
      await fdk.sendAnalytics("gateway-plugins-blog", body);
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/gateway-plugins?id=${idToUseInQuery}`,
        aspect_ratio: "1.91:1",
        buttons: [
          buttonToShow,
          { label: joinText, action: "post" },
        ],
        cid: cidMap[idAsNumber - 1],
      });
      res.send(frameMetadata);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
