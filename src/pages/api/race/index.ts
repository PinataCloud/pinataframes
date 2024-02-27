import {PinataFDK} from "pinata-fdk";
import satori from 'satori';
import {NextApiRequest, NextApiResponse} from "next";
import {html} from "satori-html";
import {Resvg} from "@resvg/resvg-js";
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';
import { kv } from '@vercel/kv';

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

const FRAME_ID = "pinata_race";


const getCarPixels = (buttonCount: number, carId: number, highestNumber: number, maxPixels: number) => {
  const aggregatedCount = buttonCount * highestNumber;
  if (aggregatedCount === 0) {
    return 0;
  }
  return (buttonCount * maxPixels) / highestNumber;

}

interface LatestRace {
  winsPerCar: {
    car1: number;
    car2: number;
    car3: number;
    car4: number;
  };
  hoursDifference: number;
}

export const generateImage = async (data: AnalyticsResponse [], latestRaceData: LatestRace) => {
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  const buttonCount1 = data.find((item: any) => item.button_index === 1);
  const buttonCount2 = data.find((item: any) => item.button_index === 2);
  const buttonCount3 = data.find((item: any) => item.button_index === 3);
  const buttonCount4 = data.find((item: any) => item.button_index === 4);


  if (!buttonCount1) { data.push({button_index: 1, interaction_count: 0, unique_interactions: 0})}
  if (!buttonCount2) { data.push({button_index: 2, interaction_count: 0, unique_interactions: 0})}
  if (!buttonCount3) { data.push({button_index: 3, interaction_count: 0, unique_interactions: 0})}
  if (!buttonCount4) { data.push({button_index: 4, interaction_count: 0, unique_interactions: 0})}

  const maxPixels = 1000;
  const highestInteraction = data.reduce((prev, current) => (prev.interaction_count > current.interaction_count) ? prev : current);
  const lowestInteraction = data.reduce((prev, current) => (prev.interaction_count < current.interaction_count) ? prev : current);

  let car1Pixels = 0;
  let car2Pixels = 0;
  let car3Pixels = 0;
  let car4Pixels = 0;

  const ROUND_LIMIT_FACTOR = 100;

  let roundLimit
  if (lowestInteraction.interaction_count === 0) {
    roundLimit = 0;
  } else {
    roundLimit = Math.floor(lowestInteraction.interaction_count / ROUND_LIMIT_FACTOR) * ROUND_LIMIT_FACTOR;
  }

  car1Pixels = getCarPixels((buttonCount1?.interaction_count || 0) - roundLimit, 1, highestInteraction.interaction_count - roundLimit, maxPixels);
  car2Pixels = getCarPixels((buttonCount2?.interaction_count || 0) - roundLimit, 2, highestInteraction.interaction_count - roundLimit, maxPixels);
  car3Pixels = getCarPixels((buttonCount3?.interaction_count || 0) - roundLimit, 3, highestInteraction.interaction_count - roundLimit, maxPixels);
  car4Pixels = getCarPixels((buttonCount4?.interaction_count || 0) - roundLimit, 4, highestInteraction.interaction_count - roundLimit, maxPixels);


  // convert html to svg

  const template: any = html(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: flex-start;  width: 1200px; height: 630px; background-image: url('https://pamadd.mypinata.cloud/ipfs/QmaPJLmYUZpVgQ6KZyDQYkEghqv3JJMqRbvm9EK6zKz2uX'); background-size: 1200px 630px; color: #fff;">
    <p style="position: absolute; top: -20px; left: 520px; color: black; font-size: 40px; background-color: white">Race # ${latestRaceData.hoursDifference + 1}</p>
    <div style="display: flex; padding: 12px;">
      <p style="position: absolute; top: 35px; color: black; font-size: 25px">Distance: ${buttonCount1?.interaction_count}</p>
      <img style="width: 150px; left: 20px; margin-left: ${car1Pixels}px; position: absolute; top: 35px" src="https://pamadd.mypinata.cloud/ipfs/QmP7LyUCLdXrsds5HeUMqs4ur9mSoCSFdU1GkzXg83hA82" />
      <div style="position: absolute; top: 80px; left: -10px; display: flex; align-items: center ">     
        <p style="color: black; font-size: 35px; background-color: #fff8ec; padding: 5px; border-radius: 50%; border: 3px solid black">${latestRaceData.winsPerCar.car1}</p>
        <img style="width: 40px;" src="https://pamadd.mypinata.cloud/ipfs/QmeDs9TPT8KLgnvvjqekHRJMqVZKt66W1hgQpVRSNUpGoQ" />
      </div>
      <p style="position: absolute; top: 170px; color: black; font-size: 25px">Distance: ${buttonCount2?.interaction_count}</p>
      <img style="width: 150px; left: 20px; margin-left: ${car2Pixels}px; position: absolute; top: 170px" src="https://pamadd.mypinata.cloud/ipfs/QmaG9HgtyLKpLGypDHFLyofgZQznrAbr4sVyJ76yxDPVTh" />
      <div style="position: absolute; top: 215px; left: -10px; display: flex; align-items: center ">     
        <p style="color: black; font-size: 35px; background-color: #fff8ec; padding: 5px; border-radius: 50%; border: 3px solid black">${latestRaceData.winsPerCar.car2}</p>
        <img style="width: 40px;" src="https://pamadd.mypinata.cloud/ipfs/QmeDs9TPT8KLgnvvjqekHRJMqVZKt66W1hgQpVRSNUpGoQ" />
      </div>
      <p style="position: absolute; top: 310px; color: black; font-size: 25px">Distance: ${buttonCount3?.interaction_count}</p>
      <img style="width: 150px; left: 20px; margin-left: ${car3Pixels}px; position: absolute; top: 310px" src="https://pamadd.mypinata.cloud/ipfs/QmdxLRPdkTXMSnXXEbZuCNEe42PaU5oVH81GqZbW4L5NDQ" />
      <div style="position: absolute; top: 350px; left: -10px; display: flex; align-items: center ">     
        <p style="color: black; font-size: 35px; background-color: #fff8ec; padding: 5px; border-radius: 50%; border: 3px solid black">${latestRaceData.winsPerCar.car3}</p>
        <img style="width: 40px;" src="https://pamadd.mypinata.cloud/ipfs/QmeDs9TPT8KLgnvvjqekHRJMqVZKt66W1hgQpVRSNUpGoQ" />
      </div>
      <p style="position: absolute; top: 445px; color: black; font-size: 25px">Distance: ${buttonCount4?.interaction_count}</p>
      <img style="width: 150px; left: 20px; margin-left: ${car4Pixels}px; position: absolute; top: 445px" src="https://pamadd.mypinata.cloud/ipfs/QmdSoCvYzgYvY8GVE71VcF6p1oCyBzZCTARr7LE3Xkb7ws" />
      <div style="position: absolute; top: 490px; left: -10px; display: flex; align-items: center ">     
        <p style="color: black; font-size: 35px; background-color: #fff8ec; padding: 5px; border-radius: 50%; border: 3px solid black">${latestRaceData.winsPerCar.car4}</p>
        <img style="width: 40px;" src="https://pamadd.mypinata.cloud/ipfs/QmeDs9TPT8KLgnvvjqekHRJMqVZKt66W1hgQpVRSNUpGoQ" />
      </div>
    </div>
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

const getImage = async (frame_id: string) => {
  try {
    const today = dayjs.utc().endOf('day');
    const now = dayjs.utc().subtract(1, 'hour').endOf('hour');
    const startDate = dayjs(now).format('YYYY-MM-DD HH:mm:ss');
    const endDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss');

    const url = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=button_index&start_date=${startDate}&end_date=${endDate}&frame_id=${frame_id}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      }
    })
    const json: AnalyticsResponse [] = await res.json();
    const latestRaceData: any = await kv.get('latestRace');
     // const latestRaceData = {
     //  winsPerCar: {
     //    car1: 20,
     //    car2: 3,
     //    car3: 1,
     //    car4: 103,
     //  },
     //   hoursDifference: 10,
     // }
    const image = await generateImage(json, latestRaceData);
    return image;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default async function handler (req: NextApiRequest, res: NextApiResponse,){
  if (req.method === "POST") {
    try {
      const isValidated = await fdk.validateFrameMessage(req.body);
      if (!isValidated) {
        return res.status(400).json({error: "Invalid frame message"});
      }
      await fdk.sendAnalytics(FRAME_ID, req.body);
      const imgContent = await getImage(FRAME_ID);
      const dataURI = 'data:image/png;base64,' + imgContent.toString('base64');
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/race`,
        buttons: [
          { label: 'Car 1', action: 'post' },
          { label: 'Car 2', action: 'post' },
          { label: 'Car 3', action: 'post' },
          { label: 'Car 4', action: 'post' },
        ],
        image: {url: dataURI}
      });
      const frameRes =
        `<!DOCTYPE html><html><head>
            <title>FC Users by time</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="og:title" content="Users Chart" />
            <meta property="og:description" content="FC users by time" />
            ${frameMetadata}
            </head></html>`;

      return res.setHeader('content-type', 'text/html').send(frameRes);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}

