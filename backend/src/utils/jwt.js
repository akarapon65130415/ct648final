const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

function createToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp ? decoded.exp < currentTime : true;
    return { payload: decoded, isExpired };
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}

function verifyTokenAuthorized(authorization) {
  try {
    let token = '';
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.slice(7); // Remove "Bearer " prefix
    } else {
      return false;
    }

    const decoded = jwt.verify(token, secretKey);
    if (decoded === null) {
      return false;
    } else {
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = decoded.exp ? decoded.exp < currentTime : true;
      return !isExpired;
    }
  } catch (error) {
    console.error('Invalid token', error);
    return false;
  }
}

module.exports = {
  createToken,
  verifyToken,
  verifyTokenAuthorized
};
