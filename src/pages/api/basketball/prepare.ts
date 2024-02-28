import {PinataFDK} from "pinata-fdk";
import satori from 'satori';
import {NextApiRequest, NextApiResponse} from "next";
import {html} from "satori-html";
import {Resvg} from "@resvg/resvg-js";
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

export const generateImage = async (team: number, counter: number) => {
  const pixelFont = await fetch(`${process.env.HOSTED_URL}/tickerbit-regular.ttf`)

  const template: any = html(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: flex-start;  width: 1200px; height: 630px; background-image: url('https://pamadd.mypinata.cloud/ipfs/QmPC86ENNELHJR5yr9QT1vnCT72qVuByTbC28gmomac13W'); background-size: 1200px 630px; color: #fff;">
    <p style="font-size: 60px">Your Team ${team}</p>
    <p style="font-size: 40px">Once you're ready calculate 3 seconds to shoot. The closer to 3 seconds the more chances to score</p>
  </div>
  `);
  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Tickerbit",
        data: await pixelFont.arrayBuffer(),
        weight: 400,
        style: "normal",
      }
    ]
  });

// render png
  const resvg = new Resvg(svg, {
    background: "rgba(238, 235, 230, .9)",
  });
  const pngData = resvg.render();
  const png = pngData.asPng();

  return png;
}



export default async function handler (req: NextApiRequest, res: NextApiResponse,){
  if (req.method === "POST") {
    console.log('body', req.body);
    try {
      const isValidated = await fdk.validateFrameMessage(req.body);

      if (!isValidated) {
        return res.status(400).json({error: "Invalid frame message"});
      }

      // await fdk.sendAnalytics(FRAME_ID, req.body);

      const currentUUID = req.body?.untrustedData?.state ? JSON.parse(req.body.untrustedData.state) : {};
      const currentTeam = currentUUID.team || req.body?.untrustedData?.buttonIndex || 1;
      const currentSession = currentUUID.session || uuidv4();

      console.log('currentUUID', currentUUID);
      console.log('typeof currentUUID', typeof currentUUID);

      const imgContent = await generateImage(currentTeam, 0);
      const dataURI = 'data:image/png;base64,' + imgContent.toString('base64');

      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/basketball/shoot`,
        buttons: [
          { label: "I'm Ready", action: 'post' },
        ],
        image: {url: dataURI}
      });

      //prepare time is the current utc time
      const state = {
        session: currentSession,
        team: currentTeam,
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

