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

const getPercentage = (value: number, total: number) => {
  return (value * 100) / total;
}

const getPercentagePixels = (value: number, total: number, pixels: number) => {
  return (value * pixels) / total;
}

const getCarPixels = (data: any, carId: number, highestNumber: number, maxPixels: number) => {
  const buttonCount = data.find((item: any) => item.button_index === carId);
  const percentage = getPercentage(buttonCount?.interaction_count || 0, highestNumber);
  return getPercentagePixels(buttonCount?.interaction_count || 0, highestNumber, maxPixels);
}

export const generateImage = async (data: AnalyticsResponse []) => {
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  const maxPixels = 1000;
  const highestInteraction = data.reduce((prev, current) => (prev.interaction_count > current.interaction_count) ? prev : current);

  console.log(highestInteraction);

  const car1Pixels = getCarPixels(data, 1, highestInteraction.interaction_count, maxPixels);
  const car2Pixels = getCarPixels(data, 2, highestInteraction.interaction_count, maxPixels);
  const car3Pixels = getCarPixels(data, 3, highestInteraction.interaction_count, maxPixels);
  const car4Pixels = getCarPixels(data, 4, highestInteraction.interaction_count, maxPixels);


  const template: any = html(`
  <div style="padding: 20px; position: relative; display: flex;  justify-content: flex-start;  width: 1200px; height: 630px; background-image: url('https://pamadd.mypinata.cloud/ipfs/QmeAdbdGo2SZQNLGnHJRsbHyVAteYkE7HsrXTUq7dw2UqB'); color: #fff;">
    <div style="display: flex; padding: 12px;">
      <img style="width: 150px; left: 20px; margin-left: ${car1Pixels}px; position: absolute; top: 35px" src="https://pamadd.mypinata.cloud/ipfs/QmP7LyUCLdXrsds5HeUMqs4ur9mSoCSFdU1GkzXg83hA82" />
      <img style="width: 150px; left: 20px; margin-left: ${car2Pixels}px; position: absolute; top: 170px" src="https://pamadd.mypinata.cloud/ipfs/QmaG9HgtyLKpLGypDHFLyofgZQznrAbr4sVyJ76yxDPVTh" />
      <img style="width: 150px; left: 20px; margin-left: ${car3Pixels}px; position: absolute; top: 310px" src="https://pamadd.mypinata.cloud/ipfs/QmdxLRPdkTXMSnXXEbZuCNEe42PaU5oVH81GqZbW4L5NDQ" />
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
    const startDay = dayjs.utc().subtract(180, 'day').startOf('day');
    const startDate = dayjs(startDay).format('YYYY-MM-DD HH:mm:ss');
    const endDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss');
    const url = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=button_index&start_date=${startDate}&end_date=${endDate}&frame_id=${frame_id}`;
    console.log('url', url);
    //  Get analytics data here
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      }
    })
    const json: AnalyticsResponse [] = await res.json();
    console.log('analytics response', json);
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
      await fdk.sendAnalytics(FRAME_ID, req.body);
      const imgContent = await getImage(FRAME_ID);
      const dataURI = 'data:image/png;base64,' + imgContent.toString('base64');
      console.log('')
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

