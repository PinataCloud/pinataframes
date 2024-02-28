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

export const generateCurrentLeaderboardImage = async () => {
  const today = dayjs.utc().endOf('day');
  const now = dayjs.utc().subtract(1, 'hour').endOf('hour');
  const startDate = dayjs(now).format('YYYY-MM-DD HH:mm:ss');
  const endDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss');

  const url1 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=custom_id&start_date=${startDate}&end_date=${endDate}&frame_id=pinata_basketball_winners`;
  // const url2 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=frame_id&start_date=${startDate}&end_date=${endDate}&frame_id=pinata_basketball_winners&custom_id=team_2`;
  // const url3 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=frame_id&start_date=${startDate}&end_date=${endDate}&frame_id=pinata_basketball_winners&custom_id=team_3`;
  // const url4 = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=frame_id&start_date=${startDate}&end_date=${endDate}&frame_id=pinata_basketball_winners&custom_id=team_4`;

  const res1 = await fetch(url1, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
  const json1: any = await res1.json();

  // const res2 = await fetch(url2, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
  // const json2: any = await res2.json();
  //
  // const res3 = await fetch(url3, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
  // const json3: any = await res3.json();
  //
  // const res4 = await fetch(url4, {headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`,}})
  // const json4: any = await res4.json();

  console.log('json1', json1);

  const winningTeams = json1.map((team: any) => {
    return {
      team: team.custom_id,
      score: team.interaction_count
    }
  });

  const team1Score = winningTeams.find((team: any) => team.team === "team_1")?.score || 0;
  const team2Score = winningTeams.find((team: any) => team.team === "team_2")?.score || 0;
  const team3Score = winningTeams.find((team: any) => team.team === "team_3")?.score || 0;
  const team4Score = winningTeams.find((team: any) => team.team === "team_4")?.score || 0;

  return generateHtmlImage(`
  <div style="padding: 20px; position: relative; display: flex; flex-direction: column; justify-content: center;  width: 1200px; height: 630px;">
    <p style="font-size: 60px">Current Match Leaderboard</p>
    <p>Team 1 score: ${team1Score}</p>
    <p>Team 2 score: ${team2Score}</p>
    <p>Team 3 score: ${team3Score}</p>
    <p>Team 4 score: ${team4Score}</p>
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

      const imgContent: any = await generateCurrentLeaderboardImage();

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
          { label: "Global Leaderboard", action: 'post', target: `${process.env.HOSTED_URL}/api/basketball/global-leaderboard` },
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

