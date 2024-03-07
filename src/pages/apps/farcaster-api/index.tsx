import Head from 'next/head';
import Image from 'next/image';

export default function Index() {
  return (
    <>
      <Head>
        <title>Announcing the Farcaster API by Pinata</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={"https://dweb.mypinata.cloud/ipfs/QmUEJPV8CdsgnK6NG3cnEA5ePtsZav488H4p3UTiDA2Q3R"} />
        <meta property="og:image" content={"https://dweb.mypinata.cloud/ipfs/QmUEJPV8CdsgnK6NG3cnEA5ePtsZav488H4p3UTiDA2Q3R"} />
        <meta property="og:title" content="Farcoder" />
        <meta property="og:description" content="Pinata now has a convenient API for Farcaster data." />
        <meta property="fc:frame:button:1" content="Unlock docs" />
        <meta property="fc:frame:post_url" content={`https://pinatadrops.com/api/farcaster-api/check`} />
      </Head>
      <h1>Farcaster API</h1>
      <p>Along with the Farcaster Hub, Pinata now has a convenient API to make querying Facaster data faster and easier.</p>

      <Image src="https://dweb.mypinata.cloud/ipfs/QmUEJPV8CdsgnK6NG3cnEA5ePtsZav488H4p3UTiDA2Q3R" width={400} height={200} alt="Code" />
    </>
  );
}