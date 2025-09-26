import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}


