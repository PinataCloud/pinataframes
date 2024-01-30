import satori, { SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { getIconCode, loadEmoji } from "./twemoji";

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
    width: 800,
    height: 418,
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
      return []
    },
  };

  const markup = (requestBody: any, chatInput: any): any => html`
    <div
      tw="flex flex-col justify-between p-16 items-start text-2xl font-semibold bg-purple-200 w-full h-full"
    >
      ${requestBody?.messages?.map((m: any) => {
        return String.raw`
    <div id="message" tw="flex flex-col gap-6 w-full">
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

      <div tw="flex w-full bg-white p-3 rounded-xl">${chatInput}</div>
    </div>
  `;

  const markupNoMessages = (chatInput: string): any => html`
    <div
      tw="flex flex-col justify-between p-16 items-start text-2xl font-semibold bg-purple-200 w-full h-full"
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
    const file = new File([image], "image.png");
    const formData = new FormData();
    formData.append("file", file);

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

    const url = `${process.env.GATEWAY_URL}/ipfs/${IpfsHash}?filename=image.png`
    console.log({url})
    return url;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
