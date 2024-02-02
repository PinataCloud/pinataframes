import type { NextApiRequest, NextApiResponse, } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest): Promise<Response> {
  const { location } = req.query

  //add location to next config file
  const headers = new Headers();
  headers.set('Location', `${process.env.HOSTED_URL}/`);
  const response = NextResponse.redirect(`${process.env.HOSTED_URL}/${location}`, {
    headers: headers,
    status: 302,
  });
  return response;
}

export const dynamic = 'force-dynamic';
