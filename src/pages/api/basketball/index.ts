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

interface AnalyticsResponse {
  button_index: number;
  interaction_count: number;
  unique_interactions: number;
}

const FRAME_ID = "pinata_basketball";

export const generateImage = async (counter: number) => {
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  const template: any = html(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: center;  width: 1200px; height: 630px;">
    <p>Counter ${counter}</p>
  </div>
  `);
  const svg = await satori(template, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Roboto Mono",
        data: await monoFontReg.arrayBuffer(),
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
      const currentCounter = currentUUID.counter || 0;
      const currentSession = currentUUID.session || uuidv4();

      console.log('currentUUID', currentUUID);
      console.log('typeof currentUUID', typeof currentUUID);

      const imgContent = await generateImage(currentCounter);
      const dataURI = 'data:image/png;base64,' + imgContent.toString('base64');

      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/basketball`,
        buttons: [
          { label: 'Increase Value', action: 'post' },
        ],
        image: {url: dataURI, ipfs: false}
      });

      //generate UUID for idempotency_key
      const state = {
        counter: currentCounter + 1,
        session: currentSession
      }

      const frameRes =
        `<!DOCTYPE html><html><head>
            <title>Pinata basketball</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="og:title" content="Users Chart" />
            <meta property="fc:frame:state" content="${JSON.stringify(state)}" />
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

