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
  const first_game = dayjs.utc('2024-02-27T21:00:00');
  const previousHour = dayjs.utc().subtract(1, 'hour').endOf('hour');

  const hoursDifference = previousHour.diff(first_game, 'hour');

  const winnersArray: any [] = [];

  for (let i = 0; i < hoursDifference; i++) {
    const utcStartHour = first_game.add(i, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const utcEndHour = first_game.add(i + 1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    const url1 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=frame_id&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=pinata_basketball_winners&custom_id=team_1`;
    const url2 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=frame_id&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=pinata_basketball_winners&custom_id=team_2`;
    const url3 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=frame_id&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=pinata_basketball_winners&custom_id=team_3`;
    const url4 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=frame_id&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=pinata_basketball_winners&custom_id=team_4`;

    const res1 = await fetch(url1, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
    const json1: any = await res1.json();

    const res2 = await fetch(url2, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
    const json2: any = await res2.json();

    const res3 = await fetch(url3, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
    const json3: any = await res3.json();

    const res4 = await fetch(url4, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
    const json4: any = await res4.json();

    console.log('json 1',json1);
    console.log('json 2',json2);
    console.log('json 3',json3);
    console.log('json 4',json4);
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
    console.log('body. Shot endpoint', req.body);
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

