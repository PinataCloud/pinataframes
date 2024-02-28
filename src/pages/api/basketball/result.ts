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

const FRAME_ID = "pinata_basketball_winners";

export const generateImage = async (difference: number, body: any, team: number) => {
  let success;
  let chance = 0;
  if (difference >= 2200 && difference <= 3800) {
    if (difference === 3000) {
      success = true;
    } else {
      chance = 1 - Math.abs(3000 - difference) / 800; // Normalize the difference to a 0-1 scale
      const random = Math.random();
      success = random < chance;
    }
  } else {
    success = false;
  }

  if (success) {
    await fdk.sendAnalytics(FRAME_ID, body, `team_${team}`);
  }

  console.log('shot success, difference', success, difference);

  const png = success ? await generateHtmlImage(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: flex-start;  width: 600px; height: 315px; background-image: url('https://pamadd.mypinata.cloud/ipfs/QmTnLHKtCxurnXQk59w8UPYb6nmcKktfVdGMQFWy5E5Ghb'); background-size: 600px 315px; color: #fff;">
   <p style="font-size: 21px; color: darkseagreen; position: absolute; top: 222px; left: 191px ">${(difference/1000).toFixed(2)}</p>
    <p style="font-size: 21px; color: darkseagreen; position: absolute; top: 222px; left: 520px ">${(chance*100).toFixed(2)}%</p>
  </div>
  `, {asUri: false, width: 600, height: 315}) : await generateHtmlImage(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: flex-start;  width: 600px; height: 315px; background-image: url('https://pamadd.mypinata.cloud/ipfs/Qmf8maJYPVBYyi7XC8hQ62Gf3fE8aSM3f5e88buBtX1DWg'); background-size: 600px 315px; color: #fff;">
    <p style="font-size: 21px; color: orange; position: absolute; top: 222px; left: 191px ">${(difference/1000).toFixed(2)}</p>
    <p style="font-size: 21px; color: orange; position: absolute; top: 222px; left: 520px ">${(chance*100).toFixed(2)}%</p>
  </div>
  `, {asUri: false, width: 600, height: 315})

  const url = await uploadToIpfs(png);
  console.log('url', url);
  return url;
}



export default async function handler (req: NextApiRequest, res: NextApiResponse,){
  if (req.method === "POST") {
    console.log('body. Result endpoint', req.body);
    try {
      const isValidated = await fdk.validateFrameMessage(req.body);

      if (!isValidated) {
        return res.status(400).json({error: "Invalid frame message"});
      }

      const currentUUID = req.body?.untrustedData?.state ? JSON.parse(req.body.untrustedData.state) : {};
      const currentTeam = currentUUID.team;
      const currentSession = currentUUID.session || uuidv4();
      const prepareTime = currentUUID.prepareTime;

      const secondsDifference = dayjs().diff(prepareTime);
      console.log('secondsDifference', secondsDifference);

      console.log('currentUUID', currentUUID);
      console.log('typeof currentUUID', typeof currentUUID);

      const dataUri: any = await generateImage(secondsDifference, req.body, currentTeam);

      const frameMetadata = fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/basketball/prepare`,
        buttons: [
          { label: "Try again", action: 'post', target: `${process.env.HOSTED_URL}/api/basketball/prepare` },
          { label: "Leaderboard", action: 'post', target: `${process.env.HOSTED_URL}/api/basketball/leaderboard` },
        ],
        image: {url: dataUri}
      });

      // console.log('frameMetadata', frameMetadata);

      //generate UUID for idempotency_key
      const state = {
        session: currentSession,
        team: currentTeam
      }

      const jsonState = JSON.stringify(state).replace(/"/g, '&quot;');

      console.log('jsonState,', jsonState);

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

