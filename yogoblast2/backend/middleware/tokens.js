import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();  

 const blacklistToken = [];

export const logOut = async (req, res) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Add token to blacklist
  blacklistToken.push(token);

  res.json({ status: 'success', message: 'Logged out successfully' });
};

// Middleware to check token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing in tokenVerification' });
  }

  const token = authHeader.split(' ')[1];

  // Check if token is blacklisted
  if (blacklistToken.includes(token)) {
    return res.status(401).json({ message: 'Unauthorized: Token blacklisted' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    req.user = decoded;
    // console.log(req.user.id);
     next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
