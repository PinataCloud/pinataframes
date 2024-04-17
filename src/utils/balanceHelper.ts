import satori, { SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import path from 'path';
import fs from 'fs';

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
      `https://api.pinata.cloud/pinning/pinFileToIPFS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: formData,
      },
    );
    const { IpfsHash } = await imageUpload.json();

    return IpfsHash
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const satoriHelper = async (balance: number) => {
  const monoFontReg = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf",
  );

  const monoFontBold = await fetch(
    "https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf",
  );

  const template: any = html(`
  <div style="position: relative; height: 600px; width:1200px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; font-family: 'Inter', sans-serif;">
    <div style="display: flex; position: absolute; top: 0; left: 0; z-index: 500;">
      <img style="width:1200px; height: 600px;" src="https://mktg.mypinata.cloud/ipfs/QmUpCZ9MkJdBT1Jm1votkvcjVJEK4WS9KSnHMfcx9mvFUN" />
    </div>
    <div style="display: flex; position: absolute; z-index: 1200; bottom: 50px;">
      <h3 style="font-size: 150px; font-family: 'Inter', sans-serif;">${balance.toLocaleString()}</h3>
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

export const generateBalanceImage = async (balance: number) => {
  try {
    const image = await satoriHelper(balance);
    const cid = await uploadToIpfs(image);
    return cid;
  } catch (error) {
    console.log(error);
    throw error;
  }
}