import Head from 'next/head';

export default function Index() {
  return (
    <>
      <Head>
        <title>FC Users by time</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={"https://pamadd.mypinata.cloud/ipfs/QmeZ7Gfwj1hKpE9y7oLReQsc6NpRyZFWFC7DCxDr2TpCzX"} />
        <meta property="og:image" content={"https://pamadd.mypinata.cloud/ipfs/QmeZ7Gfwj1hKpE9y7oLReQsc6NpRyZFWFC7DCxDr2TpCzX"} />
        <meta property="og:title" content="Users Chart" />
        <meta property="og:description" content="FC users by time" />
        <meta property="fc:frame:button:1" content="Enter the race" />
        <meta property="fc:frame:post_url" content={`${process.env.HOSTED_URL}/api/race`} />
      </Head>
      <h1>FC Race</h1>
      {/*<img src="/api/race" alt="FC User Stats" />*/}
    </>
  );
}