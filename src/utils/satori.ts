import satori, { SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { getIconCode, loadEmoji } from "./twemoji";
import fs from 'fs'
import path from 'path';
import dayjs, {Dayjs} from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

type FrameDataByDate = {
  date: Date,
  frame_id:string,
  interaction_count: number, 
  button_index_1_interactions?: number, 
  button_index_2_interactions?: number, 
  button_index_3_interactions?: number,
  button_index_4_interactions?: number
}

interface FrameAnalyticsResponse {
    total_interactions: number,
    total_unique_interactions: number,
    dates: FrameDataByDate[]  
}

export const uploadToIpfs = async (image: any) => {
  try {
    const tempPath = path.join("/tmp", "image.png");
    fs.writeFileSync(tempPath, image);
    const file = fs.readFileSync(tempPath);
    const formData = new FormData();
    formData.append("file", new Blob([file]), "image.png");

    const metadata = JSON.stringify({
      name: `image.png`,
    });
    formData.append("pinataMetadata", metadata);
    const imageUpload = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: formData,
      },
    );
    const { IpfsHash } = await imageUpload.json();

    const url = `${process.env.GATEWAY_URL}/ipfs/${IpfsHash}?filename=image.png`;
    console.log({ url });
    return url;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const satoriHelper = async (requestBody: any) => {
  console.log(requestBody);
  const chatInput = requestBody.input;

  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  const monoFontBold = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf",
  );

  const ogOptions: SatoriOptions = {
    width: 1200,
    height: 630,
    // debug: true,
    embedFont: true,
    fonts: [
      {
        name: "Roboto Mono",
        data: await monoFontReg.arrayBuffer(),
        weight: 400,
        style: "normal",
      },
      {
        name: "Roboto Mono",
        data: await monoFontBold.arrayBuffer(),
        weight: 700,
        style: "normal",
      },
    ],
    loadAdditionalAsset: async (code: any, segment: any) => {
      if (code === "emoji") {
        return `data:image/svg+xml;base64,${btoa(
          await loadEmoji("twemoji", getIconCode(segment)),
        )}`;
      }
      return [];
    },
  };

  const markup = (requestBody: any, chatInput: any): any => html`
    <div
      tw="flex flex-col justify-between p-12 items-start text-2xl font-semibold bg-[#E2DDFF] w-full h-full"
    >
      ${requestBody?.messages?.map((m: any) => {
        return String.raw`
    <div id="message" tw="flex flex-col gap-4 w-full">
      <div tw="text-lg text-gray-500 mb-2">${m.username}</div>
        <div tw="flex">
          <img src="${m.pfp}" tw="h-12 w-12 rounded-full mr-6" alt="image test" />
        <div tw="flex bg-white p-3 rounded-xl">
          ${m.content}
        </div>
      </div>
    </div>
    `;
      })}

      <div tw="flex text-xl w-full bg-white p-3 mt-4 rounded-xl">${chatInput}</div>
    </div>
  `;

  const markupNoMessages = (chatInput: string): any => html`
    <div
      tw="flex flex-col justify-between p-16 items-start text-2xl font-semibold bg-[#E2DDFF] w-full h-full"
    >
      <div tw="flex"></div>

      <div tw="flex w-full bg-white p-3 rounded-xl">
        ${chatInput ? chatInput : ""}
      </div>
    </div>
  `;

  if (!requestBody.messages || requestBody.messages.length === 0) {
    const svg = await satori(markupNoMessages(chatInput), ogOptions);
    const png = new Resvg(svg).render().asPng();
    return png;
  } else {
    const svg = await satori(markup(requestBody, chatInput), ogOptions);
    const png = new Resvg(svg).render().asPng();
    return png;
  }
};

export const generateImage = async (requestData: any) => {
  try {
    const image = await satoriHelper(requestData);
    const url = await uploadToIpfs(image);
    return url;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const satoriAnalyticsHelper = async (data: FrameAnalyticsResponse, title?: string) => {
  let titleContent = title ? title : "This frame's stats"
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  const monoFontBold = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf",
  );

  const template: any = html(`
<div style="padding: 20px; display: flex; flex-flow: column nowrap; justify-content: center; align-items: center; width: 1200px; height: 630px; backgroundColor: #0AAB5E; color: #fff;">
  <div style="width: 100%; display: flex; flex-direction: column;">
    <img style="width: 80px; margin: auto;" src="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/Qmb1QqaaqBsZU7UihG93kw7GyjF6fe2zRo395z7xRojbwV" />
  </div>
  <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 6px; padding: 12px; color: #fff; font-size: 22px;">
    <h1>${titleContent}</h1>
    <div style="display: flex; flex-direction: row; align-items: center;">
      <div style="display: flex; flex-direction: column; align-items: center; margin-right: 10px;">
        <h3>Total Interactions</h3>
        <h5 style="font-size: 24px;">${data.total_interactions.toLocaleString()}</h5>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; margin-left: 10px;">
        <h3>Unique Interactions</h3>
        <h5 style="font-size: 24px;">${data.total_unique_interactions.toLocaleString()}</h5>
      </div>
    </div>
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
        },
        {
          name: "Roboto Mono",
          data: await monoFontBold.arrayBuffer(),
          weight: 700,
          style: "normal",
        },
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

export const generateAnalyticsImage = async (frame_id: string, title?: string) => {
  try {
    const today = dayjs.utc().endOf('day');
    const startDay = dayjs.utc().subtract(180, 'day').startOf('day');
    const startDate = dayjs(startDay).format('YYYY-MM-DD HH:mm:ss');
    const endDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss');
    console.log(`https://api.pinata.cloud/farcaster/frames/interactions?frame_id=${frame_id}&start_date=${startDate}&end_date=${endDate}`);
    //  Get analytics data here
    const res = await fetch(`https://api.pinata.cloud/farcaster/frames/interactions?frame_id=${frame_id}&start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`, 

      }
    })
    const json: FrameAnalyticsResponse = await res.json();
    console.log(json);
    const image = await satoriAnalyticsHelper(json, title);
    const url = await uploadToIpfs(image);
    return url;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const generateHtmlImage = async (content: string, props?: {asUri?: boolean}) => {
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  const template: any = html(content);
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

  console.log('svg creation good');

  const resvg = new Resvg(svg, {
    background: "rgba(238, 235, 230, .9)",
  });
  const pngData = resvg.render();
  const png = pngData.asPng();

  console.log('Png generation good');

  if (props?.asUri) {
    return 'data:image/png;base64,' + png.toString('base64');
  } else {
    return png;
  }
}
