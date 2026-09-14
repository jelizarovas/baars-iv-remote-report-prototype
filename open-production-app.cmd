@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules\vite\bin\vite.js" (
  echo Dependencies are not installed.
  echo Run: npm install
  pause
  exit /b 1
)

if not exist "dist\index.html" (
  echo Creating the production build...
  call npm run build
  if errorlevel 1 (
    echo The production build failed.
    pause
    exit /b 1
  )
)

start "BAARS-IV local server" /min cmd /c "npm run preview -- --host 127.0.0.1 --port 4173"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173"

echo BAARS-IV is available at http://127.0.0.1:4173
echo Close the minimized "BAARS-IV local server" window to stop it.
endlocal
