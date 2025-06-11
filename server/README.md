# DwellDash Server

## 🔧 LOCAL DEVELOPMENT SETUP
This application is configured to use **local MongoDB** for optimal development experience and reliability.

## Environment Setup

1. **Install MongoDB Community Server** (if not already installed):
   - Download from: https://www.mongodb.com/try/download/community
   - Install as Windows Service
   - Ensure MongoDB service is running: `Get-Service MongoDB`

2. **Create a `.env` file** in the server directory:
```
MONGODB_URI=mongodb://localhost:27017/dwelldash
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Required Environment Variables

- `MONGODB_URI`: Local MongoDB connection string (default: `mongodb://localhost:27017/dwelldash`)
- `EMAIL_USER`: Gmail address for sending emails (optional for development)
- `EMAIL_PASS`: Gmail app password (optional for development)
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

## Local MongoDB Benefits

✅ **No Connection Issues**: No network timeouts or disconnections  
✅ **Faster Performance**: Direct local database access  
✅ **Offline Development**: Works without internet connection  
✅ **Full Control**: Complete access to database configuration  
✅ **No Costs**: No cloud service fees  

## Installation & Startup

```bash
# Install dependencies
npm install

# Start the server
npm start
```

## Database Status

The application connects to your local MongoDB instance with the `dwelldash` database containing:
- Properties collection
- Users collection  
- Messages and conversations
- FAQs and knowledge base
- Analytics and stats

## Security Best Practices

1. **Never commit** `.env` files to version control
2. **Use strong JWT secrets** for production
3. **Configure email settings** for production use
4. **Regular database backups** for important data
5. **Monitor logs** for any security issues

## Contact

If you have any development or security concerns, please contact the development team. 