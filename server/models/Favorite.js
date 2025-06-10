const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one favorite per user per property
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

// Index for efficient querying
favoriteSchema.index({ user: 1 });
favoriteSchema.index({ property: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema); 