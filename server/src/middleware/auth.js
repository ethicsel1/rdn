import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token di accesso mancante' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        subscriptionLevel: true,
        subscriptionStatus: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token non valido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token scaduto' });
    }
    return res.status(500).json({ error: 'Errore del server' });
  }
};
