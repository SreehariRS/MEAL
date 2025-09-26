export function getCorsOrigin() {
  // On Vercel, frontend and backend share domain, so allow same-origin
  if (process.env.VERCEL === '1') return undefined; // defaults to request origin
  return process.env.CORS_ORIGIN || 'http://localhost:5173';
}


