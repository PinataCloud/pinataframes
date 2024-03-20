import {PinataFDK} from "pinata-fdk";
import {NextApiRequest, NextApiResponse} from "next";
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';
const { v4: uuidv4 } = require('uuid');

dayjs.extend(utc);

const fdk = new PinataFDK({
    pinata_jwt: process.env.PINATA_JWT!,
    pinata_gateway: ''
  }
);

const FRAME_ID = "pinata_basketball";

export default async function handler (req: NextApiRequest, res: NextApiResponse,){
  if (req.method === "POST") {
    console.log('body', req.body);
    try {
      const isValidated = await fdk.validateFrameMessage(req.body);

      if (!isValidated) {
        return res.status(400).json({error: "Invalid frame message"});
      }

      await fdk.sendAnalytics(FRAME_ID, req.body);

      const currentUUID = req.body?.untrustedData?.state ? JSON.parse(req.body.untrustedData.state) : {};
      const currentSession = currentUUID.session || uuidv4();

      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/basketball/prepare`,
        buttons: [
          { label: "@woj", action: 'post' },
          { label: "@alvejtiago", action: 'post' },
          { label: "@df", action: 'post' },
          { label: "@adrienne", action: 'post' },
        ],
        image: {url: 'https://pamadd.mypinata.cloud/ipfs/QmSbHwsYLaGG4kHNjNmyXXu1xCjULRsMbsyAUyDK4ukbY4'}
      });

      //prepare time is the current utc time
      const state = {
        session: currentSession
      }

      const jsonState = JSON.stringify(state).replace(/"/g, '&quot;');

      const frameRes =
        `<!DOCTYPE html><html><head>
            <title>Pinata basketball</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="og:title" content="Pinata Basketball" />
            <meta property="fc:frame:state" content="${jsonState}" />
            <meta property="og:description" content="Pinata basketball" />
            ${frameMetadata}
            </head></html>`;

      return res.setHeader('content-type', 'text/html').send(frameRes);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}

