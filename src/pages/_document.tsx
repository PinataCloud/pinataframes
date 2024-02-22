import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content="Pinata Drops | Farcaster Frames & Guides" key="title" />
        <meta property="og:image" content="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/Qmc3hGquMucuNLWZLnFv8QTarEZtZ2Jw8YuKUd4dxuXgat" />
        <meta property="og:description" content="A collection of Farcaster Frames built by Pinata with links to the source code." />
        <meta property="twitter:image" content="https://azure-tiny-tahr-350.mypinata.cloud/ipfs/Qmc3hGquMucuNLWZLnFv8QTarEZtZ2Jw8YuKUd4dxuXgat" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Pinata Drops | Farcaster Frames & Guides" />
        <meta property="twitter:description" content="A collection of Farcaster Frames built by Pinata with links to the source code." />
        <meta property="description" content="A collection of Farcaster Frames built by Pinata with links to the source code." />
        <link
          href="https://rsms.me/inter/inter.css"
          rel="stylesheet"
        />
      </Head>
      <body className="custom-background font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
