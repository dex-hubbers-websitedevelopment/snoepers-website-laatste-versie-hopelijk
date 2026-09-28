/import { kv } from '@vercel/kv';

const KEY = 'snoepers-status';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = (await kv.get(KEY)) || { closed: false, since: null };
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { password, closed } = req.body || {};
    if (!password || password !== process.env.STAFF_PASSWORD) {
      return res.status(401).json({ error: 'Onjuist wachtwoord' });
    }
    const data = {
      closed: !!closed,
      since: closed ? new Date().toISOString() : null
    };
    await kv.set(KEY, data);
    return res.status(200).json(data);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Methode niet toegestaan' });
}
