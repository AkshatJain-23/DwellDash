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

  // Enhanced knowledge finding with better keyword matching
  findRelevantKnowledge(query, topK = 3) {
    const queryLower = query.toLowerCase();
    const relevantItems = [];

    // Expand query with synonyms for better matching
    const expandedQuery = this.expandQueryWithSynonyms(queryLower);

    // Search through knowledge base
    for (const item of this.knowledgeBase.knowledge_base) {
      let score = 0;

      // Enhanced keyword matching
      for (const keyword of item.keywords) {
        const keywordLower = keyword.toLowerCase();
        if (expandedQuery.includes(keywordLower)) {
          score += 3; // Higher weight for keyword matches
        }
        // Partial keyword matching
        if (expandedQuery.split(' ').some(word => word.includes(keywordLower) || keywordLower.includes(word))) {
          score += 1.5;
        }
      }

      // Title similarity with boosted weight
      score += this.calculateSimilarity(expandedQuery, item.title.toLowerCase()) * 2;

      // Content similarity
      score += this.calculateSimilarity(expandedQuery, item.content.toLowerCase()) * 1.2;

      // Category match with partial matching
      const categoryLower = item.category.toLowerCase();
      if (expandedQuery.includes(categoryLower) || categoryLower.includes('booking') && expandedQuery.includes('book')) {
        score += 1.5;
      }

      // Lower threshold for better coverage
      if (score > 0.05) {
        relevantItems.push({ ...item, score });
      }
    }

    // Sort by relevance score and return top K
    return relevantItems
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  // Add synonyms to improve query matching
  expandQueryWithSynonyms(query) {
    const synonyms = {
      'book': ['reserve', 'rent', 'find'],
      'list': ['add', 'post', 'upload'],
      'price': ['cost', 'fee', 'charge', 'rate'],
      'safe': ['secure', 'trust', 'verify'],
      'help': ['support', 'assist', 'contact'],
      'pg': ['accommodation', 'room', 'place'],
      'owner': ['landlord', 'property owner'],
      'tenant': ['renter', 'student']
    };

    let expandedQuery = query;
    for (const [word, syns] of Object.entries(synonyms)) {
      if (query.includes(word)) {
        expandedQuery += ' ' + syns.join(' ');
      }
    }
    return expandedQuery;
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

  // Enhanced fallback response generation
  generateFallbackResponse(query, context) {
    const queryLower = query.toLowerCase();

    // Greeting responses
    if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey') || queryLower.includes('good morning') || queryLower.includes('good evening')) {
      return "Hello! I'm DwellBot, your AI assistant for DwellDash. I can help you with finding PG accommodations, listing properties, pricing information, and platform support. What would you like to know?";
    }

    // Thank you responses
    if (queryLower.includes('thank') || queryLower.includes('thanks') || queryLower.includes('appreciate')) {
      return "You're welcome! I'm here to help with any questions about DwellDash. Is there anything else you'd like to know about our platform?";
    }

    // Booking related queries
    if (queryLower.includes('book') || queryLower.includes('reserve') || queryLower.includes('rent')) {
      return "To book a PG on DwellDash: 1) Search properties using our filters, 2) Browse verified listings with photos and reviews, 3) Contact property owners directly, 4) Schedule property visits, 5) Complete booking through our secure payment system. It's completely free for tenants! Need help with a specific step?";
    }

    // Listing property queries
    if (queryLower.includes('list') || queryLower.includes('add property') || queryLower.includes('owner')) {
      return "To list your property: 1) Register as a property owner at dwelldash.com/register, 2) Complete profile verification, 3) Add property details with high-quality photos, 4) Set pricing and availability, 5) Submit for verification. Our team reviews within 24-48 hours. Small 2-3% commission only after successful bookings!";
    }

    // Pricing queries
    if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('fee') || queryLower.includes('charge')) {
      return "DwellDash is completely FREE for tenants - no registration fees, booking charges, or hidden costs! For property owners, we charge only 2-3% commission after successful bookings. No upfront costs or listing fees. Transparent pricing for everyone!";
    }

    // Safety and verification
    if (queryLower.includes('safe') || queryLower.includes('verify') || queryLower.includes('trust') || queryLower.includes('secure')) {
      return "DwellDash ensures safety through: ✅ Comprehensive property verification, ✅ Document and background checks, ✅ Physical property inspection, ✅ Secure payment processing, ✅ 24/7 customer support, ✅ Review and rating system. Your safety is our top priority!";
    }

    // Location queries
    if (queryLower.includes('city') || queryLower.includes('location') || queryLower.includes('area') || queryLower.includes('where')) {
      return "DwellDash operates in 50+ cities across India including Delhi NCR, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Kolkata, Ahmedabad, and many more! We're constantly expanding. If your city isn't listed, contact dwelldash3@gmail.com to request expansion.";
    }

    // Contact and support
    if (queryLower.includes('contact') || queryLower.includes('support') || queryLower.includes('help') || queryLower.includes('phone') || queryLower.includes('email')) {
      return "Contact DwellDash Support:\n📧 Email: dwelldash3@gmail.com\n📞 Phone: +91 84260 76800 (Mon-Sat, 9 AM-8 PM)\n💬 Live Chat: Available 24/7 through this bot\n🏢 Offices: Gurgaon, Bangalore, Mumbai\nAverage response time: 2 hours for urgent issues.";
    }

    // Payment queries
    if (queryLower.includes('payment') || queryLower.includes('pay') || queryLower.includes('refund') || queryLower.includes('deposit')) {
      return "Payment Options: UPI, Net Banking, Credit/Debit Cards, Digital Wallets. All payments are secure with 256-bit SSL encryption. Refund Policy: Full refund 7+ days before move-in, 50% refund 3-7 days before, no refund within 3 days. Security deposits refunded within 7-14 days after checkout.";
    }

    // Amenities queries
    if (queryLower.includes('amenity') || queryLower.includes('facility') || queryLower.includes('wifi') || queryLower.includes('food') || queryLower.includes('meal')) {
      return "DwellDash properties offer: WiFi, AC, attached bathrooms, 24/7 security, power backup, kitchens, laundry, parking, study rooms, gym access, home-cooked meals, and more! Use our advanced filters to find properties with your preferred amenities.";
    }

    // Use context if available
    if (context && context.trim()) {
      return `Based on your query: ${context.substring(0, 250)}${context.length > 250 ? '...' : ''}\n\nFor more detailed information, contact our support at dwelldash3@gmail.com or +91 84260 76800.`;
    }

    // Enhanced generic response with examples
    return "I can help you with:\n🏠 Finding PG accommodations\n📝 Listing your property\n💰 Pricing and fees information\n🔒 Safety and verification\n📞 Customer support\n💳 Payment options\n\nTry asking: 'How to book a PG?', 'How to list property?', 'Is DwellDash safe?', 'What are your fees?'";
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
      
      // Always try fallback first for better coverage
      const fallbackResponse = this.generateFallbackResponse(query, '');
      
      // If fallback handled the query (not the generic response), use it
      if (!fallbackResponse.includes("I can help you with:")) {
        return fallbackResponse;
      }
      
      if (relevantKnowledge.length === 0) {
        // Handle clearly irrelevant topics
        const irrelevantTopics = [
          'weather forecast', 'cooking recipe', 'movie review', 'music download', 'sports score', 
          'political news', 'breaking news', 'tell me a joke', 'play a game', 'celebrity gossip',
          'programming code', 'math problem', 'history lesson', 'geography quiz'
        ];
        
        const isIrrelevant = irrelevantTopics.some(topic => query.toLowerCase().includes(topic));
        
        if (isIrrelevant) {
          return "I'm specifically designed to help with DwellDash services. I can assist you with finding PG accommodations, listing properties, pricing information, safety features, and platform support. What would you like to know about DwellDash?";
        }
        
        // For any other query, try to be helpful with general DwellDash info
        return "I'd be happy to help you with DwellDash services! Here's what I can assist with:\n\n🏠 **Finding PG Accommodations**: Search and book verified properties\n📝 **Listing Properties**: Help property owners get started\n💰 **Pricing Information**: Transparent fee structure\n🔒 **Safety & Verification**: Our security measures\n📞 **Customer Support**: Get help when you need it\n\nWhat specific aspect of DwellDash would you like to know more about?";
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
      return "I apologize for the technical difficulty. Please try asking your question again, or contact our support team at dwelldash3@gmail.com or +91 84260 76800 for immediate assistance.";
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