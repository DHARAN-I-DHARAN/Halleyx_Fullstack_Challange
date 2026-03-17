@echo off
echo Starting Halleyx Project...

echo.
echo Starting Backend...
start cmd /k "cd programming/backend && npm run dev"

echo.
echo Starting Frontend...
start cmd /k "cd programming/frontend && npm run dev"

echo.
echo Both servers Started!
pause