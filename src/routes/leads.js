const express = require('express');
const router = express.Router();
const { authenticateApiKey } = require('../middleware/auth');
const Lead = require('../models/lead');

router.post('/', authenticateApiKey, async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    
    if (!name || !phoneNumber) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const lead = await Lead.create({
      name,
      phoneNumber,
      userId: req.user.id
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticateApiKey, async (req, res) => {
  try {
    const leads = await Lead.findAll({
      where: { userId: req.user.id }
    });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;