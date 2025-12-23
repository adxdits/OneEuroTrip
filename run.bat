@echo off
echo ========================================
echo   Monument Recognition - Local AI
echo ========================================
echo.

REM Kill any existing TUI instance
taskkill /F /IM monument-recognition-tui.exe >nul 2>nul

REM Add Rust to PATH if installed via rustup
if exist "%USERPROFILE%\.cargo\bin\cargo.exe" (
    set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
)

REM Check if cargo is available
where cargo >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Cargo not found!
    echo.
    echo Please install Rust:
    echo   winget install Rustlang.Rustup
    echo.
    echo Then RESTART your terminal and run this script again.
    echo.
    pause
    exit /b 1
)

echo [1/2] Starting backend in new window...
start "Backend" cmd /k "cd /d %~dp0backend && mvnw.cmd quarkus:dev"

echo Waiting for backend to start (15 seconds)...
timeout /t 15 /nobreak > nul

echo.
echo [2/2] Building and starting Rust TUI...
echo.
cd /d %~dp0frontend
cargo run --release

echo.
echo Press any key to exit...
pause > nul
