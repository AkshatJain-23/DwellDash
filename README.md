# DwellDash - Full Stack PG Listing Platform

A comprehensive web application for finding and listing Paying Guest (PG) accommodations across India, built with modern web technologies and local MongoDB database.

## 🏠 Features

### For Tenants
- **Advanced Search & Filter**: Search by city, rent range, property type, gender preference, and amenities
- **Property Listings**: Browse verified PG accommodations with detailed information
- **Interactive Gallery**: View multiple property images with responsive gallery
- **Direct Contact**: Connect directly with property owners
- **AI Chat Assistant**: Get instant answers about properties and platform features
- **Favorites**: Save and manage favorite properties
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### For Property Owners
- **Property Management**: Add, edit, and delete property listings
- **Image Upload**: Upload multiple high-quality property images
- **Dashboard**: Manage all properties from a centralized interface
- **Real-time Analytics**: Track property views and inquiries
- **Message Center**: Communicate with potential tenants

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **React Router** for client-side routing
- **React Hook Form** for efficient form handling
- **Axios** for API communication

### Backend
- **Node.js** with Express.js framework
- **MongoDB** (Local) for data persistence
- **Mongoose** for MongoDB object modeling
- **JWT** for secure authentication
- **Multer** for file upload handling
- **Express Validator** for input validation
- **OpenAI Integration** for AI chat features

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB Community Server installed and running locally

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   npm run install-client
   ```

2. **Configure environment** (server/.env):
   ```bash
   MONGODB_URI=mongodb://localhost:27017/dwelldash
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

This starts both frontend (http://localhost:3000) and backend (http://localhost:5000).

## 🗄️ Database

The application uses **local MongoDB** for:
- ✅ **Reliability**: No network timeouts or disconnections
- ✅ **Performance**: Direct local database access
- ✅ **Control**: Full database configuration access
- ✅ **Cost-effective**: No cloud service fees

**Collections**: Properties, Users, Messages, Conversations, FAQs, Knowledge Base, Analytics

## 📁 Project Structure

```
DwellDash/
├── client/          # React frontend application
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── dist/        # Production build
├── server/          # Node.js backend application
│   ├── routes/      # API endpoints
│   ├── models/      # Database models
│   ├── services/    # Business logic
│   └── config/      # Configuration files
└── package.json     # Root project configuration
```

## 🌟 Key Features

- **Modern UI/UX**: Clean, intuitive interface design
- **Secure Authentication**: JWT-based user authentication
- **Advanced Search**: Multiple filters and sorting options
- **Image Management**: Multiple image upload with gallery view
- **AI-Powered Chat**: OpenAI integration for user assistance
- **Real-time Analytics**: Property and user statistics
- **Mobile-First**: Responsive design for all devices
- **Local Database**: Fast, reliable MongoDB integration

Built for the Indian PG accommodation market with modern web technologies and best practices.

## 🛠️ Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run install-client` - Install client dependencies

## 🚀 **Deployment**

### **Frontend (Vercel):**
- Automatic deployment from main branch
- Environment variables configured
- CDN optimization enabled

### **Backend Options:**
- **Local Development** - MongoDB local setup
- **AWS EC2** - Full deployment with MongoDB
- **Heroku** - Quick deployment option
- **DigitalOcean** - Scalable cloud deployment

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- React community for excellent documentation
- MongoDB for robust database solutions
- Vercel for seamless deployment platform
- Open source contributors

## 📞 **Support**

For support and queries:
- Create an issue on GitHub
- Contact: akshatjain.dev@email.com

---

**Built with ❤️ by Akshat Jain**

*Last Updated: June 2025 - Build Optimized for Vercel Deployment*

## 🚀 Quick Deploy Links

**Frontend (Vercel)**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AkshatJain-23/DwellDash)

**Backend (Railway)**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/AkshatJain-23/DwellDash&plugins=mongodb)

## 📋 Deployment Instructions

### 1. Database Setup (MongoDB Atlas - Free)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster (M0 Sandbox)
3. Create database user and get connection string
4. Whitelist all IPs (0.0.0.0/0) for access

### 2. Backend Deployment (Railway - Free)
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub (this repository)
3. Set Root Directory: `server`
4. Add environment variables:
   ```
   MONGODB_URI=your_atlas_connection_string
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your_secure_secret_key
   ```

### 3. Frontend Deployment (Vercel - Free)
1. Go to [vercel.com](https://vercel.com)
2. Import this GitHub repository
3. Set Root Directory: `client`
4. Add environment variable:
   ```
   VITE_API_URL=your_railway_backend_url
   ```

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Community Server (local)
- Git

### Backend Setup
```bash
cd server
npm install
# Create .env file with local MongoDB
echo "MONGODB_URI=mongodb://localhost:27017/dwelldash" > .env
echo "JWT_SECRET=your_local_secret" >> .env
echo "NODE_ENV=development" >> .env
npm start
```

### Frontend Setup
```bash
cd client  
npm install
npm run dev
```

## 🌐 Live URLs
- **Frontend**: https://dwelldash.vercel.app
- **Backend**: https://your-app.railway.app
- **API Health**: https://your-app.railway.app/api/health
