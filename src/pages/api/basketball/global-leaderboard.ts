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

interface CustomIDResponse  {
  custom_id: string | null;
  interaction_count: number;
  unique_interactions: number;
}

const usersMap: any = {
  1: "@woj",
  2: "@alvejtiago",
  3: "@df",
  4: "@adrienne",
}

export const generateGlobalLeaderboardImage = async () => {
  const first_game = dayjs.utc('2024-02-28T12:00:00');
  const previousHour = dayjs.utc().subtract(1, 'hour').endOf('hour');

  const hoursDifference = previousHour.diff(first_game, 'hour');

  const winnersCount: any = {
    team_1: 0,
    team_2: 0,
    team_3: 0,
    team_4: 0,
  };

  for (let i = 0; i < hoursDifference+1; i++) {
    const utcStartHour = first_game.add(i, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const utcEndHour = first_game.add(i + 1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    console.log('utcStartHour, utcEndHour', utcStartHour, utcEndHour)

    const url1 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=custom_id&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=pinata_basketball_winners`;

    const res1 = await fetch(url1, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
    const json: CustomIDResponse [] = await res1.json();

    //get the winner for this response by interaction_count
    if (json.length > 0) {
      const winner = json.reduce((prev, current) => (prev.interaction_count > current.interaction_count) ? prev : current);
      if (winner.custom_id) {
        winnersCount[winner.custom_id] += 1;
      }
    }
  }

  return generateHtmlImage(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: flex-start;  width: 600px; height: 315px; background-image: url('https://pamadd.mypinata.cloud/ipfs/QmZciRgXkx7VSyTrRh2kFPP6TYQDM8BGKL9p2PAHkeL597'); background-size: 600px 315px; color: #fff;">
    <p style="color: #fe4f74">Team ${usersMap[1]}: ${winnersCount.team_1}</p>
    <p style="color: #fb9908">Team ${usersMap[2]}: ${winnersCount.team_2}</p>
    <p style="color: #8a79ff">Team ${usersMap[3]}: ${winnersCount.team_3}</p>
    <p style="color: #34d9aa">Team ${usersMap[4]}: ${winnersCount.team_4}</p>
  </div>
  `, {asUri: true, width: 600, height: 315});
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
          { label: "Leaderboard", action: 'post', target: `${process.env.HOSTED_URL}/api/basketball/leaderboard` },
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

