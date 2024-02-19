import type { NextApiRequest, NextApiResponse } from "next";
import {PinataFDK} from "pinata-fdk";
import { addmagic8BallRow } from "@/utils/storage";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT!,
  pinata_gateway: process.env.GATEWAY_URL!.split("https://")[1]
},
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/magic-8-ball`,
        input: { text: "Ask a question" },
        aspect_ratio: "1.91:1",
        buttons: [
          { label: 'Shake the 8 Ball', action: 'post' }
        ],
        cid: "bafybeidelrv4tp46l4mn5yzwnzdjtb3p2vyjhqu7mei73vetwtcdkhn4ja"
      });
      const html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          ${frameMetadata}
        </head>
        <body>
          <div style="background: #fff;">
            <img style="width: 50%; margin: auto;" src="${process.env.GATEWAY_URL}/ipfs/bafybeidelrv4tp46l4mn5yzwnzdjtb3p2vyjhqu7mei73vetwtcdkhn4ja" />
          </div>
        </body>
        </html>`
      res.send(html);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  } else if (req.method === "POST") {
    try {
      const answerCids: string[] = [
        "bafybeibfemtjmtdlbnaw6qxyf36kxrfih2qdb5lf33mfrhbbjtbjamzihi",
        "bafybeigbcyo3gol3ejtbexstdz4qmz2bqx2yejotyllhfsnjcr4wdrpruu",
        "bafybeiaalcfltmk4phqc5oj7tmhmwt7oi3u4hmaypapvwtmrbsppavop5a",
        "bafybeihjpashblxzats2canvsvjevgnf3may7vwqbyyxjs2bpr7f43nmbu",
        "bafybeic6m5ofvuhs3tzk7b7547wf4yxybnrax7qukcorcmu2fii2zj4izq",
        "bafybeia35fp5sot3bh4hgst3pgrs56q4maabwiq6c7teluzdxrqcupzmtu",
        "bafybeidmgthgy57kpy7jytpohk3vq2hbiu64enr3a54bysrtembbo6kr4q",
        "bafybeialkvrn5spzcom2ohhty3wyhvemqsiex7kcxycbjimmphs4ndu5pq",
        "bafybeidmkpmjpv52tp724yicj6gmpwap3pzurdnxag2ojcq4ng6e4hpqiy",
        "bafybeiac37oeyth5pzxcrbldunjjyx6aoau7y4kclmsebr5dc5bf47udwa",
        "bafybeifb27mxot3b7i77bzktvw7ta6ealyl6i6xl63dpsj3gw3gyojnu2u",
        "bafybeihkez2dz5jheyq7ozjiltb2b4lb5vrr2m5qv6shfuxc4byvrv6boi",
        "bafybeideockh7pg3vjmmt635gegftwpixhlubmhi35qinlwuryiyqmchye",
        "bafybeibuj3si5eu6cmgm7v2elga3a5ml62porkbkk3zu6346lq5faallii",
        "bafybeifoc3nlrvkidr6nczcmnse35kgvgmupvrwh5ie3wdgfss4dcogj7a",
        "bafybeifdzdkbwwwlunapmuicqq4oek27uqpuvdo25ey5hn2tsxkzjqcjq4",
        "bafybeibi2uosvpbl567qt4vobcsd37vzkqoywcrfgade6x54ytkjvbdjxu",
        "bafybeidxxhgtxii5zec7kdkovratmq6afjt5m7sjbjdjvzpxdqcliqr724",
        "bafybeidelrv4tp46l4mn5yzwnzdjtb3p2vyjhqu7mei73vetwtcdkhn4ja",
        "bafybeicx5ilo4lsyoioxxkxx3qsda7x4ykuytdiw6vy5it6fnpd74qdvce",
        "bafybeicpfzsjeprf4ln77he2ytwuexkmnxev6c5btan5migsa3ut6oxihm"
      ];
      const selectedAnswer = answerCids[Math.floor(Math.random() * answerCids.length)];
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.HOSTED_URL}/api/magic-8-ball`,
        input: { text: "Ask a question" },
        aspect_ratio: "1.91:1",
        buttons: [
          { label: 'Shake the 8 Ball', action: 'post' }
        ],
        cid: selectedAnswer
      });
      const html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          ${frameMetadata}
        </head>
        <body>
        <div style="background: #fff;">
          <img style="width: 50%; margin: auto;" src="${process.env.GATEWAY_URL}/ipfs/${selectedAnswer}" />
        </div>
      </body>
        </html>`

      if (req.body?.trustedData?.messageBytes) {
        console.log(req.body);
        const { isValid, message } = await fdk.validateFrameMessage(req.body);
        console.log(isValid);
        if (isValid) {
          const { inputText, fid } = req.body.untrustedData;
          await addmagic8BallRow(fid, inputText, selectedAnswer)
        }
      }
      res.send(html);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
}
