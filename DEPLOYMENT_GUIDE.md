# 🚀 Free Deployment Guide for PGFinder

Your React + Node.js application can be deployed for **FREE** using these platforms. Here are the best options:

## 🏆 **Recommended: Vercel + Railway**

### **Frontend (React) - Vercel**
- ✅ 100GB bandwidth/month
- ✅ Global CDN
- ✅ Automatic deployments from GitHub
- ✅ Custom domains

### **Backend (Node.js) - Railway**
- ✅ $5 free credit monthly (~550 hours)
- ✅ Supports file uploads & storage
- ✅ PostgreSQL database included

---

## 📋 **Step-by-Step Deployment**

### **Step 1: Prepare Your Repository**

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### **Step 2: Deploy Backend (Railway)**

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Choose "Deploy from the repo root"
6. Set these environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `8080` (Railway default)
7. Railway will automatically deploy your backend

### **Step 3: Deploy Frontend (Vercel)**

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Select your repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Add environment variable:
   - `VITE_API_URL` = `https://your-railway-app.railway.app/api`

### **Step 4: Update API URL**

After Railway deployment, you'll get a URL like: `https://your-app-name.railway.app`

Update your Vercel environment variable:
- `VITE_API_URL` = `https://your-railway-app.railway.app/api`

---

## 🔄 **Alternative Options**

### **Option 2: Netlify + Render**

**Frontend (Netlify)**:
1. Connect GitHub to Netlify
2. Build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

**Backend (Render)**:
1. Connect GitHub to Render
2. Use the included `render.yaml` config
3. Automatic deployment from repository

### **Option 3: All-in-One (Heroku)**

Deploy both frontend and backend together:
1. Connect GitHub to Heroku
2. Set buildpacks:
   - `heroku/nodejs`
3. Add environment variables:
   - `NODE_ENV` = `production`
4. Uses the included `Procfile`

---

## 🛠️ **Environment Variables Setup**

### **Frontend Environment (.env in client folder)**
```env
VITE_API_URL=https://your-backend-url/api
```

### **Backend Environment (.env in server folder)**
```env
NODE_ENV=production
PORT=8080
```

---

## 📱 **Post-Deployment Steps**

1. **Test your application**:
   - Visit your Vercel URL
   - Test user registration/login
   - Test property listings
   - Test chat functionality

2. **Custom Domain** (Optional):
   - Add custom domain in Vercel settings
   - Update CORS settings if needed

3. **Monitoring**:
   - Check Railway logs for backend issues
   - Monitor Vercel function logs

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **API calls failing**:
   - Check `VITE_API_URL` environment variable
   - Verify Railway backend is running

2. **Build failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

3. **File uploads not working**:
   - Railway includes persistent storage
   - Check upload directory permissions

4. **Chat not working**:
   - Verify WebSocket connections
   - Check CORS configuration

---

## 💡 **Tips for Success**

1. **Always test locally first**:
   ```bash
   npm run build-production
   npm run start-production
   ```

2. **Monitor free tier limits**:
   - Railway: $5/month credit
   - Vercel: 100GB bandwidth
   - Netlify: 100GB bandwidth

3. **Use environment variables** for all configuration
4. **Enable compression** for better performance
5. **Set up monitoring** for uptime tracking

---

## 🚀 **Quick Deployment Commands**

```bash
# Build and test locally
npm run build-production
npm run start-production

# Deploy to Railway (backend)
# Use Railway dashboard or CLI

# Deploy to Vercel (frontend)
# Use Vercel dashboard or CLI
npx vercel --prod
```

---

## 📞 **Need Help?**

1. Check deployment logs in respective platforms
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check network/CORS issues

**Your application will be live and accessible globally for FREE!** 🎉 