import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type Card = {
  title: string;
  imgUrl: string;
  castUrl: string;
  githubUrl: string;
}

const cards: Card[] = [
  {
    title: "Pinata 500", 
    imgUrl: "https://pamadd.mypinata.cloud/ipfs/QmeZ7Gfwj1hKpE9y7oLReQsc6NpRyZFWFC7DCxDr2TpCzX", 
    castUrl: "https://warpcast.com/polluterofminds/0x60647c97", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/blob/main/src/pages/api/race/index.ts"
  },
  {
    title: "Analytics Frame", 
    imgUrl: "https://dweb.mypinata.cloud/ipfs/QmPqhuQ8HABhpFPVm3UsLoS5FJoQj8WH8yCEs9C9jxtA8K?filename=image.png", 
    castUrl: "https://warpcast.com/polluterofminds/0x3b83b65e", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/blob/main/src/pages/api/analytics-frame/index.ts"
  },
  {
    title: "Cosmic Cowboys", 
    imgUrl: "https://proxy.warpcast.com/?url=https%3A%2F%2Fazure-tiny-tahr-350.mypinata.cloud%2Fipfs%2FQmdEeeA3VvYFWoB9H5XXej7EowQHx2xCvgzschSX7pdCib&s=f9817af87a5519da12213befbffcfa0baac3e89d2f15d4a0a6edf02378d269a3", 
    castUrl: "https://warpcast.com/polluterofminds/0x1d0a7bef", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/tree/main/src/pages/api/cosmic-cowboys-game"
  }, 
  {
    title: "Magic 8 Ball", 
    imgUrl: "https://proxy.warpcast.com/?url=https%3A%2F%2Fdweb.mypinata.cloud%2Fipfs%2Fbafybeidelrv4tp46l4mn5yzwnzdjtb3p2vyjhqu7mei73vetwtcdkhn4ja&s=7cb5758d9d6c353399548561217d33bfc80150179f7f74c73258116738cd7d34", 
    castUrl: "https://warpcast.com/polluterofminds/0x786f8f4e", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/tree/main/src/pages/api/magic-8-ball"
  }, 
  {
    title: "Mile High Frame Club", 
    imgUrl: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmUUymhRMCkkNCWhCpsE2VtqitLFn4WJER1xDsLE7ayRcL", 
    castUrl: "https://warpcast.com/polluterofminds/0x0c685ecd", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/tree/main/src/pages/api/mile-high-frame"
  }, 
  {
    title: "Pinata Hub Announcement", 
    imgUrl: "https://azure-tiny-tahr-350.mypinata.cloud/ipfs/QmWbcF2CPpHbLoXMnarUMRpNu1dvqMS3b4MQG3wDPAnHHh", 
    castUrl: "https://warpcast.com/polluterofminds/0xc3057c44", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/tree/main/src/pages/api/pinata-hub"
  }, 
  {
    title: "Mint a Steve", 
    imgUrl: "https://dweb.mypinata.cloud/ipfs/QmcBRbicZN7ptxhRxQhf5g7FnBcVEbg8UaPL4pUWfk8Tq9/8.png", 
    castUrl: "https://warpcast.com/stevedylandev.eth/0xfea11af8", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/tree/main/src/pages/api/steve-frames"
  }, 
  {
    title: "The Weekend", 
    imgUrl: "https://dweb.mypinata.cloud/ipfs/QmTidtsgh4faygkV3Fj1f2gfdLNYCFh3gsgNVWRsGwSQbA", 
    castUrl: "https://warpcast.com/stevedylandev.eth/0xe0227b1c", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/tree/main/src/pages/api/the-weekend"
  }, 
  {
    title: "T3 Emoji", 
    imgUrl: "https://mktg.mypinata.cloud/ipfs/QmVqEKexfVFiLB3xPXcwDyyUETLowQwvP2rqjhgpet95Cf?filename=emojichat.png", 
    castUrl: "https://warpcast.com/stevedylandev.eth/0x46e3fee2", 
    githubUrl: "https://github.com/PinataCloud/pinataframes/blob/main/src/pages/api/t3.ts"
  },
]

export default function Home() {

  return (
    <div className="w-3/4 m-auto mt-20 mb-20">
      <h1 className="text-center text-4xl mb-8 font-sans text-white font-bold">Pinata Frames & Resources</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {
          cards.map((c: Card) => {
            return (
              <div key={c.title} className="w-full rounded rounded-md card text-gray-900 shadow shadow-md p-0 m-0">
                <img src={c.imgUrl} className="w-full rounded-t-md" alt={c.title} />
                <div className="p-4">
                  <h3 className="text-left font-bold font-sans text-2xl text-white">{c.title}</h3>
                  <div className="m-auto my-2 flex justify-between mt-4">
                    <a className="font-sans flex justify-center px-1 w-[47%] py-1 bg-white rounded-full text-[#6C5EFF] border border-[#6C5EFF]" href={c.githubUrl} target="_blank" rel="noopener noreferrer">See the code</a>
                    <a className="font-sans flex justify-center px-1 w-[47%] py-1 bg-[#6C5EFF] rounded-full text-white border border-[#6C5EFF]" href={c.castUrl} target="_blank" rel="noopener noreferrer">See the frame</a>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}
