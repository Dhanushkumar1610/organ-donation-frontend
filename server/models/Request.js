const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedBy: { type: String, required: true },
  organ: { type: String, required: true },
  urgency: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  description: { type: String },
  date: { type: Date, default: Date.now },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
});

module.exports = mongoose.model('Request', requestSchema);