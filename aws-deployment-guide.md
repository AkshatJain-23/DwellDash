# AWS Deployment Guide for DwellDash

## 🚀 Overview

This guide covers deploying DwellDash to AWS with three different approaches, from simple EC2 to production-ready solutions.

## 📋 Prerequisites

- AWS Account with billing enabled
- Basic familiarity with SSH and Linux commands
- Domain name (optional but recommended)

---

## 🖥️ **Option 1: EC2 + MongoDB (Recommended for Learning)**

### **Step 1: Launch EC2 Instance**

1. **Go to EC2 Dashboard** → Launch Instance
2. **Choose AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
3. **Instance Type**: t3.micro (1 vCPU, 1GB RAM) for testing, t3.small+ for production
4. **Key Pair**: Create new or use existing (.pem file for SSH)
5. **Security Group**: Configure ports:
   ```
   SSH (22) - Your IP only
   HTTP (80) - 0.0.0.0/0
   HTTPS (443) - 0.0.0.0/0
   Custom (5000) - 0.0.0.0/0 (API server)
   Custom (3000) - 0.0.0.0/0 (React dev server - optional)
   Custom (27017) - Localhost only (MongoDB)
   ```

### **Step 2: Connect and Setup Server**

```bash
# Connect to your instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y
```

### **Step 3: Deploy Application**

```bash
# Clone your repository (or upload files)
git clone https://github.com/yourusername/DwellDash.git
cd DwellDash

# Install dependencies
npm install
cd server && npm install
cd ../client && npm install

# Build frontend
npm run build

# Setup environment variables
cd ../server
cp .env.example .env
nano .env
```

**Update .env file:**
```bash
MONGODB_URI=mongodb://localhost:27017/dwelldash
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secure-production-jwt-secret
CLIENT_URL=http://your-ec2-public-ip
```

### **Step 4: Configure Nginx**

```bash
sudo nano /etc/nginx/sites-available/dwelldash
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com your-ec2-public-ip;

    # Serve React build files
    location / {
        root /home/ubuntu/DwellDash/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads {
        alias /home/ubuntu/DwellDash/server/uploads;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/dwelldash /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **Step 5: Start Application with PM2**

```bash
cd /home/ubuntu/DwellDash/server

# Start with PM2
pm2 start index.js --name "dwelldash-api"
pm2 startup
pm2 save
```

---

## 🗄️ **Option 2: AWS DocumentDB (Production-Ready)**

### **Step 1: Create DocumentDB Cluster**

1. **Go to DocumentDB** → Create cluster
2. **Configuration**:
   - Engine: 4.0.0
   - Instance class: db.t3.medium (smallest)
   - Number of instances: 1
   - VPC: Default VPC
   - Subnet group: Create new
3. **Security**: Create security group allowing port 27017 from your EC2

### **Step 2: Update Connection String**

```bash
# In your .env file
MONGODB_URI=mongodb://username:password@your-docdb-cluster.cluster-xyz.region.docdb.amazonaws.com:27017/dwelldash?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false
```

### **Step 3: Download SSL Certificate**

```bash
cd /home/ubuntu/DwellDash/server
wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem
```

---

## ☁️ **Option 3: AWS Elastic Beanstalk (Easiest)**

### **Step 1: Prepare Application**

Create `package.json` in root:
```json
{
  "name": "dwelldash",
  "version": "1.0.0",
  "scripts": {
    "start": "cd server && npm start",
    "build": "cd client && npm install && npm run build"
  },
  "engines": {
    "node": "18.x"
  }
}
```

Create `.ebextensions/nodecommand.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
```

### **Step 2: Deploy to Elastic Beanstalk**

1. **Install EB CLI**:
   ```bash
   pip install awsebcli
   ```

2. **Initialize and Deploy**:
   ```bash
   eb init
   eb create dwelldash-prod
   eb deploy
   ```

---

## 🌐 **Frontend Options**

### **Option A: Serve from Same Server (Nginx)**
- Included in above configurations
- Simple, cost-effective

### **Option B: AWS S3 + CloudFront**
- Better performance
- Global CDN
- Separate static hosting

```bash
# Build and upload to S3
npm run build
aws s3 sync client/dist/ s3://your-bucket-name --delete
```

---

## 🔒 **Security & SSL (Production)**

### **Install SSL Certificate**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 💰 **Cost Estimates (Monthly)**

| Component | Basic | Production |
|-----------|--------|------------|
| **EC2** | $8-15 (t3.micro) | $25-50 (t3.small+) |
| **DocumentDB** | - | $50-100 (db.t3.medium) |
| **Storage** | $1-5 | $5-20 |
| **Bandwidth** | $1-10 | $10-50 |
| **Total** | **$10-30** | **$90-220** |

---

## 🚀 **Quick Start Commands**

```bash
# 1. Launch EC2 instance
# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. Run deployment script
curl -sSL https://raw.githubusercontent.com/yourusername/DwellDash/main/deploy-aws.sh | bash

# 4. Configure environment
cd DwellDash/server && nano .env

# 5. Start application
pm2 start index.js --name dwelldash
```

---

## 🔧 **Monitoring & Maintenance**

```bash
# Check application status
pm2 status
pm2 logs dwelldash

# Check database
mongo localhost:27017/dwelldash

# Check nginx
sudo nginx -t
sudo systemctl status nginx

# Update application
git pull
npm run build
pm2 restart dwelldash
```

---

## 📞 **Next Steps**

1. Choose your deployment option based on needs and budget
2. Set up domain name and SSL certificates
3. Configure monitoring and backups
4. Set up CI/CD pipeline for automated deployments

Choose the option that best fits your needs and budget. Option 1 (EC2) is great for learning, while Options 2-3 are more production-ready. 