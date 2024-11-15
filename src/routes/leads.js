const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
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
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticateApiKey, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const offset = (page - 1) * limit;
    
    const whereClause = {
      userId: req.user.id,
      ...(search && {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { phoneNumber: { [Op.iLike]: `%${search}%` } }
        ]
      })
    };

    // Get paginated leads first
    const { count, rows: leads } = await Lead.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      leads,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;