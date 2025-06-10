const Groq = require('groq-sdk');
const { NlpManager } = require('node-nlp');
const fs = require('fs');
const path = require('path');

class RAGService {
  constructor() {
    // Initialize Groq client (free tier)
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'gsk_demo_key', // Use demo for development
    });

    // Initialize NLP manager for text processing
    this.nlpManager = new NlpManager({ languages: ['en'], forceNER: true });
    
    // Load knowledge base
    this.loadKnowledgeBase();
    
    // Initialize embeddings cache
    this.embeddingsCache = new Map();

    // Enhanced category weights for better relevance
    this.categoryWeights = {
      'Getting Started': 1.5,
      'Safety & Security': 1.4,
      'Booking Process': 1.3,
      'Customer Support': 1.3,
      'Property Listing': 1.2,
      'Learning Resources': 1.2,
      'Contact Information': 1.1,
      'Company Information': 1.0,
      'Privacy & Cookies': 0.9,
      'Policies': 0.8
    };
  }

  loadKnowledgeBase() {
    try {
      const knowledgeBasePath = path.join(__dirname, '../data/dwellbot-knowledge-base.json');
      const rawData = fs.readFileSync(knowledgeBasePath, 'utf8');
      this.knowledgeBase = JSON.parse(rawData);
      console.log(`Knowledge base loaded successfully with ${this.knowledgeBase.knowledge_base.length} items`);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      // Fallback knowledge base
      this.knowledgeBase = {
        knowledge_base: [
          {
            id: "fallback",
            category: "General",
            title: "DwellDash Information",
            content: "DwellDash is India's trusted PG booking platform. We help you find verified accommodations with zero brokerage for tenants.",
            keywords: ["dwelldash", "pg", "accommodation", "booking"]
          }
        ],
        faq: [],
        quick_responses: ["I can help you with DwellDash services."]
      };
    }
  }

  // Enhanced text similarity with better preprocessing
  calculateSimilarity(text1, text2) {
    // Normalize text
    const normalize = (text) => text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words1 = normalize(text1).split(' ').filter(word => word.length > 2);
    const words2 = normalize(text2).split(' ').filter(word => word.length > 2);
    
    // Create word frequency maps
    const freq1 = {};
    const freq2 = {};
    
    words1.forEach(word => freq1[word] = (freq1[word] || 0) + 1);
    words2.forEach(word => freq2[word] = (freq2[word] || 0) + 1);
    
    // Get all unique words
    const allWords = [...new Set([...words1, ...words2])];
    
    if (allWords.length === 0) return 0;
    
    // Create vectors
    const vector1 = allWords.map(word => freq1[word] || 0);
    const vector2 = allWords.map(word => freq2[word] || 0);
    
    // Calculate cosine similarity
    const dotProduct = vector1.reduce((sum, a, i) => sum + a * vector2[i], 0);
    const magnitude1 = Math.sqrt(vector1.reduce((sum, a) => sum + a * a, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, a) => sum + a * a, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }

  // Enhanced intent detection
  detectIntent(query) {
    const queryLower = query.toLowerCase();
    
    // Common intent patterns
    const intents = {
      'getting_started': ['how to start', 'new user', 'begin', 'getting started', 'first time', 'beginner'],
      'search_help': ['how to search', 'find property', 'filters', 'search tips'],
      'booking': ['how to book', 'booking process', 'reserve', 'rent'],
      'safety': ['safety', 'secure', 'protection', 'verification', 'emergency'],
      'support': ['help', 'contact', 'support', 'problem', 'issue', 'assistance'],
      'pricing': ['cost', 'price', 'fee', 'charge', 'free', 'commission'],
      'refund': ['refund', 'cancel', 'money back', 'cancellation'],
      'about': ['about', 'company', 'story', 'mission', 'team'],
      'tutorials': ['tutorial', 'guide', 'learn', 'video', 'how to']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) {
          return intent;
        }
      }
    }
    return 'general';
  }

  // Find relevant knowledge based on query with enhanced scoring
  findRelevantKnowledge(query, topK = 5) {
    const queryLower = query.toLowerCase();
    const intent = this.detectIntent(query);
    const relevantItems = [];

    // Search through knowledge base
    for (const item of this.knowledgeBase.knowledge_base) {
      let score = 0;

      // Base category weight
      const categoryWeight = this.categoryWeights[item.category] || 1.0;
      
      // Exact keyword matches (weighted heavily)
      for (const keyword of item.keywords) {
        if (queryLower.includes(keyword.toLowerCase())) {
          score += 3 * categoryWeight;
        }
      }

      // Intent-based scoring
      if (intent === 'getting_started' && item.category === 'Getting Started') score += 2;
      if (intent === 'safety' && item.category === 'Safety & Security') score += 2;
      if (intent === 'support' && item.category === 'Customer Support') score += 2;
      if (intent === 'booking' && item.category === 'Booking Process') score += 2;
      if (intent === 'tutorials' && item.category === 'Learning Resources') score += 2;

      // Title similarity (high weight)
      score += this.calculateSimilarity(query, item.title) * 2 * categoryWeight;

      // Content similarity (medium weight)
      score += this.calculateSimilarity(query, item.content) * 1.2 * categoryWeight;

      // Category name match
      if (queryLower.includes(item.category.toLowerCase())) {
        score += 1.5 * categoryWeight;
      }

      // Boost score for comprehensive content
      if (item.content.length > 500) {
        score += 0.3;
      }

      if (score > 0.1) {
        relevantItems.push({ ...item, score, intent });
      }
    }

    // Sort by relevance score and return top K
    return relevantItems
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  // Enhanced FAQ matching
  findRelevantFAQ(query) {
    const queryLower = query.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;
    
    for (const faq of this.knowledgeBase.faq) {
      // Check for exact phrase matches
      if (queryLower.includes(faq.question.toLowerCase().substring(0, 20))) {
        return faq;
      }

      const questionSimilarity = this.calculateSimilarity(query, faq.question);
      const answerSimilarity = this.calculateSimilarity(query, faq.answer) * 0.5;
      const totalScore = questionSimilarity + answerSimilarity;

      if (totalScore > bestScore && totalScore > 0.3) {
        bestScore = totalScore;
        bestMatch = faq;
      }
    }
    
    return bestMatch;
  }

  // Build enhanced context from relevant knowledge
  buildContext(relevantItems, faq = null) {
    let context = '';
    
    if (faq) {
      context += `FAQ: Q: ${faq.question} A: ${faq.answer}\n\n`;
    }

    if (relevantItems.length > 0) {
      context += 'Relevant Information:\n';
      relevantItems.forEach((item, index) => {
        context += `${index + 1}. ${item.title} (${item.category}):\n${item.content}\n\n`;
      });
    }

    return context.trim();
  }

  // Generate response using Groq LLM with enhanced prompting
  async generateResponse(query, context, intent = 'general') {
    try {
      const systemPrompt = `You are DwellBot, an AI assistant for DwellDash - India's trusted PG booking platform. 

Your personality:
- Helpful, friendly, and professional
- Knowledgeable about real estate and PG accommodations
- Focused on DwellDash services
- Concise but informative responses
- Empathetic to user concerns, especially safety and first-time users

Guidelines:
- Use the provided context to answer questions accurately
- For new users, be extra helpful and guide them to Getting Started resources
- For safety concerns, prioritize comprehensive information and emergency contacts
- If asked about topics unrelated to DwellDash, politely redirect to platform services
- Always maintain a positive tone and be solution-oriented
- For specific queries about bookings or properties, provide detailed guidance
- Include relevant contact information when appropriate (dwelldash3@gmail.com, +91 8426076800)
- Mention specific pages/resources when relevant (e.g., "Check our Safety Guidelines page")

Context information:
${context}

User intent detected: ${intent}

Answer the user's question based on this context. Keep responses under 200 words unless detailed explanation is needed. Be conversational and helpful.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        model: "llama3-8b-8192", // Free model on Groq
        temperature: 0.4,
        max_tokens: 300,
        top_p: 1,
        stream: false,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try asking your question differently.";

    } catch (error) {
      console.error('Groq API error:', error);
      // Fallback to rule-based response
      return this.generateFallbackResponse(query, context, intent);
    }
  }

  // Enhanced fallback response generation
  generateFallbackResponse(query, context, intent = 'general') {
    const queryLower = query.toLowerCase();

    // Intent-based responses
    if (intent === 'getting_started') {
      return "Welcome to DwellDash! As a new user, I recommend following our 6-step Getting Started Guide: 1) Create account, 2) Search properties, 3) Browse & compare, 4) Contact owners, 5) Visit properties, 6) Book your PG. Check our Getting Started Guide page for detailed instructions. Need help? Contact us at dwelldash3@gmail.com or +91 8426076800.";
    }

    if (intent === 'safety') {
      return "Your safety is our priority! DwellDash provides comprehensive safety through property verification, owner background checks, 24/7 support, and detailed Safety Guidelines. For emergencies, call +91 8426076800 immediately. Visit our Safety Guidelines page for complete security measures and tips.";
    }

    if (intent === 'support') {
      return "I'm here to help! DwellDash offers multiple support options: Email dwelldash3@gmail.com (2-hour response for urgent issues), Phone +91 8426076800 (24/7 emergency, business hours Mon-Sat 9AM-8PM), and this AI chat 24/7. What specific help do you need?";
    }

    // Greeting responses
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      return "Hello! I'm DwellBot, your AI assistant for DwellDash. I can help you with finding PG accommodations, safety guidelines, platform tutorials, booking assistance, and more. New to DwellDash? Check our Getting Started Guide! What can I help you with today?";
    }

    // Thank you responses
    if (queryLower.includes('thank') || queryLower.includes('thanks')) {
      return "You're very welcome! I'm always here to help with DwellDash services. Whether you need help with property search, safety tips, or platform guidance, just ask! Is there anything else you'd like to know?";
    }

    // Use context if available
    if (context && context.trim()) {
      return `Based on your query: ${context.substring(0, 250)}${context.length > 250 ? '...' : ''}\n\nFor more detailed assistance, visit our Help Center or contact support at dwelldash3@gmail.com or +91 8426076800.`;
    }

    // Enhanced generic helpful response
    return "I can help you with finding PG accommodations, safety guidelines, getting started guides, video tutorials, booking assistance, pricing information, and platform support. Try asking about specific topics like 'how to get started', 'safety tips', or 'how to book a PG'. What would you like to know?";
  }

  // Main chat function with enhanced processing
  async chat(userMessage) {
    try {
      const query = userMessage.trim();
      
      if (!query) {
        return "Please ask me a question about DwellDash services. I can help with getting started, safety tips, property search, booking guidance, and more!";
      }

      // Detect intent
      const intent = this.detectIntent(query);

      // Find relevant FAQ first
      const relevantFAQ = this.findRelevantFAQ(query);

      // Find relevant knowledge with higher limit for complex queries
      const topK = query.length > 50 ? 5 : 3;
      const relevantKnowledge = this.findRelevantKnowledge(query, topK);

      // Build context
      const context = this.buildContext(relevantKnowledge, relevantFAQ);

      // Generate response
      if (context) {
        const response = await this.generateResponse(query, context, intent);
        
        // Add helpful suggestions for specific intents
        let suggestions = this.getQuickSuggestions(intent);
        if (suggestions.length > 0) {
          return response + '\n\n' + suggestions;
        }
        
        return response;
      } else {
        // No relevant context found, provide general guidance
        return this.generateFallbackResponse(query, '', intent);
      }

    } catch (error) {
      console.error('Chat error:', error);
      return "I apologize, but I'm experiencing some technical difficulties. Please try again or contact our support team at dwelldash3@gmail.com or +91 8426076800 for immediate assistance.";
    }
  }

  // Enhanced quick suggestions based on intent
  getQuickSuggestions(intent) {
    const suggestions = {
      'getting_started': "💡 Quick tip: Start by visiting our Getting Started Guide page for a complete walkthrough!",
      'safety': "🔒 For detailed safety information, check our Safety Guidelines page.",
      'tutorials': "📚 Explore our Video Tutorials page for step-by-step visual guides.",
      'booking': "📋 Need booking help? Our Getting Started Guide covers the complete process.",
      'support': "📞 For urgent issues, call +91 8426076800 anytime."
    };

    return suggestions[intent] || '';
  }

  // Get contextual quick responses
  getQuickResponses() {
    return this.knowledgeBase.quick_responses || [
      "I can help you with DwellDash services!"
    ];
  }

  // Get knowledge base stats
  getStats() {
    return {
      totalKnowledgeItems: this.knowledgeBase.knowledge_base.length,
      totalFAQs: this.knowledgeBase.faq.length,
      categories: [...new Set(this.knowledgeBase.knowledge_base.map(item => item.category))]
    };
  }
}

module.exports = RAGService; 