const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

async function createTestUser() {
  const usersFile = path.join(__dirname, 'data/users.json');
  
  // Read existing users
  let users = [];
  try {
    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
  } catch (error) {
    console.log('No existing users file found, creating new one');
  }
  
  // Check if user already exists
  const existingUser = users.find(user => user.email === 'dwelldash3@gmail.com');
  if (existingUser) {
    console.log('✅ User dwelldash3@gmail.com already exists');
    console.log('User details:', {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role
    });
    return;
  }
  
  // Create new user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const newUser = {
    id: Date.now().toString(),
    name: 'DwellDash Admin',
    email: 'dwelldash3@gmail.com',
    password: hashedPassword,
    role: 'owner',
    phone: '+918426076800',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Save users
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  
  console.log('✅ User created successfully!');
  console.log('Email: dwelldash3@gmail.com');
  console.log('Password: password123');
  console.log('Role: owner');
}

createTestUser(); 