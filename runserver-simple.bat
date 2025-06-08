@echo off
echo ========================================
echo   PGFinder Application Startup Script
echo ========================================
echo.

echo Starting PGFinder application...
echo.
echo This will start:
echo - Backend server: http://localhost:5000 (or configured port)
echo - Frontend client: http://localhost:5173 (Vite default)
echo.
echo Press Ctrl+C to stop both servers
echo.

:: Start both client and server using the dev script
npm run dev

echo.
echo Press any key to exit...
pause 