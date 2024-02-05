import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    console.log(req.query)
    const { id }: any = req.query;
    const idAsNumber = parseInt(id);
    const nextId = idAsNumber + 1;
    console.log(nextId)
    try {
      console.log(req.body);
      //  Verify the signature from the payload
      //  Template should have a post_url that matches the index of the plane selected
      const template1 = `<!DOCTYPE html><html><head>
          <title>This is frame ${id}</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://dweb.mypinata.clou/ipfs/Qme4FXhoxHHfyzTfRxSpASbMF8kajLEPkRQWhwWu9pkUjm/${id}.png" />
          <meta property="fc:frame:button:1" content="Next Page" />
          <meta property="fc:frame:post_url" content="${process.env.HOSTED_URL}/api/pocketcastblog/${nextId}" />
        </head></html>`;
      return res.send(template1);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
