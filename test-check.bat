@echo off
REM Simple test
echo Testing core requirements...
echo.

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo [FAILED] Git is not installed
) else (
    echo [OK] Git installed
)

REM Check Node.js  
node --version >nul 2>&1
if errorlevel 1 (
    echo [FAILED] Node.js is not installed
) else (
    echo [OK] Node.js installed
)

REM Check Supabase CLI
supabase --version >nul 2>&1
if errorlevel 1 (
    echo [FAILED] Supabase CLI is not installed
) else (
    echo [OK] Supabase CLI installed
)

echo.
echo Test complete.
