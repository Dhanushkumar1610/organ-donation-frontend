const express = require('express');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const Transfer = require('../models/Transfer');
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, 'secret');
    if (decoded.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

router.post('/doctors', auth, async (req, res) => {
  const { name, email, hospital } = req.body;
  try {
    let doctor = await Doctor.findOne({ email });
    if (doctor) return res.status(400).json({ msg: 'Doctor already exists' });

    doctor = new Doctor({ name, email, hospital });
    await doctor.save();
    res.json({ msg: 'Doctor added successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/hospitals', auth, async (req, res) => {
  const { name, location } = req.body;
  try {
    let hospital = await Hospital.findOne({ name });
    if (hospital) return res.status(400).json({ msg: 'Hospital already exists' });

    hospital = new Hospital({ name, location });
    await hospital.save();
    res.json({ msg: 'Hospital added successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/donations', auth, async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/transfers', auth, async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;