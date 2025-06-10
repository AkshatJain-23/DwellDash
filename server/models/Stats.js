const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    required: true,
    default: 0
  },
  totalProperties: {
    type: Number,
    required: true,
    default: 0
  },
  totalCities: {
    type: Number,
    required: true,
    default: 0
  },
  satisfactionRate: {
    type: Number,
    required: true,
    default: 95,
    min: 0,
    max: 100
  },
  monthlyGrowth: {
    users: {
      type: Number,
      default: 0
    },
    properties: {
      type: Number,
      default: 0
    },
    cities: {
      type: Number,
      default: 0
    }
  },
  lastCalculated: {
    type: Date,
    default: Date.now
  },
  isRealTime: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Only keep one stats document at a time
statsSchema.statics.updateStats = async function(newStats) {
  // Remove all existing stats
  await this.deleteMany({});
  
  // Create new stats document
  const stats = new this(newStats);
  return await stats.save();
};

// Get current stats or create default
statsSchema.statics.getCurrentStats = async function() {
  let stats = await this.findOne();
  
  if (!stats) {
    // Create default stats
    stats = new this({
      totalUsers: 5243,
      totalProperties: 2847,
      totalCities: 18,
      satisfactionRate: 94,
      monthlyGrowth: {
        users: 12.5,
        properties: 8.3,
        cities: 2
      }
    });
    await stats.save();
  }
  
  return stats;
};

module.exports = mongoose.model('Stats', statsSchema); 