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

export const generateGlobalLeaderboardImage = async () => {
  const first_game = dayjs.utc('2024-02-28T12:00:00');
  const previousHour = dayjs.utc().subtract(1, 'hour').endOf('hour');

  const hoursDifference = previousHour.diff(first_game, 'hour');

  const winnersArray: any [] = [];

  for (let i = 0; i < hoursDifference; i++) {
    const utcStartHour = first_game.add(i, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const utcEndHour = first_game.add(i + 1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    const url1 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=custom_id&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=pinata_basketball_winners`;

    const res1 = await fetch(url1, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
    const json1: any = await res1.json();

    console.log('json global leaderboard, hour',json1, i);
  }

  return generateHtmlImage(`
  <div style="padding: 20px; position: relative; display: flex; flex-direction: column; justify-content: center;  width: 1200px; height: 630px;">
    <p style="font-size: 60px">Global Leaderboard</p>
    <p>${winnersArray}</p>
  </div>
  `, {asUri: true});
}


export default async function handler (req: NextApiRequest, res: NextApiResponse,){
  if (req.method === "POST") {
    console.log('body. global leaderboard endpoint', req.body);
    try {
      const isValidated = await fdk.validateFrameMessage(req.body);

      if (!isValidated) {
        return res.status(400).json({error: "Invalid frame message"});
      }

      await fdk.sendAnalytics(FRAME_ID, req.body);

      const currentUUID = req.body?.untrustedData?.state ? JSON.parse(req.body.untrustedData.state) : {};
      const currentTeam = currentUUID.team;
      const currentSession = currentUUID.session || uuidv4();

      const imgContent: any = await generateGlobalLeaderboardImage();

      const state = {
        session: currentSession,
        team: currentTeam,
      }

      const jsonState = JSON.stringify(state).replace(/"/g, '&quot;');

      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/basketball/prepare`,
        buttons: [
          { label: "Try again", action: 'post' },
          { label: "Change team", action: 'post', target: `${process.env.HOSTED_URL}/api/basketball` },
        ],
        image: {url: imgContent}
      });

      const frameRes = `<!DOCTYPE html><html><head>
        <title>Pinata basketball leaderboard</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="og:title" content="Pinata Basketball" />
        <meta property="fc:frame:state" content="${jsonState}" />
        <meta property="og:description" content="Pinata basketball" />
          ${frameMetadata}
          </head></html>`

      return res.setHeader('content-type', 'text/html').send(frameRes);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}

