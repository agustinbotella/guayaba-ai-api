const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const ApiKey = require('../models/apiKey');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const apiKeys = await ApiKey.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'name', 'key', 'createdAt']
    });
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const apiKey = await ApiKey.create({
      name,
      userId: req.user.id
    });

    res.status(201).json(apiKey);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!apiKey) return res.status(404).json({ error: 'API key not found' });

    await apiKey.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;