const { MongoClient } = require('mongodb');

// Configuration
const LOCAL_URI = 'mongodb://localhost:27017';
const AWS_URI = process.env.AWS_MONGODB_URI || 'mongodb://your-aws-ec2-ip:27017';
const DATABASE_NAME = 'dwelldash';

// Collections to migrate
const COLLECTIONS_TO_MIGRATE = [
  'properties',
  'users', 
  'knowledgebases',
  'faqs',
  'conversations',
  'messages',
  'favorites',
  'stats',
  'supporttickets',
  'contactmessages',
  'analytics'
];

async function migrateToAWS() {
  let localClient = null;
  let awsClient = null;
  
  try {
    console.log('🚀 Starting Data Migration to AWS...\n');
    
    // Connect to local MongoDB
    console.log('🔗 Connecting to Local MongoDB...');
    localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    console.log('✅ Connected to local MongoDB');
    
    // Connect to AWS MongoDB
    console.log('🌐 Connecting to AWS MongoDB...');
    awsClient = new MongoClient(AWS_URI);
    await awsClient.connect();
    console.log('✅ Connected to AWS MongoDB');
    
    const localDb = localClient.db(DATABASE_NAME);
    const awsDb = awsClient.db(DATABASE_NAME);
    
    let totalMigrated = 0;
    
    // Migrate each collection
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      try {
        console.log(`\n📦 Migrating ${collectionName}...`);
        
        // Get data from local
        const localCollection = localDb.collection(collectionName);
        const documents = await localCollection.find({}).toArray();
        
        if (documents.length === 0) {
          console.log(`   ⚠️  No documents found in ${collectionName}`);
          continue;
        }
        
        // Insert to AWS
        const awsCollection = awsDb.collection(collectionName);
        
        // Clear existing data (optional - remove this if you want to keep existing data)
        await awsCollection.deleteMany({});
        console.log(`   🗑️  Cleared existing ${collectionName} data`);
        
        // Insert new data
        const result = await awsCollection.insertMany(documents);
        console.log(`   ✅ Migrated ${result.insertedCount} documents to ${collectionName}`);
        
        totalMigrated += result.insertedCount;
        
      } catch (collectionError) {
        console.error(`   ❌ Error migrating ${collectionName}:`, collectionError.message);
      }
    }
    
    console.log(`\n🎉 Migration Complete!`);
    console.log(`📊 Total documents migrated: ${totalMigrated}`);
    
    // Verify migration
    console.log(`\n🔍 Verifying migration...`);
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      const awsCollection = awsDb.collection(collectionName);
      const count = await awsCollection.countDocuments();
      if (count > 0) {
        console.log(`   ✅ ${collectionName}: ${count} documents`);
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (localClient) {
      await localClient.close();
      console.log('\n🔌 Disconnected from local MongoDB');
    }
    if (awsClient) {
      await awsClient.close();
      console.log('🔌 Disconnected from AWS MongoDB');
    }
  }
}

// Check command line arguments
if (process.argv.length < 3) {
  console.log(`
🔧 Usage: node migrate-to-aws.js <aws-mongodb-uri>

Examples:
  # Migrate to AWS EC2 MongoDB
  node migrate-to-aws.js mongodb://your-ec2-ip:27017
  
  # Migrate to AWS DocumentDB
  node migrate-to-aws.js "mongodb://username:password@your-docdb-cluster.amazonaws.com:27017/dwelldash?ssl=true"

📋 Make sure:
  1. Your local MongoDB is running and has data
  2. Your AWS MongoDB/DocumentDB is accessible
  3. You have network connectivity to AWS instance
  4. Firewall rules allow MongoDB port (27017) access
`);
  process.exit(1);
}

// Get AWS URI from command line
const awsUri = process.argv[2];
process.env.AWS_MONGODB_URI = awsUri;

console.log('🎯 Migration Configuration:');
console.log(`   Local:  ${LOCAL_URI}/${DATABASE_NAME}`);
console.log(`   AWS:    ${awsUri}/${DATABASE_NAME}`);
console.log(`   Collections: ${COLLECTIONS_TO_MIGRATE.length} collections to migrate\n`);

// Confirm before proceeding
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('⚠️  This will overwrite existing data on AWS. Continue? (yes/no): ', (answer) => {
  rl.close();
  
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    migrateToAWS();
  } else {
    console.log('❌ Migration cancelled by user');
  }
});

module.exports = { migrateToAWS }; 