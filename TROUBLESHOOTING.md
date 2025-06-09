# 🔧 DwellDash Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: Blank/White Page on localhost:3000

**Symptoms:**
- Browser shows a blank white page
- No content loads on localhost:3000
- Title shows "DwellDash - Find Your Perfect PG Accommodation"

**Solutions:**

#### Step 1: Force Refresh Your Browser
```
1. Press Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
2. Or press F12, right-click refresh button, select "Empty Cache and Hard Reload"
3. Try in an incognito/private browsing window
```

#### Step 2: Check Browser Console
```
1. Press F12 to open Developer Tools
2. Click on "Console" tab
3. Look for any error messages (red text)
4. Common errors to look for:
   - Module import errors
   - JavaScript syntax errors
   - Network request failures
```

#### Step 3: Restart Development Servers
```powershell
# Kill all node processes
taskkill /IM "node.exe" /F

# Restart backend
cd server
npm start

# In a new terminal, restart frontend
cd client
npm run dev
```

#### Step 4: Clear Node Cache & Reinstall
```powershell
# In client directory
cd client
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev

# If you get permission errors with node_modules:
# 1. Close all terminals
# 2. Close VS Code/any editors
# 3. Try the commands again
```

#### Step 5: Check Network Configuration
```powershell
# Check what's running on port 3000
netstat -ano | findstr :3000

# If nothing shows, the server isn't running
# If something shows, but browser doesn't work, try:
# - http://127.0.0.1:3000
# - http://[::1]:3000
# - Disable antivirus/firewall temporarily
```

### Issue 2: PowerShell `&&` Errors

**Problem:** `The token '&&' is not a valid statement separator`

**Solution:** Use PowerShell-compatible commands or the provided scripts
```powershell
# Instead of: cd client && npm install
# Use:
cd client
npm install

# Or use the startup script:
.\start-dev.ps1
```

### Issue 3: EADDRINUSE Port Errors

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :5000

# Kill the process (replace XXXX with actual PID)
taskkill /PID XXXX /F

# Or kill all node processes
taskkill /IM "node.exe" /F
```

### Issue 4: Module Not Found Errors

**Problem:** `Cannot resolve module` or `Module not found`

**Solution:**
```powershell
# Reinstall dependencies
cd client
npm install

cd ../server  
npm install

# Clear npm cache if issues persist
npm cache clean --force
```

### Issue 5: API Connection Issues

**Problem:** Frontend can't connect to backend API

**Solution:**
1. Ensure backend is running on port 5000
2. Check `client/vite.config.js` proxy settings
3. Test API directly: http://localhost:5000/api/health

### Issue 6: Build Failures

**Problem:** `npm run build` fails

**Solution:**
```powershell
# Check for syntax errors
cd client
npm run lint

# Fix common issues
npm install --legacy-peer-deps

# Clear cache and retry
npm cache clean --force
npm install
npm run build
```

## 🚀 Quick Recovery Steps

If nothing works, try this complete reset:

```powershell
# 1. Kill all node processes
taskkill /IM "node.exe" /F

# 2. Clear all caches
cd client
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

cd ../server
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue  
Remove-Item package-lock.json -ErrorAction SilentlyContinue

cd ..

# 3. Reinstall everything
npm run install-all

# 4. Start servers
.\start-dev.ps1
```

## 🌐 Browser-Specific Issues

### Chrome/Edge
- Clear site data: F12 > Application > Storage > Clear site data
- Disable extensions temporarily
- Try incognito mode

### Firefox
- Clear cache: Ctrl+Shift+Delete
- Disable tracking protection for localhost
- Check about:config for proxy settings

## 📱 Mobile Testing

If testing on mobile:
- Use your IP address instead of localhost
- Example: http://192.168.1.100:3000
- Check firewall settings

## 🆘 Still Having Issues?

1. **Check the exact error messages** in browser console
2. **Take a screenshot** of any error messages
3. **Check if antivirus/firewall** is blocking the ports
4. **Try a different browser**
5. **Restart your computer** (sometimes Windows networking gets stuck)

## 📋 Diagnostic Checklist

Before asking for help, verify:

- [ ] Both servers are running (ports 3000 and 5000)
- [ ] No error messages in browser console
- [ ] No antivirus/firewall blocking
- [ ] Tried force refresh (Ctrl+Shift+R)
- [ ] Tried incognito/private browsing
- [ ] Dependencies are installed
- [ ] Using correct URLs (localhost:3000 for frontend)

## 🔍 Debug Commands

Use these to gather information:

```powershell
# Check running processes
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Check Node.js version
node --version
npm --version

# Check if servers respond
curl http://localhost:5000/api/health

# View server logs (run these in their respective directories)
# Backend logs: Check the terminal where you ran 'npm start'
# Frontend logs: Check the terminal where you ran 'npm run dev'
``` 