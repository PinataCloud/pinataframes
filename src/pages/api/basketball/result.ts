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

export const generateImage = async (difference: number) => {
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  let success = false;
  //if the difference is 3000 there's a 100% chance of success. If it's 2500 or 3500 there's a 0% chance. All values in between increase chances being 3000 the highes chance
  if (difference === 3000) {
    success = true;
  } else {
    const chance = Math.abs(3000 - difference) / 1000;
    const random = Math.random();
    success = random <= chance;
  }

  const template: any = html(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: center;  width: 1200px; height: 630px;">
    <p style="font-size: 20px">The difference in time is ${difference}</p>
    <p style="font-size: 20px">Chances of scoring are ${Math.abs(3000 - difference) / 1000}</p>
    <p style="font-size: 20px">Scored? ${success}</p>
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
    console.log('body. Shot endpoint', req.body);
    try {
      const isValidated = await fdk.validateFrameMessage(req.body);

      if (!isValidated) {
        return res.status(400).json({error: "Invalid frame message"});
      }

      await fdk.sendAnalytics(FRAME_ID, req.body);

      const currentUUID = req.body?.untrustedData?.state ? JSON.parse(req.body.untrustedData.state) : {};
      const currentTeam = currentUUID.team || req.body?.untrustedData?.buttonIndex || 1;
      const currentSession = currentUUID.session || uuidv4();
      const prepareTime = currentUUID.prepareTime;

      const secondsDifference = dayjs().diff(prepareTime);
      console.log('secondsDifference', secondsDifference);

      console.log('currentUUID', currentUUID);
      console.log('typeof currentUUID', typeof currentUUID);

      const imgContent = await generateImage(secondsDifference);
      const dataURI = 'data:image/png;base64,' + imgContent.toString('base64');

      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/basketball/prepare`,
        buttons: [
          { label: "Try again", action: 'post' },
        ],
        image: {url: dataURI, ipfs: false}
      });

      //generate UUID for idempotency_key
      const state = {
        session: currentSession,
        team: currentTeam
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
