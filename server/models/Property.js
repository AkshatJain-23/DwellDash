const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'condo', 'studio', 'room', 'pg', 'hostel', 'flat', 'single-room', 'shared-room']
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  furnished: {
    type: Boolean,
    default: false
  },
  parking: {
    type: Boolean,
    default: false
  },
  petFriendly: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String,
    trim: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
propertySchema.index({ city: 1, available: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

// Virtual for property location
propertySchema.virtual('fullAddress').get(function() {
  return `${this.address}, ${this.city}, ${this.state} ${this.zipCode}`;
});

// Virtual for property summary
propertySchema.virtual('summary').get(function() {
  return {
    id: this._id,
    title: this.title,
    price: this.price,
    type: this.type,
    bedrooms: this.bedrooms,
    bathrooms: this.bathrooms,
    area: this.area,
    city: this.city,
    available: this.available
  };
});

module.exports = mongoose.model('Property', propertySchema); 