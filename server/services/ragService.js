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
  }

  loadKnowledgeBase() {
    try {
      const knowledgeBasePath = path.join(__dirname, '../data/dwellbot-knowledge-base.json');
      const rawData = fs.readFileSync(knowledgeBasePath, 'utf8');
      this.knowledgeBase = JSON.parse(rawData);
      console.log('Knowledge base loaded successfully');
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

  // Simple text similarity using cosine similarity
  calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    // Create word frequency maps
    const freq1 = {};
    const freq2 = {};
    
    words1.forEach(word => freq1[word] = (freq1[word] || 0) + 1);
    words2.forEach(word => freq2[word] = (freq2[word] || 0) + 1);
    
    // Get all unique words
    const allWords = [...new Set([...words1, ...words2])];
    
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

  // Find relevant knowledge based on query
  findRelevantKnowledge(query, topK = 3) {
    const queryLower = query.toLowerCase();
    const relevantItems = [];

    // Search through knowledge base
    for (const item of this.knowledgeBase.knowledge_base) {
      let score = 0;

      // Exact keyword matches
      for (const keyword of item.keywords) {
        if (queryLower.includes(keyword.toLowerCase())) {
          score += 2;
        }
      }

      // Title similarity
      score += this.calculateSimilarity(query, item.title) * 1.5;

      // Content similarity
      score += this.calculateSimilarity(query, item.content) * 1;

      // Category match
      if (queryLower.includes(item.category.toLowerCase())) {
        score += 1;
      }

      if (score > 0.1) {
        relevantItems.push({ ...item, score });
      }
    }

    // Sort by relevance score and return top K
    return relevantItems
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  // Check for FAQ matches
  findRelevantFAQ(query) {
    const queryLower = query.toLowerCase();
    
    for (const faq of this.knowledgeBase.faq) {
      const questionSimilarity = this.calculateSimilarity(query, faq.question);
      if (questionSimilarity > 0.3) {
        return faq;
      }
    }
    return null;
  }

  // Generate response using Groq LLM
  async generateResponse(query, context) {
    try {
      const systemPrompt = `You are DwellBot, an AI assistant for DwellDash - India's trusted PG booking platform. 

Your personality:
- Helpful, friendly, and professional
- Knowledgeable about real estate and PG accommodations
- Focused on DwellDash services
- Concise but informative responses

Guidelines:
- Use the provided context to answer questions accurately
- If asked about topics unrelated to DwellDash, politely redirect to platform services
- Always be helpful and maintain a positive tone
- For specific queries about bookings or properties, provide detailed guidance
- Include relevant contact information when appropriate

Context information:
${context}

Answer the user's question based on this context. Keep responses under 150 words unless detailed explanation is needed.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
        model: "llama3-8b-8192", // Free model on Groq
        temperature: 0.3,
        max_tokens: 200,
        top_p: 1,
        stream: false,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try asking your question differently.";

    } catch (error) {
      console.error('Groq API error:', error);
      // Fallback to rule-based response
      return this.generateFallbackResponse(query, context);
    }
  }

  // Fallback response generation without LLM
  generateFallbackResponse(query, context) {
    const queryLower = query.toLowerCase();

    // Greeting responses
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
      return "Hello! I'm DwellBot, your AI assistant for DwellDash. I can help you with finding PG accommodations, listing properties, pricing information, and platform support. What would you like to know?";
    }

    // Thank you responses
    if (queryLower.includes('thank') || queryLower.includes('thanks')) {
      return "You're welcome! I'm here to help with any questions about DwellDash. Is there anything else you'd like to know about our platform?";
    }

    // Use context if available
    if (context && context.trim()) {
      return `Based on your query about DwellDash: ${context.substring(0, 200)}${context.length > 200 ? '...' : ''}\n\nFor more specific help, please contact our support at dwelldash3@gmail.com or +91 98765 43210.`;
    }

    // Generic helpful response
    return "I can help you with finding PG accommodations, listing properties, pricing information, safety features, and platform support. What specific information are you looking for?";
  }

  // Main chat function
  async chat(userMessage) {
    try {
      const query = userMessage.trim();
      
      if (!query) {
        return "Please ask me a question about DwellDash services.";
      }

      // Check for FAQ match first
      const faqMatch = this.findRelevantFAQ(query);
      if (faqMatch) {
        return faqMatch.answer;
      }

      // Find relevant knowledge
      const relevantKnowledge = this.findRelevantKnowledge(query);
      
      if (relevantKnowledge.length === 0) {
        // Handle irrelevant topics
        const irrelevantTopics = [
          'weather', 'food', 'movie', 'music', 'sports', 'politics', 'news', 'joke', 'game', 
          'recipe', 'travel', 'health', 'fitness', 'fashion', 'entertainment', 'celebrity',
          'technology', 'programming', 'science', 'math', 'history', 'geography'
        ];
        
        const isIrrelevant = irrelevantTopics.some(topic => query.toLowerCase().includes(topic));
        
        if (isIrrelevant) {
          return "I'm specifically designed to help with DwellDash services. I can assist you with finding PG accommodations, listing properties, pricing information, safety features, and platform support. What would you like to know about DwellDash?";
        }
        
        return this.generateFallbackResponse(query, '');
      }

      // Create context from relevant knowledge
      const context = relevantKnowledge
        .map(item => `${item.title}: ${item.content}`)
        .join('\n\n');

      // Generate response using Groq LLM
      const response = await this.generateResponse(query, context);
      
      return response;

    } catch (error) {
      console.error('RAG Service error:', error);
      return "I apologize for the technical difficulty. Please try asking your question again, or contact our support team at dwelldash3@gmail.com for immediate assistance.";
    }
  }

  // Get quick suggestions based on query
  getQuickSuggestions(query) {
    const suggestions = [
      "How do I list my property?",
      "How to book a PG?",
      "What are your fees?",
      "Is DwellDash safe?",
      "Which cities do you cover?",
      "How can I contact support?"
    ];

    // Filter suggestions based on query
    if (query && query.length > 2) {
      const filtered = suggestions.filter(suggestion => 
        !suggestion.toLowerCase().includes(query.toLowerCase().substring(0, 10))
      );
      return filtered.slice(0, 3);
    }

    return suggestions.slice(0, 3);
  }
}

module.exports = new RAGService(); 