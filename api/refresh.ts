import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  // In serverless mode, data is fetched fresh on every /api/all call
  // so refresh is a no-op. This endpoint exists for client compatibility.
  res.status(200).json({ refreshed: true, timestamp: new Date().toISOString() })
}
