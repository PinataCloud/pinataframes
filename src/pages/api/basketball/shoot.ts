import {PinataFDK} from "pinata-fdk";
import satori from 'satori';
import {NextApiRequest, NextApiResponse} from "next";
import {html} from "satori-html";
import {Resvg} from "@resvg/resvg-js";
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';
import {generateHtmlImage} from "@/utils/satori";
const { v4: uuidv4 } = require('uuid');

dayjs.extend(utc);

const fdk = new PinataFDK({
    pinata_jwt: process.env.PINATA_JWT!,
    pinata_gateway: ''
  }
);

const FRAME_ID = "pinata_basketball";

export const generateImage = async () => {
  return generateHtmlImage(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: center;  width: 600px; height: 315px;">
    <img src="https://pamadd.mypinata.cloud/ipfs/QmfWNvfRhL1JUsHLZ9SZuC5Bp9U8LT1wiXierXLWz8DGFZ" style="width: 600px; height: 315px;"/>
  </div>`, {asUri: false, width: 600, height: 315});
}


export default async function handler (req: NextApiRequest, res: NextApiResponse,){
  if (req.method === "POST") {
    console.log('body. Shot endpoint', req.body);
    try {
      const prepareTime = dayjs().utc();
      const isValidated = await fdk.validateFrameMessage(req.body);

      if (!isValidated) {
        return res.status(400).json({error: "Invalid frame message"});
      }

      await fdk.sendAnalytics(FRAME_ID, req.body);

      const currentUUID = req.body?.untrustedData?.state ? JSON.parse(req.body.untrustedData.state) : {};
      const currentTeam = currentUUID.team;
      const currentSession = currentUUID.session || uuidv4();

      // const imgContent: any = await generateImage();

      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/basketball/result`,
        buttons: [
          { label: "Shoot", action: 'post', target: `${process.env.HOSTED_URL}/api/basketball/result` },
        ],
        image: {url: `${process.env.HOSTED_URL}/images/shoot.gif`}
      });

      //generate UUID for idempotency_key
      const state = {
        session: currentSession,
        team: currentTeam,
        prepareTime: prepareTime
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

