@echo off
rem Starts the English tutor (bot\server.js) and opens it in Chrome or Edge.
rem Close this window to stop the tutor.
title English Tutor
cd /d "%~dp0bot"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

if not exist ".env" (
  echo Missing bot\.env with the Gemini key.
  echo Copy bot\.env.example to bot\.env and put your key after GEMINI_API_KEY=
  pause
  exit /b 1
)

rem Already running? Just open the browser.
netstat -ano | findstr ":3333 " | findstr "LISTENING" >nul
if not errorlevel 1 (
  echo The tutor is already running.
  if not defined NO_BROWSER call :open
  exit /b 0
)

rem The microphone only works in Chrome or Edge, so prefer them over the default browser.
if not defined NO_BROWSER start "" /min powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep 2; try { Start-Process chrome 'http://localhost:3333' -ErrorAction Stop } catch { Start-Process msedge 'http://localhost:3333' }"

echo.
echo   English Tutor is running:  http://localhost:3333
echo   Keep this window open while you study. Close it to stop.
echo.
node server.js
echo.
echo The tutor stopped.
pause
exit /b 0

:open
powershell -NoProfile -Command "try { Start-Process chrome 'http://localhost:3333' -ErrorAction Stop } catch { Start-Process msedge 'http://localhost:3333' }"
exit /b 0
