// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { satoriHelper } from "@/utils/satori";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const requestData = req.body
  const image = await satoriHelper(requestData);
  const file = new File([image], "image.png")
  const formData = new FormData()
  formData.append('file', file)

  const metadata = JSON.stringify({
      name: `image.png`
    })
    formData.append('pinataMetadata', metadata)
    const imageUpload = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });
    const { IpfsHash } = await imageUpload.json();

    const url = `${process.env.GATEWAY_URL}/ipfs/${IpfsHash}?filename=image.png`

  res.send(url);
}
