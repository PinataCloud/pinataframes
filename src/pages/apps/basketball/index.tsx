import Head from 'next/head';
import Home from "@/pages";

export default function Index() {
  return (
    <>
      <Head>
        <title>Farcaster basketball</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={"https://pamadd.mypinata.cloud/ipfs/QmSPeWzyhThq85BAtQUfMfxKKXutmQcdUDsYQcsA2a8Lnh"} />
        <meta property="og:image" content={"https://pamadd.mypinata.cloud/ipfs/QmSPeWzyhThq85BAtQUfMfxKKXutmQcdUDsYQcsA2a8Lnh"} />
        <meta property="og:title" content="Users Chart" />
        <meta property="og:description" content="FC users by time" />
        <meta property="fc:frame:button:1" content="Start" />
        <meta property="fc:frame:post_url" content={`${process.env.HOSTED_URL}/api/basketball`} />
      </Head>
      <Home />
      {/*<img src="/api/race" alt="FC User Stats" />*/}
    </>
  );
}