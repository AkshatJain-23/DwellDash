const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Sample users
const sampleUsers = [
  {
    id: "1",
    name: "John Owner",
    email: "owner@test.com",
    password: bcrypt.hashSync("password123", 10),
    role: "owner",
    phone: "+91 98765 43210",
    createdAt: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Jane Tenant",
    email: "tenant@test.com",
    password: bcrypt.hashSync("password123", 10),
    role: "tenant",
    phone: "+91 87654 32109",
    createdAt: new Date().toISOString()
  }
];

// Sample properties
const sampleProperties = [
  {
    id: "1",
    title: "Comfortable PG for Working Professionals in Koramangala",
    description: "Spacious and well-furnished PG accommodation perfect for working professionals. Located in the heart of Koramangala with easy access to IT companies, restaurants, and shopping centers. The property offers modern amenities including high-speed WiFi, AC rooms, and nutritious meals.",
    rent: 15000,
    deposit: 30000,
    city: "Bangalore",
    address: "123 Koramangala 5th Block, Near Forum Mall, Bangalore, Karnataka 560095",
    propertyType: "single-room",
    gender: "any",
    amenities: ["wifi", "ac", "meals", "laundry", "parking", "security"],
    images: [],
    contactPhone: "+91 98765 43210",
    availableFrom: "2024-01-15",
    ownerId: "1",
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "2",
    title: "Premium Ladies PG in Bandra West",
    description: "Exclusive ladies-only PG accommodation in prime Bandra West location. Features include fully furnished rooms, 24/7 security, housekeeping services, and home-cooked meals. Walking distance to Bandra station and major corporate offices.",
    rent: 25000,
    deposit: 50000,
    city: "Mumbai",
    address: "456 Bandra West, Near Linking Road, Mumbai, Maharashtra 400050",
    propertyType: "shared-room",
    gender: "female",
    amenities: ["wifi", "ac", "meals", "laundry", "security", "housekeeping"],
    images: [],
    contactPhone: "+91 98765 43211",
    availableFrom: "2024-02-01",
    ownerId: "1",
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "3",
    title: "Budget-Friendly PG for Students in Lajpat Nagar",
    description: "Affordable PG accommodation designed for students and young professionals. Located near Delhi University and metro station. Includes basic amenities like WiFi, meals, and study area. Perfect for those looking for economical housing options.",
    rent: 8000,
    deposit: 16000,
    city: "Delhi",
    address: "789 Lajpat Nagar II, Near Metro Station, New Delhi, Delhi 110024",
    propertyType: "shared-room",
    gender: "male",
    amenities: ["wifi", "meals", "study-area", "security"],
    images: [],
    contactPhone: "+91 98765 43212",
    availableFrom: "2024-01-20",
    ownerId: "1",
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "4",
    title: "Luxury PG with Swimming Pool in Anna Nagar",
    description: "Premium PG accommodation with world-class amenities including swimming pool, gym, and recreational facilities. Located in upscale Anna Nagar with easy access to IT corridor and shopping malls. Perfect for professionals seeking luxury living.",
    rent: 20000,
    deposit: 40000,
    city: "Chennai",
    address: "321 Anna Nagar West, Near Express Avenue Mall, Chennai, Tamil Nadu 600040",
    propertyType: "single-room",
    gender: "any",
    amenities: ["wifi", "ac", "meals", "gym", "swimming-pool", "parking", "security"],
    images: [],
    contactPhone: "+91 98765 43213",
    availableFrom: "2024-02-15",
    ownerId: "1",
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "5",
    title: "Modern PG for IT Professionals in Hinjewadi",
    description: "State-of-the-art PG facility designed specifically for IT professionals working in Hinjewadi IT Park. Features include high-speed internet, power backup, modern kitchen, and shuttle service to major IT companies.",
    rent: 12000,
    deposit: 24000,
    city: "Pune",
    address: "654 Hinjewadi Phase 1, Near Rajiv Gandhi Infotech Park, Pune, Maharashtra 411057",
    propertyType: "single-room",
    gender: "any",
    amenities: ["wifi", "ac", "meals", "shuttle", "power-backup", "parking"],
    images: [],
    contactPhone: "+91 98765 43214",
    availableFrom: "2024-01-10",
    ownerId: "1",
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "6",
    title: "Cozy PG for Girls in Jubilee Hills",
    description: "Safe and comfortable PG accommodation exclusively for girls in the prestigious Jubilee Hills area. Features include CCTV surveillance, biometric access, nutritious meals, and proximity to major shopping and entertainment hubs.",
    rent: 18000,
    deposit: 36000,
    city: "Hyderabad",
    address: "987 Jubilee Hills, Near GVK One Mall, Hyderabad, Telangana 500033",
    propertyType: "single-room",
    gender: "female",
    amenities: ["wifi", "ac", "meals", "security", "cctv", "biometric"],
    images: [],
    contactPhone: "+91 98765 43215",
    availableFrom: "2024-02-10",
    ownerId: "1",
    createdAt: new Date().toISOString(),
    isActive: true
  }
];

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write sample data to files
fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(sampleUsers, null, 2));
fs.writeFileSync(path.join(dataDir, 'properties.json'), JSON.stringify(sampleProperties, null, 2));

console.log('Sample data created successfully!');
console.log('Users:', sampleUsers.length);
console.log('Properties:', sampleProperties.length); 