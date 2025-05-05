const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true,
    enum: ['web-development', 'video-editing', 'digital-marketing', 'branding', 'consultation', 'other']
  },
  message: String,
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'new',
    enum: ['new', 'contacted', 'in-progress', 'completed']
  }
});

module.exports = mongoose.model('Contact', contactSchema);