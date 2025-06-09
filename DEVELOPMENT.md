# 🏠 DwellDash - Development Guide

## 🚀 Quick Start

### Option 1: Using the Startup Script (Recommended)
```powershell
# Run this command in the project root
.\start-dev.ps1
```

### Option 2: Manual Setup
```powershell
# Terminal 1 - Start Backend Server
cd server
npm install
npm start

# Terminal 2 - Start Frontend Client  
cd client
npm install
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. PowerShell `&&` Error
**Problem**: `The token '&&' is not a valid statement separator`
**Solution**: Use separate commands or the provided startup script

#### 2. Port Already in Use
**Problem**: `EADDRINUSE: address already in use`
**Solution**: 
```powershell
# Kill processes on ports 3000 and 5000
netstat -ano | findstr :3000
netstat -ano | findstr :5000
# Then kill the process using: taskkill /PID <PID> /F
```

#### 3. Dependencies Not Installed
**Problem**: Module not found errors
**Solution**:
```powershell
# Install client dependencies
cd client && npm install

# Install server dependencies  
cd server && npm install
```

#### 4. Environment Variables Missing
**Problem**: JWT or API errors
**Solution**: The server uses default values, but you can create a `.env` file in the server directory:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
```

## 📁 Project Structure

```
DwellDash/
├── client/          # React frontend (Vite)
├── server/          # Express.js backend
├── start-dev.ps1    # Development startup script
└── README.md        # Main project documentation
```

## 🔑 Default Test Accounts

The application includes mock data for testing:

**Owner Account:**
- Email: `owner@demo.com`
- Password: `password123`

**Tenant Account:**
- Email: `tenant@demo.com`  
- Password: `password123`

## 🛠️ Development Features

- **Hot Reload**: Both frontend and backend support hot reloading
- **Mock Data**: Application works with mock data by default
- **API Proxy**: Frontend proxies API calls to backend automatically
- **Authentication**: JWT-based authentication system
- **File Uploads**: Property image upload functionality

## 📝 Making Changes

1. **Frontend Changes**: Edit files in `client/src/` - changes will hot reload
2. **Backend Changes**: Edit files in `server/` - server will restart automatically with nodemon
3. **Database**: Currently uses JSON files in `server/data/` for simplicity

## 🚨 Known Issues Fixed

- ✅ Updated `RAGChatbot` to `EnhancedRAGChatbot` in App.jsx
- ✅ Fixed PowerShell command compatibility
- ✅ Ensured both servers start correctly
- ✅ API proxy configuration working

## 🔄 Git Workflow

```powershell
# Stage changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

## 📞 Need Help?

If you encounter any issues:
1. Check this troubleshooting guide
2. Ensure both servers are running
3. Check browser console for frontend errors
4. Check terminal output for backend errors 