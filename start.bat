@echo off
chcp 65001 >nul 2>&1
title MODO 超合繪配色規劃器

set "PORT=3456"
set "PATH=C:\Program Files\nodejs;%PATH%"

:: Kill any existing server on our port
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)

cd /d "%~dp0"

:: Start Next.js dev server in background
start /B /MIN "" cmd /c "npm run dev -- -p %PORT% >nul 2>&1"

:: Wait for server to be ready
echo.
echo   ╔══════════════════════════════════════╗
echo   ║   MODO 超合繪配色規劃器              ║
echo   ║   啟動中，請稍候...                  ║
echo   ╚══════════════════════════════════════╝
echo.

:wait
timeout /t 1 /nobreak >nul
curl -s -o nul -w "" http://localhost:%PORT% >nul 2>&1
if errorlevel 1 goto wait

echo   伺服器就緒！正在開啟視窗...
echo.

:: Try Edge first, then Chrome, then default browser
set "LAUNCHED=0"

:: Microsoft Edge
for %%p in (
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    "%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"
) do (
    if exist %%p if "%LAUNCHED%"=="0" (
        start "" %%p --app=http://localhost:%PORT% --window-size=1280,900 --disable-extensions
        set "LAUNCHED=1"
    )
)

:: Google Chrome
if "%LAUNCHED%"=="0" (
    for %%p in (
        "C:\Program Files\Google\Chrome\Application\chrome.exe"
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
        "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
    ) do (
        if exist %%p if "%LAUNCHED%"=="0" (
            start "" %%p --app=http://localhost:%PORT% --window-size=1280,900 --disable-extensions
            set "LAUNCHED=1"
        )
    )
)

:: Fallback
if "%LAUNCHED%"=="0" start http://localhost:%PORT%

echo   ╔══════════════════════════════════════╗
echo   ║   應用程式已啟動！                   ║
echo   ║                                      ║
echo   ║   按任意鍵 = 關閉伺服器並退出        ║
echo   ╚══════════════════════════════════════╝
echo.
pause >nul

:: Cleanup
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
