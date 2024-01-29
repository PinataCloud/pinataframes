import satori, { SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

export const satoriHelper = async (requestBody: any) => {
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/roboto-mono/latin-400-normal.ttf",
  );

  const monoFontBold = await fetch(
    "https://api.fontsource.org/v1/fonts/roboto-mono/latin-700-normal.ttf",
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
  };

  const markup = (message1: any, message2: any, message3: any, message4: any, chatInput: any): any =>
    html`
<div
  tw="flex flex-col justify-between p-16 items-start text-2xl font-semibold bg-purple-200 w-full h-full"
>
<div id="message" tw="flex flex-col gap-6 w-full">
  <div tw="text-lg text-gray-500 mb-2">${message1.username}</div>
  <div tw="flex">
    <img src="${message1.pfp}" tw="h-12 w-12 rounded-full mr-6" alt="image test" />
    <div tw="flex bg-white p-3 rounded-xl">
      ${message1.content}
    </div>
  </div>
</div>

<div id="message" tw="flex flex-col gap-6 w-full">
  <div tw="text-lg text-gray-500 mb-2">${message2.username}</div>
  <div tw="flex">
    <img src="${message2.pfp}" tw="h-12 w-12 rounded-full mr-6" alt="image test" />
    <div tw="flex bg-white p-3 rounded-xl">
      ${message2.content}
    </div>
  </div>
</div>

<div id="message" tw="flex flex-col gap-6 w-full">
  <div tw="text-lg text-gray-500 mb-2">${message3.username}</div>
  <div tw="flex">
    <img src="${message3.pfp}" tw="h-12 w-12 rounded-full mr-6" alt="image test" />
    <div tw="flex bg-white p-3 rounded-xl">
      ${message3.content}
    </div>
  </div>
</div>

<div id="message" tw="flex flex-col gap-6 w-full">
  <div tw="text-lg text-gray-500 mb-2">${message4.username}</div>
  <div tw="flex">
    <img src="${message4.pfp}" tw="h-12 w-12 rounded-full mr-6" alt="image test" />
    <div tw="flex bg-white p-3 rounded-xl">
      ${message4.content}
    </div>
  </div>
</div>


<div tw="w-full bg-white p-3 rounded-xl">
${chatInput}
</div>
</div>
`;

  const svg = await satori(markup(requestBody.message1, requestBody.message2, requestBody.message3, requestBody.message4, requestBody.chatInput), ogOptions);
  const png = new Resvg(svg).render().asPng();
  return png
};
