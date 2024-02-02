import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<Response> {
  const path = 'cosmiccowboys';
  const headers = new Headers();
  headers.set('Location', `${process.env.HOSTED_URL}/`);
  const response = NextResponse.redirect(`${process.env.HOSTED_URL}/${path}`, {
    headers: headers,
    status: 302,
  });
  return response;
}

export const dynamic = 'force-dynamic';