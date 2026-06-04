import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const API = 'https://api.weather-ai.co/v1/weather-geo';
    const params = new URLSearchParams(req.query as Record<string, string> || {});

    const url = `${API}?${params.toString()}`;

    const apiRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.WEATHER_API_KEY}`,
      },
    });

    const body = await apiRes.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    const contentType = apiRes.headers.get('content-type') || 'application/json';
    res.setHeader('Content-Type', contentType);
    res.status(apiRes.status).send(body);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'proxy_error' });
  }
}
