# DwellDash Development Startup Script
Write-Host "🏠 Starting DwellDash Development Environment..." -ForegroundColor Green

# Function to start server in background
function Start-Server {
    Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start" -WindowStyle Normal
    Start-Sleep -Seconds 3
}

# Function to start client
function Start-Client {
    Write-Host "⚛️  Starting Frontend Client..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Check if node_modules exist
if (-not (Test-Path "client/node_modules")) {
    Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

if (-not (Test-Path "server/node_modules")) {
    Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

# Start both servers
Start-Server
Start-Client

Write-Host ""
Write-Host "🎉 DwellDash is starting up!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop this script (servers will continue running)" -ForegroundColor Gray

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "Script terminated" -ForegroundColor Red
} 