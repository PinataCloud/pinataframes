import { PinataFDK } from "pinata-fdk";
import { NextApiRequest, NextApiResponse } from "next";
import { generateAnalyticsImage } from "@/utils/satori";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT!,
  pinata_gateway: process.env.GATEWAY_URL!
}
);

const FRAME_ID = "farcoder";

export default async function handler(req: NextApiRequest, res: NextApiResponse,) {
  if (req.method === "POST") {
    console.log('body', req.body);
    try {
      const isValidated = await fdk.validateFrameMessage(req.body);

      if (!isValidated) {
        return res.status(400).json({ error: "Invalid frame message" });
      }

      await fdk.sendAnalytics(FRAME_ID, req.body);

      let imageUrl = ""
      let postEndpoint = "";
      let buttons: any = [{ label: 'Submit answer', action: 'post' }, { label: 'Build your own', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk" }]
      let possibleAnswers = [""]
      let input = true;
      switch (req.query.id) {
        case "2":
          possibleAnswers = ["fcPhrases[2]", "fcPhrases[2];", "console.log(fcPhrases[2])"]
          if (possibleAnswers.includes(req.body.untrustedData.inputText)) {
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmQRzB7mNnSBhCpQUKA9w7ar3avGKzoV9xvQV4849jvkJa`;
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/3`
            break;
          } else {
            //  Game over screen
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmevCfJbagZiBhWYs1y2nLUMo3AQ7NcDwnvJkk9fswf9nN`
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/1`
            buttons = [{ label: 'Play again', action: 'post' }, { label: 'Build your own', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk" }]
            input = false;
            break;
          }
        case "3":
          possibleAnswers = ['first + second + third', 'first + second + third;', '`${first}${second}${third}`', '`${first}${second}${third}`;']
          if (possibleAnswers.includes(req.body.untrustedData.inputText)) {
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmT42dBmiphaXAXYkTebavKUeKqKBCm6MG3ANm2mCPALLn`;
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/4`
            break
          } else {
            //  Game over screen  
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmSeftd8vDvhYUb8SYRnDswzzKDarST7UxKnDkXQ9Dz7w4`
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/1`
            buttons = [{ label: 'Play again', action: 'post' }, { label: 'Build your own', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk" }]
            input = false;
            break;
          }
        case "4":
          possibleAnswers = ["console.log(getDwrFidOption3(fids))", "console.log(getDwrFidOption3(fids));"]
          if (possibleAnswers.includes(req.body.untrustedData.inputText)) {
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmQnHSEGWQy4WUMjUJcoTcdbMYVfQCjGgPQ5pGtnrVWx1b`;
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/5`
            break;
          } else {
            //  Game over screen
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmSPqx6gtVyiUM5psLVoLcoCpmkUEXibmCP6Pm2QoC36Nv`
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/1`
            buttons = [{ label: 'Play again', action: 'post' }, { label: 'Build your own', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk" }]
            input = false;
            break;
          }
        case "5":
          possibleAnswers = ['bio["TEAPOT"]', 'bio["TEAPOT"];', 'bio.TEAPOT', 'bio.TEAPOT;']
          if (possibleAnswers.includes(req.body.untrustedData.inputText)) {
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmUeyLP9cdmcFZzZPqYLsSRtcUWXqn4QvoUL2cVPMcR7HM`;
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/6`
            break
          } else {
            //  Game over screen
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmSPqx6gtVyiUM5psLVoLcoCpmkUEXibmCP6Pm2QoC36Nv`
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/1`
            buttons = [{ label: 'Play again', action: 'post' }, { label: 'Build your own', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk" }]
            input = false;
            break;
          }
        case "6":
          possibleAnswers = ["farcoder.slice(4, farcoder.length)", "farcoder.slice(4, farcoder.length);", "farcoder.slice(4)", "farcoder.slice(4);", "farcoder.slice(-14)", "farcoder.slice(-14);", "farcoder.substring(4)", "farcoder.substring(4);", "farcoder.substr(4)", "farcoder.substr(4);", 'farcoder.substring(farcoder.indexOf("I"))', 'farcoder.substring(farcoder.indexOf("I"));', 'farcoder.split("0101")[1]', 'farcoder.split("0101")[1];']
          if (possibleAnswers.includes(req.body.untrustedData.inputText)) {
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmQecg81c8cuZkAnTf28SkVSmJXxcUSmhY7NH9LXeGGTQE`;
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/7`            
            input = true;
            break;
          } else {
            //  Game over
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmaEjjAzgeztW3A3UbmfKruDgCb3oRDEPsV5N6keor9t7w`
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/1`
            buttons = [{ label: 'Play again', action: 'post' }, { label: 'Build your own', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk" }]
            input = false;
            break;
          }
        case "7":
          possibleAnswers = ["getFrameAnalytics()", "getFrameAnalytics();", "await getFrameAnalytics()", "await getFrameAnalytics();"]
          if (possibleAnswers.includes(req.body.untrustedData.inputText)) {
            imageUrl = await generateAnalyticsImage(FRAME_ID, "Farcoder Stats") //`${process.env.GATEWAY_URL}/ipfs/Qmf8kouZJvB1DPZUFXLPQF56hhEWA39aog34uDohdBKinw`;
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/1`
            buttons = [{ label: 'Play again', action: 'post' }, { label: 'Build your own', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk" }]
            input = false;
            break;
          } else {
            //  Game over
            imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmQYFs1DyeYz41BkhiGmyoLGMfxi7eh8EZjenEAZYcXdYt`
            postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/1`
            buttons = [{ label: 'Play again', action: 'post' }, { label: 'Build your own', action: "link", target: "https://docs.pinata.cloud/farcaster/fdk" }]
            input = false;
            break;
          }
        case "1":
        default:
          imageUrl = `${process.env.GATEWAY_URL}/ipfs/QmQxvhwhrnHgd6USpe4QvdqtbJi1T6nqApitgMtND8Vv21`;
          postEndpoint = `${process.env.HOSTED_URL}/api/farcoder/2`
          break;        
      }

      let frameMetadata;

      if(input) {
        frameMetadata = await fdk.getFrameMetadata({
          post_url: postEndpoint,
          buttons: buttons,
          input: {text: "Type your code"},
          image: { url: imageUrl, ipfs: false }
        });
      } else {
        frameMetadata = await fdk.getFrameMetadata({
          post_url: postEndpoint,
          buttons: buttons,
          image: { url: imageUrl, ipfs: false }
        });
      }  


      const frameRes =
        `<!DOCTYPE html><html><head>
            <title>Pinata basketball</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="og:title" content="Farcoder" />
            <meta property="og:description" content="Solve coding puzzles, become a Farcoder." />
            ${frameMetadata}
            </head></html>`;

      return res.setHeader('content-type', 'text/html').send(frameRes);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}

