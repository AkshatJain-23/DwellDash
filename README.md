# PGFinder - Full Stack PG Listing Platform

A comprehensive web application for finding and listing Paying Guest (PG) accommodations across India, similar to NoBroker, Makaan.com, and MagicBricks.

## Features

### For Tenants
- Search & Filter: Advanced search with filters for city, rent range, property type, gender preference, and amenities
- Property Listings: Browse verified PG accommodations with detailed information
- Image Gallery: View multiple property images with an interactive gallery
- Contact Owners: Direct contact information for property inquiries
- Responsive Design: Optimized for desktop, tablet, and mobile devices

### For Property Owners
- Property Management: Add, edit, and delete property listings
- Image Upload: Upload multiple property images
- Dashboard: Manage all your properties from a centralized dashboard
- Real-time Updates: Instant updates to property information

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Hook Form for form handling
- Axios for API calls

### Backend
- Node.js with Express.js
- JWT authentication
- Multer for file uploads
- Express Validator for input validation
- JSON file storage (easily replaceable with database)

## Quick Start

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Start development servers:
   ```bash
   npm run dev
   ```

This will start both frontend (port 3000) and backend (port 5000) servers.

## Demo Accounts

Property Owner:
- Email: owner@test.com
- Password: 123123

Tenant:
- Email: tenant@test.com  
- Password: 123123

## Project Structure

```
pgfinder-app/
├── client/          # React frontend
├── server/          # Node.js backend
└── package.json     # Root configuration
```

## Key Features

- Modern, responsive UI design
- User authentication and authorization
- Property search and filtering
- Image upload and gallery
- Role-based access control
- Mobile-friendly interface

Built with modern web technologies and best practices for the Indian PG accommodation market. 