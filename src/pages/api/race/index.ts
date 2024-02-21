import {PinataFDK} from "pinata-fdk";
import satori from 'satori';
import {NextApiRequest, NextApiResponse} from "next";
import {html} from "satori-html";
import {Resvg} from "@resvg/resvg-js";
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';

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

const getPercentagePixels = (value: number, total: number, pixels: number) => {
  return (value * pixels) / total;
}

const getCarPixels = (buttonCount: number, carId: number, highestNumber: number, maxPixels: number) => {
  return getPercentagePixels(buttonCount || 0, highestNumber, maxPixels);
}

export const generateImage = async (data: AnalyticsResponse []) => {
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  console.log('data', data);

  const maxPixels = 1000;
  const highestInteraction = data.reduce((prev, current) => (prev.interaction_count > current.interaction_count) ? prev : current);
  const lowestInteraction = data.reduce((prev, current) => (prev.interaction_count < current.interaction_count) ? prev : current);

  const buttonCount1 = data.find((item: any) => item.button_index === 1);
  const buttonCount2 = data.find((item: any) => item.button_index === 2);
  const buttonCount3 = data.find((item: any) => item.button_index === 3);
  const buttonCount4 = data.find((item: any) => item.button_index === 4);

  let car1Pixels = 0;
  let car2Pixels = 0;
  let car3Pixels = 0;
  let car4Pixels = 0;

  const ROUND_LIMIT_FACTOR = 100;

  const roundLimit = Math.floor(lowestInteraction.interaction_count / ROUND_LIMIT_FACTOR) * ROUND_LIMIT_FACTOR;
  // if (lowestInteraction.interaction_count < roundLimit) {
  //   car1Pixels = getCarPixels(buttonCount1?.interaction_count || 0, 1, highestInteraction.interaction_count, maxPixels);
  //   car2Pixels = getCarPixels(buttonCount2?.interaction_count || 0, 2, highestInteraction.interaction_count, maxPixels);
  //   car3Pixels = getCarPixels(buttonCount3?.interaction_count || 0, 3, highestInteraction.interaction_count, maxPixels);
  //   car4Pixels = getCarPixels(buttonCount4?.interaction_count || 0, 4, highestInteraction.interaction_count, maxPixels);
  // } else {
    car1Pixels = getCarPixels(buttonCount1!.interaction_count - roundLimit, 1, highestInteraction.interaction_count - roundLimit, maxPixels);
    car2Pixels = getCarPixels(buttonCount2!.interaction_count - roundLimit, 2, highestInteraction.interaction_count - roundLimit, maxPixels);
    car3Pixels = getCarPixels(buttonCount3!.interaction_count - roundLimit, 3, highestInteraction.interaction_count - roundLimit, maxPixels);
    car4Pixels = getCarPixels(buttonCount4!.interaction_count - roundLimit, 4, highestInteraction.interaction_count - roundLimit, maxPixels);
  // }

  const template: any = html(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: flex-start;  width: 1200px; height: 630px; background-image: url('https://pamadd.mypinata.cloud/ipfs/QmaPJLmYUZpVgQ6KZyDQYkEghqv3JJMqRbvm9EK6zKz2uX'); background-size: 1200px 630px; color: #fff;">
    <p style="position: absolute; top: -20px; left: 540px; color: black; font-size: 40px; background-color: white">Race # 3</p>
    <div style="display: flex; padding: 12px;">
      <p style="position: absolute; top: 35px; color: black; font-size: 25px">Distance: ${buttonCount1?.interaction_count}</p>
      <img style="width: 150px; left: 20px; margin-left: ${car1Pixels}px; position: absolute; top: 35px" src="https://pamadd.mypinata.cloud/ipfs/QmP7LyUCLdXrsds5HeUMqs4ur9mSoCSFdU1GkzXg83hA82" />
      <img style="width: 40px; left: 10px; position: absolute; top: 105x" src="https://pamadd.mypinata.cloud/ipfs/QmeDs9TPT8KLgnvvjqekHRJMqVZKt66W1hgQpVRSNUpGoQ" />
      <p style="position: absolute; top: 170px; color: black; font-size: 25px">Distance: ${buttonCount2?.interaction_count}</p>
      <img style="width: 150px; left: 20px; margin-left: ${car2Pixels}px; position: absolute; top: 170px" src="https://pamadd.mypinata.cloud/ipfs/QmaG9HgtyLKpLGypDHFLyofgZQznrAbr4sVyJ76yxDPVTh" />
      <p style="position: absolute; top: 310px; color: black; font-size: 25px">Distance: ${buttonCount3?.interaction_count}</p>
      <img style="width: 150px; left: 20px; margin-left: ${car3Pixels}px; position: absolute; top: 310px" src="https://pamadd.mypinata.cloud/ipfs/QmdxLRPdkTXMSnXXEbZuCNEe42PaU5oVH81GqZbW4L5NDQ" />
      <img style="width: 40px; left: 10px; position: absolute; top: 380x" src="https://pamadd.mypinata.cloud/ipfs/QmeDs9TPT8KLgnvvjqekHRJMqVZKt66W1hgQpVRSNUpGoQ" />
      <p style="position: absolute; top: 445px; color: black; font-size: 25px">Distance: ${buttonCount4?.interaction_count}</p>
      <img style="width: 150px; left: 20px; margin-left: ${car4Pixels}px; position: absolute; top: 445px" src="https://pamadd.mypinata.cloud/ipfs/QmdSoCvYzgYvY8GVE71VcF6p1oCyBzZCTARr7LE3Xkb7ws" />
    </div>
  </div>
  `);

  // convert html to svg
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
    console.log(url)
    //  Get analytics data here
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      }
    })
    const json: AnalyticsResponse [] = await res.json();
    const image = await generateImage(json);
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
      // await fdk.sendAnalytics(FRAME_ID, req.body);
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
        image: {url: dataURI, ipfs: false}
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

