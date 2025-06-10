# DwellDash Server

## 🚨 SECURITY NOTICE
This repository previously contained exposed MongoDB credentials. The following security measures have been implemented:

1. **Hardcoded credentials removed** from `config/database.js`
2. **Environment variables** are now required for all sensitive data
3. **Secure .env configuration** is mandatory

## Environment Setup

1. Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

2. Update the `.env` file with your actual credentials:
```
MONGODB_URI=mongodb+srv://your_username:your_new_password@cluster0.px1ra7o.mongodb.net/dwelldash?retryWrites=true&w=majority&appName=Cluster0
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

## Required Environment Variables

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `EMAIL_USER`: Gmail address for sending emails
- `EMAIL_PASS`: Gmail app password (not regular password)
- `JWT_SECRET`: Secret key for JWT token generation

## Security Best Practices

1. **Never commit** `.env` files to version control
2. **Rotate passwords** regularly
3. **Use strong passwords** and app passwords for email
4. **Restrict IP access** in MongoDB Atlas
5. **Monitor** for any exposed secrets

## Installation

```bash
npm install
npm start
```

## Contact

If you have any security concerns, please contact the development team immediately. 