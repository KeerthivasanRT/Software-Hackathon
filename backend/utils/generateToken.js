const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'BIT_TRANSPORT_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

module.exports = generateToken;
