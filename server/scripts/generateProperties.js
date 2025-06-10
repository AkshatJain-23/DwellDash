const fs = require('fs');
const path = require('path');

// Owner details
const OWNER_DETAILS = {
  id: "1749545921851", // Existing owner ID
  name: "Akshat Jain",
  email: "akshatjain6574@gmail.com",
  phone: "+918426076800"
};

// Indian cities with states
const CITIES_DATA = [
  // Tier 1 Cities
  { city: "Mumbai", state: "Maharashtra", rentMultiplier: 1.5 },
  { city: "Delhi", state: "Delhi", rentMultiplier: 1.4 },
  { city: "Bangalore", state: "Karnataka", rentMultiplier: 1.3 },
  { city: "Hyderabad", state: "Telangana", rentMultiplier: 1.2 },
  { city: "Chennai", state: "Tamil Nadu", rentMultiplier: 1.2 },
  { city: "Kolkata", state: "West Bengal", rentMultiplier: 1.0 },
  { city: "Pune", state: "Maharashtra", rentMultiplier: 1.3 },
  
  // Tier 2 Cities
  { city: "Jaipur", state: "Rajasthan", rentMultiplier: 0.8 },
  { city: "Ahmedabad", state: "Gujarat", rentMultiplier: 0.9 },
  { city: "Surat", state: "Gujarat", rentMultiplier: 0.7 },
  { city: "Lucknow", state: "Uttar Pradesh", rentMultiplier: 0.6 },
  { city: "Kanpur", state: "Uttar Pradesh", rentMultiplier: 0.5 },
  { city: "Nagpur", state: "Maharashtra", rentMultiplier: 0.6 },
  { city: "Indore", state: "Madhya Pradesh", rentMultiplier: 0.6 },
  { city: "Thane", state: "Maharashtra", rentMultiplier: 1.2 },
  { city: "Bhopal", state: "Madhya Pradesh", rentMultiplier: 0.5 },
  { city: "Visakhapatnam", state: "Andhra Pradesh", rentMultiplier: 0.7 },
  { city: "Patna", state: "Bihar", rentMultiplier: 0.4 },
  { city: "Vadodara", state: "Gujarat", rentMultiplier: 0.7 },
  { city: "Ghaziabad", state: "Uttar Pradesh", rentMultiplier: 0.8 },
  { city: "Ludhiana", state: "Punjab", rentMultiplier: 0.6 },
  { city: "Agra", state: "Uttar Pradesh", rentMultiplier: 0.5 },
  { city: "Nashik", state: "Maharashtra", rentMultiplier: 0.6 },
  { city: "Faridabad", state: "Haryana", rentMultiplier: 0.9 },
  { city: "Meerut", state: "Uttar Pradesh", rentMultiplier: 0.5 },
  { city: "Rajkot", state: "Gujarat", rentMultiplier: 0.6 },
  { city: "Kalyan-Dombivli", state: "Maharashtra", rentMultiplier: 1.0 },
  { city: "Vasai-Virar", state: "Maharashtra", rentMultiplier: 0.9 },
  { city: "Varanasi", state: "Uttar Pradesh", rentMultiplier: 0.4 },
  { city: "Srinagar", state: "Jammu and Kashmir", rentMultiplier: 0.5 },
  { city: "Aurangabad", state: "Maharashtra", rentMultiplier: 0.6 },
  { city: "Dhanbad", state: "Jharkhand", rentMultiplier: 0.4 },
  { city: "Amritsar", state: "Punjab", rentMultiplier: 0.5 },
  { city: "Navi Mumbai", state: "Maharashtra", rentMultiplier: 1.3 },
  { city: "Allahabad", state: "Uttar Pradesh", rentMultiplier: 0.4 },
  { city: "Ranchi", state: "Jharkhand", rentMultiplier: 0.5 },
  { city: "Howrah", state: "West Bengal", rentMultiplier: 0.7 },
  { city: "Coimbatore", state: "Tamil Nadu", rentMultiplier: 0.8 },
  { city: "Jabalpur", state: "Madhya Pradesh", rentMultiplier: 0.4 },
  { city: "Gwalior", state: "Madhya Pradesh", rentMultiplier: 0.4 },
  { city: "Vijayawada", state: "Andhra Pradesh", rentMultiplier: 0.6 },
  { city: "Jodhpur", state: "Rajasthan", rentMultiplier: 0.5 },
  { city: "Madurai", state: "Tamil Nadu", rentMultiplier: 0.6 },
  { city: "Raipur", state: "Chhattisgarh", rentMultiplier: 0.4 },
  { city: "Kota", state: "Rajasthan", rentMultiplier: 0.5 },
  { city: "Guwahati", state: "Assam", rentMultiplier: 0.6 },
  { city: "Chandigarh", state: "Chandigarh", rentMultiplier: 0.8 },
  { city: "Solapur", state: "Maharashtra", rentMultiplier: 0.4 },
  { city: "Hubli-Dharwad", state: "Karnataka", rentMultiplier: 0.5 },
  { city: "Bareilly", state: "Uttar Pradesh", rentMultiplier: 0.3 },
  { city: "Moradabad", state: "Uttar Pradesh", rentMultiplier: 0.3 },
  { city: "Mysore", state: "Karnataka", rentMultiplier: 0.6 },
  { city: "Gurgaon", state: "Haryana", rentMultiplier: 1.4 },
  { city: "Aligarh", state: "Uttar Pradesh", rentMultiplier: 0.3 },
  { city: "Jalandhar", state: "Punjab", rentMultiplier: 0.5 },
  { city: "Tiruchirappalli", state: "Tamil Nadu", rentMultiplier: 0.5 },
  { city: "Bhubaneswar", state: "Odisha", rentMultiplier: 0.6 },
  { city: "Salem", state: "Tamil Nadu", rentMultiplier: 0.5 },
  { city: "Warangal", state: "Telangana", rentMultiplier: 0.4 },
  { city: "Mira-Bhayandar", state: "Maharashtra", rentMultiplier: 1.1 },
  { city: "Thiruvananthapuram", state: "Kerala", rentMultiplier: 0.7 },
  { city: "Bhiwandi", state: "Maharashtra", rentMultiplier: 0.8 },
  { city: "Saharanpur", state: "Uttar Pradesh", rentMultiplier: 0.3 },
  { city: "Gorakhpur", state: "Uttar Pradesh", rentMultiplier: 0.3 },
  { city: "Guntur", state: "Andhra Pradesh", rentMultiplier: 0.4 },
  { city: "Bikaner", state: "Rajasthan", rentMultiplier: 0.3 },
  { city: "Amravati", state: "Maharashtra", rentMultiplier: 0.4 },
  { city: "Noida", state: "Uttar Pradesh", rentMultiplier: 1.2 },
  { city: "Jamshedpur", state: "Jharkhand", rentMultiplier: 0.5 },
  { city: "Bhilai", state: "Chhattisgarh", rentMultiplier: 0.4 },
  { city: "Cuttack", state: "Odisha", rentMultiplier: 0.4 },
  { city: "Firozabad", state: "Uttar Pradesh", rentMultiplier: 0.3 },
  { city: "Kochi", state: "Kerala", rentMultiplier: 0.8 },
  { city: "Bhavnagar", state: "Gujarat", rentMultiplier: 0.4 },
  { city: "Dehradun", state: "Uttarakhand", rentMultiplier: 0.6 },
  { city: "Durgapur", state: "West Bengal", rentMultiplier: 0.4 },
  { city: "Asansol", state: "West Bengal", rentMultiplier: 0.4 },
  { city: "Rourkela", state: "Odisha", rentMultiplier: 0.4 },
  { city: "Nanded", state: "Maharashtra", rentMultiplier: 0.3 },
  { city: "Kolhapur", state: "Maharashtra", rentMultiplier: 0.4 },
  { city: "Ajmer", state: "Rajasthan", rentMultiplier: 0.3 },
  { city: "Akola", state: "Maharashtra", rentMultiplier: 0.3 },
  { city: "Gulbarga", state: "Karnataka", rentMultiplier: 0.3 },
  { city: "Jamnagar", state: "Gujarat", rentMultiplier: 0.4 },
  { city: "Ujjain", state: "Madhya Pradesh", rentMultiplier: 0.3 },
  { city: "Loni", state: "Uttar Pradesh", rentMultiplier: 0.4 },
  { city: "Siliguri", state: "West Bengal", rentMultiplier: 0.4 },
  { city: "Jhansi", state: "Uttar Pradesh", rentMultiplier: 0.3 },
  { city: "Ulhasnagar", state: "Maharashtra", rentMultiplier: 0.8 },
  { city: "Jammu", state: "Jammu and Kashmir", rentMultiplier: 0.4 },
  { city: "Sangli-Miraj & Kupwad", state: "Maharashtra", rentMultiplier: 0.4 },
  { city: "Mangalore", state: "Karnataka", rentMultiplier: 0.6 },
  { city: "Erode", state: "Tamil Nadu", rentMultiplier: 0.4 },
  { city: "Belgaum", state: "Karnataka", rentMultiplier: 0.4 },
  { city: "Ambattur", state: "Tamil Nadu", rentMultiplier: 0.7 },
  { city: "Tirunelveli", state: "Tamil Nadu", rentMultiplier: 0.4 },
  { city: "Malegaon", state: "Maharashtra", rentMultiplier: 0.3 },
  { city: "Gaya", state: "Bihar", rentMultiplier: 0.2 },
  { city: "Jalgaon", state: "Maharashtra", rentMultiplier: 0.3 },
  { city: "Udaipur", state: "Rajasthan", rentMultiplier: 0.5 },
  { city: "Maheshtala", state: "West Bengal", rentMultiplier: 0.5 }
];

const PROPERTY_TYPES = ['single-room', 'shared-room', 'flat', 'hostel'];
const GENDER_PREFERENCES = ['male', 'female', 'any'];
const AMENITIES = [
  'wifi', 'ac', 'meals', 'laundry', 'parking', 'security', 
  'gym', 'swimming-pool', 'power-backup', 'shuttle', 
  'housekeeping', 'study-area', 'cctv', 'biometric'
];

// Property titles templates
const PROPERTY_TITLES = [
  "Comfortable PG for Working Professionals",
  "Luxurious PG Accommodation",
  "Budget-Friendly PG for Students",
  "Premium PG with Modern Amenities",
  "Spacious PG near IT Hub",
  "Cozy PG in Prime Location",
  "Modern PG for Young Professionals",
  "Executive PG with All Facilities",
  "Affordable PG near Metro Station",
  "Deluxe PG with Home-like Environment",
  "Fully Furnished PG Accommodation",
  "Safe and Secure PG for Girls",
  "Boys PG with Excellent Facilities",
  "Co-living Space with Modern Amenities",
  "PG near University Campus",
  "Corporate PG for IT Professionals",
  "Family-like PG Environment",
  "Hostel-style Accommodation",
  "Private Room PG Facility",
  "Shared Accommodation for Students"
];

const DESCRIPTIONS = [
  "Spacious and well-furnished PG accommodation perfect for working professionals. Located in a prime area with easy access to IT companies, restaurants, and shopping centers.",
  "Luxurious PG facility with world-class amenities including swimming pool, gym, and recreational facilities. Perfect for those who seek comfort and convenience.",
  "Budget-friendly PG accommodation designed for students and young professionals. Clean, safe, and well-maintained with all basic amenities.",
  "Premium PG accommodation featuring modern amenities, 24/7 security, housekeeping services, and nutritious home-cooked meals.",
  "Modern PG facility strategically located near major IT hubs and business districts. Perfect for working professionals with easy commute options.",
  "Cozy and comfortable PG accommodation in a residential area. Features include WiFi, AC, meals, laundry, and round-the-clock security.",
  "Executive-level PG accommodation with premium amenities including gym, swimming pool, power backup, and shuttle service to major locations.",
  "Safe and secure accommodation exclusively designed for the comfort and safety of residents. Features CCTV surveillance and biometric access.",
  "Affordable yet comfortable PG accommodation near metro station and major transportation hubs. Ideal for budget-conscious professionals.",
  "Home-like environment with caring staff and nutritious meals. Perfect for those who want to feel at home while away from family.",
  "Fully furnished accommodation with modern amenities including high-speed internet, power backup, and housekeeping services.",
  "Specially designed accommodation with enhanced security features, separate entry, and female staff for added comfort and safety.",
  "Well-maintained accommodation with all modern facilities including gym, recreational area, and study rooms for focused learning.",
  "Contemporary co-living space with shared common areas, modern kitchen, and recreational facilities for a vibrant community living experience.",
  "Conveniently located near major educational institutions with study-friendly environment and academic support facilities.",
  "Corporate-grade accommodation with high-speed internet, conference rooms, and shuttle services to major IT parks and business centers.",
  "Experience the warmth of family-like environment with caring management, home-cooked food, and friendly community atmosphere.",
  "Hostel-style accommodation with shared facilities and economical pricing. Perfect for students and budget-conscious individuals.",
  "Private room accommodation offering personal space and privacy while enjoying the benefits of community living and shared amenities.",
  "Shared accommodation perfect for students with study rooms, library access, and group study areas for collaborative learning."
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, min = 2, max = 6) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  return shuffled.slice(0, count);
}

function generateAddress(city, state) {
  const sectors = ['Sector 1', 'Sector 2', 'Block A', 'Block B', 'Phase 1', 'Phase 2'];
  const areas = ['IT Park', 'City Center', 'Mall Road', 'Station Road', 'Main Market', 'University Area'];
  const numbers = Math.floor(Math.random() * 999) + 1;
  
  return `${numbers} ${getRandomElement(areas)}, ${getRandomElement(sectors)}, ${city}, ${state}`;
}

function generateProperty(cityData, index) {
  const propertyType = getRandomElement(PROPERTY_TYPES);
  const gender = getRandomElement(GENDER_PREFERENCES);
  const amenities = getRandomElements(AMENITIES);
  
  // Base rent varies by property type
  let baseRent;
  switch (propertyType) {
    case 'single-room': baseRent = Math.floor(Math.random() * 8000) + 12000; break;
    case 'shared-room': baseRent = Math.floor(Math.random() * 5000) + 8000; break;
    case 'flat': baseRent = Math.floor(Math.random() * 12000) + 15000; break;
    case 'hostel': baseRent = Math.floor(Math.random() * 4000) + 5000; break;
  }
  
  // Apply city multiplier
  const rent = Math.floor(baseRent * cityData.rentMultiplier);
  const deposit = Math.floor(rent * (1.5 + Math.random()));
  
  // Generate available date (within next 3 months)
  const availableDate = new Date();
  availableDate.setDate(availableDate.getDate() + Math.floor(Math.random() * 90));
  
  return {
    id: (Date.now() + index).toString(),
    title: `${getRandomElement(PROPERTY_TITLES)} in ${cityData.city}`,
    description: getRandomElement(DESCRIPTIONS),
    rent: rent,
    deposit: deposit,
    city: cityData.city,
    address: generateAddress(cityData.city, cityData.state),
    propertyType: propertyType,
    gender: gender,
    amenities: amenities,
    images: [], // No images for bulk generation
    contactPhone: OWNER_DETAILS.phone,
    availableFrom: availableDate.toISOString().split('T')[0],
    ownerId: OWNER_DETAILS.id,
    createdAt: new Date().toISOString(),
    isActive: true
  };
}

function generateProperties(count = 100) {
  const properties = [];
  
  for (let i = 0; i < count; i++) {
    const cityData = getRandomElement(CITIES_DATA);
    const property = generateProperty(cityData, i);
    properties.push(property);
    
    // Add some delay to ensure unique timestamps
    if (i % 10 === 0) {
      console.log(`Generated ${i + 1}/${count} properties...`);
    }
  }
  
  return properties;
}

// Generate properties
console.log('Starting property generation...');
const newProperties = generateProperties(120); // Generate 120 properties

// Read existing properties
const propertiesFile = path.join(__dirname, '../data/properties.json');
let existingProperties = [];

try {
  if (fs.existsSync(propertiesFile)) {
    const data = JSON.parse(fs.readFileSync(propertiesFile, 'utf8'));
    existingProperties = Array.isArray(data) ? data : (data.properties || []);
  }
} catch (error) {
  console.error('Error reading existing properties:', error);
}

// Combine with existing properties
const allProperties = [...existingProperties, ...newProperties];

// Write back to file
try {
  fs.writeFileSync(propertiesFile, JSON.stringify(allProperties, null, 2));
  console.log(`✅ Successfully generated and saved ${newProperties.length} new properties!`);
  console.log(`📊 Total properties in database: ${allProperties.length}`);
  console.log(`🏙️ Cities covered: ${[...new Set(newProperties.map(p => p.city))].length}`);
  console.log(`🏠 Property types: ${[...new Set(newProperties.map(p => p.propertyType))].join(', ')}`);
  console.log(`💰 Rent range: ₹${Math.min(...newProperties.map(p => p.rent)).toLocaleString()} - ₹${Math.max(...newProperties.map(p => p.rent)).toLocaleString()}`);
} catch (error) {
  console.error('Error saving properties:', error);
} 