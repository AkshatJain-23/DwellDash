@echo off
echo Starting DwellDash servers...

echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo Starting frontend server...
start "Frontend Server" cmd /k "npm start"

echo Both servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause 