const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorName: { type: String, required: true },
  organ: { type: String, required: true },
  status: { type: String, default: 'Stored' },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Donation', donationSchema);