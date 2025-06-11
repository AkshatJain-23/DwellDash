#!/bin/bash

# DwellDash Quick Deploy Script for AWS EC2
# Just copy and paste this entire script into your EC2 terminal

echo "🚀 Starting DwellDash Deployment on AWS EC2..."
echo "=============================================="

# Colors for better visibility
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to print colored output
print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

print_status "Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_status "Step 2: Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version

print_status "Step 3: Installing MongoDB Community Edition..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

print_status "Step 4: Starting MongoDB service..."
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod --no-pager

print_status "Step 5: Installing PM2 process manager..."
sudo npm install -g pm2

print_status "Step 6: Installing Nginx web server..."
sudo apt install nginx git curl unzip -y

print_status "Step 7: Creating application directory..."
mkdir -p /home/ubuntu/DwellDash
cd /home/ubuntu/DwellDash

print_status "Step 8: Creating project structure..."
mkdir -p server client server/uploads

print_success "✅ Infrastructure setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Upload your DwellDash application files"
echo "2. Install dependencies"
echo "3. Configure environment"
echo "4. Start the application"
echo ""

# Get public IP for configuration
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "📍 Your EC2 Public IP: $PUBLIC_IP"
echo ""

print_status "Step 9: Pre-configuring Nginx..."
sudo tee /etc/nginx/sites-available/dwelldash > /dev/null << EOF
server {
    listen 80;
    server_name $PUBLIC_IP;

    client_max_body_size 10M;

    # Serve React build files
    location / {
        root /home/ubuntu/DwellDash/client/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # File uploads
    location /uploads {
        alias /home/ubuntu/DwellDash/server/uploads;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/dwelldash /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

print_status "Step 10: Creating environment template..."
cat > /home/ubuntu/DwellDash/server/.env << EOF
# MongoDB Configuration (Local)
MONGODB_URI=mongodb://localhost:27017/dwelldash

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret - CHANGE THIS!
JWT_SECRET=dwelldash-production-secret-$(date +%s)

# Client Configuration
CLIENT_URL=http://$PUBLIC_IP

# CORS Configuration
CORS_ORIGIN=http://$PUBLIC_IP

# Email Configuration (Update with your details)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Logging
LOG_LEVEL=info
EOF

print_success "🎉 Basic setup complete!"
echo ""
echo "📋 MANUAL STEPS NEEDED:"
echo "=================================="
echo "1. Upload your DwellDash files to: /home/ubuntu/DwellDash"
echo ""
echo "   From your local machine, run:"
echo "   scp -r -i \"dwelldash-key.pem\" DwellDash ubuntu@$PUBLIC_IP:/home/ubuntu/"
echo ""
echo "2. After upload, run these commands:"
echo "   cd /home/ubuntu/DwellDash/server && npm install"
echo "   cd /home/ubuntu/DwellDash/client && npm install && npm run build"
echo "   pm2 start /home/ubuntu/DwellDash/server/index.js --name dwelldash-api"
echo "   sudo systemctl restart nginx"
echo ""
echo "3. Your website will be available at: http://$PUBLIC_IP"
echo ""

print_warning "🔧 Don't forget to:"
echo "   • Update server/.env with your actual email credentials"
echo "   • Migrate your data from local MongoDB"
echo "   • Test the application thoroughly"
echo ""

print_success "✅ Infrastructure ready for DwellDash deployment!"
echo "🌐 Access your server at: http://$PUBLIC_IP" 