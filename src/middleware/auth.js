const jwt = require('jsonwebtoken');
const ApiKey = require('../models/apiKey');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    // If no API key, try Bearer token
    return authenticateToken(req, res, next);
  }

  try {
    const key = await ApiKey.findOne({ where: { key: apiKey } });
    if (!key) return res.status(401).json({ error: 'Invalid API key' });
    
    req.user = { id: key.userId };
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { authenticateToken, authenticateApiKey };