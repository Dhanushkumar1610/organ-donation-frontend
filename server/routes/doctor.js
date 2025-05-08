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
    if (decoded.role !== 'doctor') return res.status(403).json({ msg: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.patch('/requests/:id/status', auth, async (req, res) => {
  const { status, note } = req.body;
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    request.status = status;
    request.description = note || request.description;
    await request.save();
    res.json({ msg: 'Status updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/organ-collection', auth, async (req, res) => {
  const { donorId, organ, date } = req.body;
  try {
    const donation = await Donation.findOne({ donorId, organ });
    if (donation) {
      donation.status = 'Collected';
      donation.date = date;
      await donation.save();
    }
    res.json({ msg: 'Organ marked as collected' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/verify-otp', auth, async (req, res) => {
  const { patientId, mobile, otp } = req.body;
  // In a real application, integrate with an OTP service (e.g., Twilio)
  res.json({ msg: 'OTP verified successfully (mock)' });
});

module.exports = router;