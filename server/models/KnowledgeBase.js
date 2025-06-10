const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  keywords: [{
    type: String,
    index: true
  }],
  active: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    index: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  active: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
knowledgeBaseSchema.index({ category: 1, active: 1 });
knowledgeBaseSchema.index({ keywords: 1, active: 1 });
knowledgeBaseSchema.index({ title: 'text', content: 'text' });

faqSchema.index({ question: 'text', answer: 'text' });
faqSchema.index({ category: 1, active: 1 });

const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = { KnowledgeBase, FAQ }; 