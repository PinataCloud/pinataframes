import {PinataFDK} from "pinata-fdk";
import satori from 'satori';
import {NextApiRequest, NextApiResponse} from "next";
import {html} from "satori-html";
import {Resvg} from "@resvg/resvg-js";
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';
import {generateHtmlImage, uploadToIpfs} from "@/utils/satori";
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
  1: "@grace",
  2: "@toadyhawk.eth",
  3: "@cameron",
  4: "@adrienne",
}

export const generateGlobalLeaderboardImage = async () => {
  const first_game = dayjs.utc('2024-06-24T16:00:00');
  const previousHour = dayjs.utc().subtract(1, 'hour').endOf('hour');

  const hoursDifference = previousHour.diff(first_game, 'hour');

  let gamesCount: string = '';

  for (let i = 0; i < hoursDifference+1; i++) {
    const utcStartHour = first_game.add(i, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const utcEndHour = first_game.add(i + 1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    console.log('utcStartHour, utcEndHour', utcStartHour, utcEndHour)

    const url1 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=custom_id&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=pinata_basketball_winners`;

    const res1 = await fetch(url1, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
    const json: CustomIDResponse [] = await res1.json();

    //get interactions for each player
    if (json.length > 0) {
      const countTeam1 = json.find((team: any) => team.custom_id === "team_1")?.interaction_count || 0;
      const countTeam2 = json.find((team: any) => team.custom_id === "team_2")?.interaction_count || 0;
      const countTeam3 = json.find((team: any) => team.custom_id === "team_3")?.interaction_count || 0;
      const countTeam4 = json.find((team: any) => team.custom_id === "team_4")?.interaction_count || 0;

      gamesCount += `
        <div style="display: flex">
            <p style="width: 100px; margin-top: 0;">${i+1}</p>
            <p style="color: #fe4f74; margin-top: 0; width: 80px">${countTeam1}</p>
            <p style="color: #fb9908; margin-top: 0; width: 140px">${countTeam2}</p>
            <p style="color: #8a79ff; margin-top: 0; width: 80px">${countTeam3}</p>
            <p style="color: #34d9aa; margin-top: 0; width: 100px">${countTeam4}</p>
        </div>
      `;
    }
  }

  const png = await generateHtmlImage(`
   <div style="padding: 20px; 
        position: relative; 
        display: flex;
        flex-direction: column;
        justify-content: flex-start;  
        width: 600px; 
        height: 315px;
        background-color: #000;
        background-size: 600px 315px;
        font-size: 20px;     
        color: #fff;
        gap: 0;
        margin: 0;
        ">
        <p style="margin: 0">Game stats</p>
        <div style="display: flex; flex-direction: column; margin: 0">
            <div style="display: flex; margin: 0">
              <p style="padding: 3px; width: 100px">Game #</p>
              <p style="color: #f892a8; padding: 3px; width: 80px" >${usersMap[1]}</p>
              <p style="color: #f8c376; padding: 3px; width: 140px" >${usersMap[2]}</p>
              <p style="color: #c7bffa; padding: 3px; width: 80px" >${usersMap[3]}</p>
              <p style="color: #87d7c0; padding: 3px; width: 100px" >${usersMap[4]}</p>
            </div>
            ${gamesCount}
        </div>
  </div>
  `, {asUri: false, width: 600, height: 315});

  const url = await uploadToIpfs(png);
  return url;
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

