import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default function handler(request: NextRequest, response: NextResponse) {
  try {
    const frameRes =
      `<!DOCTYPE html><html><head>
            <title>FC Users by time</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="og:title" content="Users Chart" />
            <meta property="og:description" content="FC users by time" />
            <meta property="fc:frame:image" content="${process.env.HOSTED_URL}/api/cacheImage" />
            <meta property="og:image" content="${process.env.HOSTED_URL}/api/cacheImage" />
            </head></html>`;

    const res = new Response(frameRes)
    res.headers.set('cache-control', 'public, max-age=0, must-revalidate');
    return res;
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}