import Head from 'next/head';
import Image from 'next/image';

export default function Index({ imgUrl } : { imgUrl: string }) {
  const handleButtonClick = async (direction: string) => {
    console.log(direction)
  }
  return (
    <>
      {
        imgUrl &&
        <>
          <Head>
            <title>Frogger</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content={"https://dweb.mypinata.cloud/ipfs/QmWpwJdob9Rmnd6hKwoMiNacpwDZFiP5rCXr7GJTPCo98G"} />
            <meta property="og:image" content={"https://dweb.mypinata.cloud/ipfs/QmWpwJdob9Rmnd6hKwoMiNacpwDZFiP5rCXr7GJTPCo98G"} />
            <meta property="og:title" content="Farcoder" />
            <meta property="og:description" content="Solve coding puzzles, become a Farcoder." />
            <meta property="fc:frame:button:1" content="Start coding" />
            <meta property="fc:frame:post_url" content={`${process.env.HOSTED_URL}/api/farcoder/1`} />
          </Head>

          <div className="flex flex-col min-h-screen items-center justify-center">
            <Image src="https://dweb.mypinata.cloud/ipfs/QmWpwJdob9Rmnd6hKwoMiNacpwDZFiP5rCXr7GJTPCo98G" width={400} height={200} alt="Code" />
            <div className="flex flex-row mt-6">
              <button onClick={() => handleButtonClick("left")} className="px-4 py-2 border border-black rounded-md mr-2">⬅️</button>
              <button onClick={() => handleButtonClick("right")} className="px-4 py-2 border border-black rounded-md mr-2">➡️</button>
              <button onClick={() => handleButtonClick("up")} className="px-4 py-2 border border-black rounded-md mr-2">⬆️</button>
              <button onClick={() => handleButtonClick("down")} className="px-4 py-2 border border-black rounded-md">⬇️</button>
            </div>
          </div>
        </>
      }

    </>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('http://localhost:3000/api/frogger/draw')
  const imgUrl = await res.text()
 
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      imgUrl,
    },
  }
}