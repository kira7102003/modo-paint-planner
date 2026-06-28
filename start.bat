@echo off
chcp 65001 >nul 2>&1
title MODO 超合繪配色規劃器

set "PORT=3456"
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo.
echo   MODO 超合繪配色規劃器
echo   啟動中...
echo.

:: Kill old process on port
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

:: Start server
start /B "" cmd /c "npm run dev -- -p %PORT% 2>nul"

:: Wait for server
echo   等待伺服器...
:wait
timeout /t 2 /nobreak >nul
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:%PORT%' -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 goto wait

echo   開啟中...

:: Open Edge App Mode
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:%PORT% --window-size=1280,900
    goto running
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:%PORT% --window-size=1280,900
    goto running
)
start http://localhost:%PORT%

:running
echo.
echo   已啟動! 按任意鍵關閉伺服器
echo.
pause >nul

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
