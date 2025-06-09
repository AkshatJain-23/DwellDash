# 🤖 DwellBot RAG Setup Guide

## Overview

DwellBot is an advanced RAG (Retrieval Augmented Generation) based chatbot for DwellDash that uses **free LLM services** to provide intelligent, contextual responses about PG accommodations, bookings, and platform services.

## 🚀 Features

### ✅ **RAG Technology**
- **Knowledge Base**: Comprehensive information about DwellDash services
- **Vector Similarity**: Smart content retrieval based on user queries
- **Context-Aware**: Responses grounded in actual platform data

### ✅ **Free LLM Integration**
- **Primary**: Groq (Free, Fast Inference) - Llama 3 8B model
- **Fallback**: Rule-based responses when LLM is unavailable
- **Alternative Options**: Cohere, Hugging Face, OpenAI (with free tiers)

### ✅ **Advanced Features**
- Real-time response generation
- Rate limiting and abuse protection
- Session management
- Quick suggestions
- Response time tracking
- Error handling and fallbacks

## 🛠️ Installation & Setup

### 1. **Install Dependencies**

```bash
# Backend dependencies
cd server
npm install

# The following packages are added for RAG functionality:
# - groq-sdk: Free LLM API client
# - cohere-ai: Alternative free LLM
# - node-nlp: Natural language processing
# - js-tiktoken: Token counting
# - express-rate-limit: API protection
```

### 2. **Environment Configuration**

Create `server/.env` file:

```env
# AI/RAG Configuration
GROQ_API_KEY=gsk_your_free_groq_api_key_here

# Get your free Groq API key from:
# https://console.groq.com/keys
# - No credit card required
# - Generous free tier
# - Fast inference speeds

# Other configuration...
PORT=5000
NODE_ENV=development
```

### 3. **Get Free Groq API Key**

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up for free (no credit card required)
3. Create a new API key
4. Copy the key to your `.env` file

**Free Tier Limits:**
- 10,000 requests per day
- Multiple model options (Llama 3, Mistral, etc.)
- Ultra-fast inference

## 📊 Knowledge Base Structure

The RAG system uses a comprehensive knowledge base in `server/data/dwellbot-knowledge-base.json`:

```json
{
  "knowledge_base": [
    {
      "id": "property_listing",
      "category": "Property Listing",
      "title": "How to List Your Property",
      "content": "Detailed step-by-step instructions...",
      "keywords": ["list", "property", "owner", "registration"]
    }
  ],
  "faq": [
    {
      "question": "Is DwellDash free for tenants?",
      "answer": "Yes, completely free..."
    }
  ]
}
```

### Knowledge Categories:
- 🏠 Property Listing Process
- 📱 Booking & Search
- 💰 Pricing & Fees
- 🔒 Safety & Verification
- 📞 Customer Support
- 🌍 Service Areas
- ⚙️ Amenities & Facilities
- 💳 Payment Methods
- 📋 Policies & Terms

## 🔧 API Endpoints

### Chat Endpoint
```http
POST /api/chatbot/chat
Content-Type: application/json

{
  "message": "How do I book a PG?",
  "sessionId": "optional_session_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "AI-generated response based on knowledge base",
    "suggestions": ["Follow-up question 1", "Follow-up question 2"],
    "responseTime": 1234,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Other Endpoints
- `GET /api/chatbot/suggestions` - Get conversation starters
- `GET /api/chatbot/facts` - Get platform facts
- `GET /api/chatbot/health` - Health check with RAG status

## 🎯 Integration Guide

### 1. **Replace Existing Chatbot**

Update your main component to use the enhanced RAG chatbot:

```jsx
// Instead of:
import RAGChatbot from './components/RAGChatbot'

// Use:
import EnhancedRAGChatbot from './components/EnhancedRAGChatbot'

function App() {
  return (
    <div>
      {/* Your app content */}
      <EnhancedRAGChatbot />
    </div>
  )
}
```

### 2. **Update Contact Page**

Replace the integrated chatbot in your contact page:

```jsx
import EnhancedRAGChatbot from '../components/EnhancedRAGChatbot'

// In your Contact component:
<EnhancedRAGChatbot />
```

## 🔧 Customization Options

### 1. **Knowledge Base Updates**

Add new information to `server/data/dwellbot-knowledge-base.json`:

```json
{
  "id": "new_feature",
  "category": "New Category",
  "title": "New Feature Description",
  "content": "Detailed information about the new feature...",
  "keywords": ["feature", "new", "functionality"]
}
```

### 2. **LLM Model Selection**

Change the model in `server/services/ragService.js`:

```javascript
const completion = await this.groq.chat.completions.create({
  model: "llama3-8b-8192",        // Fast, good quality
  // model: "llama3-70b-8192",    // Higher quality, slower
  // model: "mixtral-8x7b-32768", // Good balance
  // ... other settings
});
```

### 3. **Response Customization**

Modify the system prompt in `ragService.js`:

```javascript
const systemPrompt = `You are DwellBot, an AI assistant for DwellDash.
Your personality: [Customize here]
Guidelines: [Add your specific guidelines]
...`;
```

## 🛡️ Security & Performance

### Rate Limiting
- **Chatbot**: 30 messages per minute per IP
- **API**: Configurable limits for different endpoints
- **Abuse Protection**: Automatic blocking of spam/abuse

### Error Handling
- **LLM Failures**: Automatic fallback to rule-based responses
- **Network Issues**: Graceful degradation with helpful error messages
- **Timeout Protection**: Prevents hanging requests

### Performance Optimization
- **Response Caching**: Cache similar queries for faster responses
- **Knowledge Base Indexing**: Efficient similarity search
- **Connection Pooling**: Optimized API connections

## 📈 Alternative Free LLM Options

### 1. **Cohere (Free Tier)**
```javascript
// Add to ragService.js
const { CohereClient } = require('cohere-ai');
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});
```

### 2. **Hugging Face (Free)**
```javascript
// Use Hugging Face Inference API
const HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
```

### 3. **Local Models (Ollama)**
```bash
# Install Ollama locally
curl -fsSL https://ollama.ai/install.sh | sh
ollama run llama2
```

## 🚀 Production Deployment

### 1. **Environment Setup**
- Set `NODE_ENV=production`
- Configure production API keys
- Set up monitoring and logging

### 2. **Scaling Considerations**
- Use Redis for session management
- Implement request queuing for high traffic
- Monitor API usage and costs

### 3. **Monitoring**
- Track response times and success rates
- Monitor API usage against free tier limits
- Set up alerts for errors or rate limits

## 📝 Usage Examples

### Property Booking Query
```
User: "How do I book a PG in Bangalore?"
DwellBot: "Booking a PG in Bangalore through DwellDash is simple:
1. Use our search to filter properties in Bangalore
2. Browse verified listings with photos and amenities
3. Contact property owners directly through our platform
4. Schedule a visit to see the property
5. Complete booking through our secure payment system
All our Bangalore properties are verified and safe!"
```

### Pricing Information
```
User: "What are your fees?"
DwellBot: "DwellDash uses a transparent, tenant-friendly pricing model:
- For tenants: Completely FREE (no booking fees, no commission)
- For property owners: Small 2-3% commission only after successful bookings
- No upfront costs, no hidden charges
We only succeed when you succeed!"
```

## 🎯 Benefits Over Traditional Chatbots

### ✅ **Intelligence**
- Understands context and intent
- Provides accurate, relevant information
- Learns from interactions

### ✅ **Scalability**
- Handles unlimited conversation topics
- No need to manually program responses
- Easy to update knowledge base

### ✅ **User Experience**
- Natural conversation flow
- Contextual follow-up questions
- Personalized responses

### ✅ **Maintenance**
- Automatic response generation
- Self-improving through RAG
- Easy knowledge base updates

## 🔮 Future Enhancements

- **Voice Integration**: Speech-to-text and text-to-speech
- **Multi-language Support**: Support for regional Indian languages
- **Advanced Analytics**: Conversation insights and user behavior
- **Integration APIs**: Connect with CRM and booking systems
- **Mobile App SDK**: Native mobile integration

---

## 🆘 Support & Troubleshooting

**Common Issues:**

1. **"API key not working"**
   - Verify Groq API key is correct
   - Check free tier limits haven't been exceeded
   - Ensure `.env` file is properly loaded

2. **"Slow responses"**
   - Check internet connection
   - Consider using faster Groq models
   - Implement response caching

3. **"Fallback responses only"**
   - Check API key configuration
   - Verify knowledge base is loaded
   - Check server logs for errors

**Need Help?**
- 📧 Email: dwelldash3@gmail.com
- 📞 Phone: +91 98765 43210
- 💬 Use DwellBot itself for quick questions!

---

**Ready to revolutionize your customer support with AI? DwellBot is here to help! 🚀** 