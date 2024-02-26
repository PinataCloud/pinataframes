import Head from 'next/head';

const testAsyncFn = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('remote called');
      resolve('done');
    }, 2000);
  });
}

export default function Index() {
  testAsyncFn();
  return (
    <>
      <Head>
        <title>Farcaster basketball</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={"https://pamadd.mypinata.cloud/ipfs/QmeZ7Gfwj1hKpE9y7oLReQsc6NpRyZFWFC7DCxDr2TpCzX"} />
        <meta property="og:image" content={"https://pamadd.mypinata.cloud/ipfs/QmeZ7Gfwj1hKpE9y7oLReQsc6NpRyZFWFC7DCxDr2TpCzX"} />
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