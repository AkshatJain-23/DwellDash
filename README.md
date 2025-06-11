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

## 👥 Demo Accounts


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
