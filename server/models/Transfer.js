const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  organ: { type: String, required: true },
  fromHospital: { type: String, required: true },
  toHospital: { type: String, required: true },
  status: { type: String, default: 'In Transit' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transfer', transferSchema);