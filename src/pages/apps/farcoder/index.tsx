import Head from 'next/head';
import Image from 'next/image';

export default function Index() {
  return (
    <>
      <Head>
        <title>FC Users by time</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={"https://dweb.mypinata.cloud/ipfs/QmWpwJdob9Rmnd6hKwoMiNacpwDZFiP5rCXr7GJTPCo98G?pinataGatewayToken=0MVUNvM_URS89s-TMmsBcU9EFCTGN1SYCwhUjh6VnsPahpHiVBHXBi_D_ECXYUCV"} />
        <meta property="og:image" content={"https://dweb.mypinata.cloud/ipfs/QmWpwJdob9Rmnd6hKwoMiNacpwDZFiP5rCXr7GJTPCo98G?pinataGatewayToken=0MVUNvM_URS89s-TMmsBcU9EFCTGN1SYCwhUjh6VnsPahpHiVBHXBi_D_ECXYUCV"} />
        <meta property="og:title" content="Farcoder" />
        <meta property="og:description" content="Solve coding puzzles, become a Farcoder." />
        <meta property="fc:frame:button:1" content="Start coding" />
        <meta property="fc:frame:post_url" content={`${process.env.HOSTED_URL}/api/farcoder/1`} />
      </Head>
      <h1>Farcoder</h1>
      <p>Solve coding problems by writing code in-frame. Climb the leaderboard.</p>
      <p>Become a Farcoder hero.</p>

      <Image src="https://solclones-dev.mypinata.cloud/ipfs/QmWpwJdob9Rmnd6hKwoMiNacpwDZFiP5rCXr7GJTPCo98G?pinataGatewayToken=0MVUNvM_URS89s-TMmsBcU9EFCTGN1SYCwhUjh6VnsPahpHiVBHXBi_D_ECXYUCV" width={400} height={200} alt="Code" />
    </>
  );
}