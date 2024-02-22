import type { NextApiRequest, NextApiResponse } from 'next';
import { headers } from 'next/headers'
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface AnalyticsResponse {
  button_index: number;
  interaction_count: number;
  unique_interactions: number;
}

const FRAME_ID = "pinata_race";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const authHeader = request.headers.authorization;

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const first_race = dayjs.utc('2024-02-21T15:00:00');
  const previousHour = dayjs.utc().subtract(1, 'hour').endOf('hour');

  const hoursDifference = previousHour.diff(first_race, 'hour');

  const hoursArray = [];

  for (let i = 0; i < hoursDifference; i++) {
    const utcStartHour = first_race.add(i, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const utcEndHour = first_race.add(i + 1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    console.log('utcStartHour', utcStartHour)
    console.log('utcEndHour', utcEndHour)

    const url = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=button_index&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=${FRAME_ID}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      }
    })
    const json: AnalyticsResponse [] = await res.json();
    hoursArray.push({json, url});
  }

  // const startDate = dayjs(now).format('YYYY-MM-DD HH:mm:ss');
  // const endDate = dayjs(today).format('YYYY-MM-DD HH:mm:ss');

  // const result = await fetch(
  //   'http://worldtimeapi.org/api/timezone/America/Chicago',
  // );
  // const data = await result.json();

  const data = {
    first_race,
    previousHour,
    hoursDifference,
    hoursArray
  }

  return response.json({ data });
}