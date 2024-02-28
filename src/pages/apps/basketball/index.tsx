import Head from 'next/head';

export default function Index() {
  return (
    <>
      <Head>
        <title>Farcaster basketball</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={"https://pamadd.mypinata.cloud/ipfs/QmTL741ruhSPnCEQJKDPJD7M2rtDgx19mBcEK3TjKLSEeg"} />
        <meta property="og:image" content={"https://pamadd.mypinata.cloud/ipfs/QmTL741ruhSPnCEQJKDPJD7M2rtDgx19mBcEK3TjKLSEeg"} />
        <meta property="og:title" content="Users Chart" />
        <meta property="og:description" content="FC users by time" />
        <meta property="fc:frame:button:1" content="Start" />
        <meta property="fc:frame:post_url" content={`${process.env.HOSTED_URL}/api/basketball`} />
      </Head>
      <h1>Pinata Basketball</h1>
      {/*<img src="/api/race" alt="FC User Stats" />*/}
    </>
  );
}