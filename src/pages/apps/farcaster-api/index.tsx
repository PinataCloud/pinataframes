import Head from 'next/head';
import Image from 'next/image';

export default function Index() {
  return (
    <>
      <Head>
        <title>Announcing the Farcaster API by Pinata</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={"https://dweb.mypinata.cloud/ipfs/QmQYFeub8vRJzrX7EExfQqJoc3xswEk5NZyN8Yj2Ape6To"} />
        <meta property="og:image" content={"https://dweb.mypinata.cloud/ipfs/QmQYFeub8vRJzrX7EExfQqJoc3xswEk5NZyN8Yj2Ape6To"} />
        <meta property="og:title" content="Farcoder" />
        <meta property="og:description" content="Pinata now has a convenient API for Farcaster data." />
        <meta property="fc:frame:button:1" content="Start coding" />
        <meta property="fc:frame:post_url" content={`https://pinatadrops.com/api/farcaster-api/check`} />
      </Head>
      <h1>Farcaster API</h1>
      <p>Along with the Farcaster Hub, Pinata now has a convenient API to make querying Facaster data faster and easier.</p>

      <Image src="https://dweb.mypinata.cloud/ipfs/QmQYFeub8vRJzrX7EExfQqJoc3xswEk5NZyN8Yj2Ape6To" width={400} height={200} alt="Code" />
    </>
  );
}