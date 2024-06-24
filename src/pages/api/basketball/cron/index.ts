import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
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

  const first_race = dayjs.utc('2024-06-24T15:00:00');
  const previousHour = dayjs.utc().subtract(1, 'hour').endOf('hour');

  const hoursDifference = previousHour.diff(first_race, 'hour');

  const winnersArray = [];

  for (let i = 0; i < hoursDifference; i++) {
    const utcStartHour = first_race.add(i, 'hour').format('YYYY-MM-DD HH:mm:ss');
    const utcEndHour = first_race.add(i + 1, 'hour').format('YYYY-MM-DD HH:mm:ss');

    const url = `${process.env.PINATA_API}/farcaster/frames/interactions/top?by=button_index&start_date=${utcStartHour}&end_date=${utcEndHour}&frame_id=${FRAME_ID}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      }
    })
    const json: AnalyticsResponse [] = await res.json();

    if (json.length > 0) {
      const winner = json.reduce((prev, current) => (prev.interaction_count > current.interaction_count) ? prev : current);
      winnersArray.push({winner, raceNumber: i + 1});
    }
  }

  const winsPerCar = {
    car1: 0,
    car2: 0,
    car3: 0,
    car4: 0,
  }

  winnersArray.forEach(winner => {
    if (winner.winner.button_index === 1) {
      winsPerCar.car1++;
    } else if (winner.winner.button_index === 2) {
      winsPerCar.car2++;
    } else if (winner.winner.button_index === 3) {
      winsPerCar.car3++;
    } else if (winner.winner.button_index === 4) {
      winsPerCar.car4++;
    }
  });

  // const result = await fetch(
  //   'http://worldtimeapi.org/api/timezone/America/Chicago',
  // );
  // const data = await result.json();

  const data = {
    winsPerCar,
    first_race,
    previousHour,
    hoursDifference,
  }

  await kv.set('latestRace', JSON.stringify(data));
  const latestRace: any = await kv.get('latestRace');
  console.log('latestRace', latestRace);
  console.log('latestRace type', typeof latestRace);

  return response.json({ data });
}