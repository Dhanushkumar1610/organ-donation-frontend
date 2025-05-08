const express = require('express');
const jwt = require('jsonwebtoken');
const Request = require('../models/Request');
const Donation = require('../models/Donation');
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'secret');
    if (decoded.role !== 'user') return res.status(403).json({ msg: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

router.post('/request-organ', auth, async (req, res) => {
  const { organ, urgency, description } = req.body;
  try {
    const request = new Request({
      userId: req.user.id,
      requestedBy: req.user.id,
      organ,
      urgency,
      description,
    });
    await request.save();
    res.json({ msg: 'Request submitted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/donate-organ', auth, async (req, res) => {
  const { organ, date } = req.body;
  try {
    const donation = new Donation({
      donorId: req.user.id,
      donorName: req.user.id, // Replace with actual name in production
      organ,
      date,
    });
    await donation.save();
    res.json({ msg: 'Donation submitted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;