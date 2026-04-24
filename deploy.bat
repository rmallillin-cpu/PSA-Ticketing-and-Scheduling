@echo off
REM Email Management System - Deploy to GitHub & Supabase (Windows)
REM This script automates pushing code to GitHub and deploying to Supabase

setlocal enabledelayedexpansion

REM Colors aren't easily available in batch, so we'll use simple symbols
echo.
echo ======================================
echo   Email Management System - Deployment
echo ======================================
echo.

REM Check prerequisites
echo Checking prerequisites...

REM Check git
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed
    exit /b 1
)
echo [OK] Git found

REM Check Supabase CLI
supabase --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Supabase CLI not found
    echo Install with: npm install -g supabase
    exit /b 1
)
echo [OK] Supabase CLI found

REM Check .env.local
if not exist ".env.local" (
    echo ERROR: .env.local file not found
    echo Please create .env.local with your credentials
    exit /b 1
)
echo [OK] .env.local found
echo.

REM Extract Supabase project ID
for /f "tokens=2 delims=/" %%A in ('findstr /I "VITE_SUPABASE_URL" .env.local') do (
    for /f "tokens=1 delims=." %%B in ("%%A") do (
        set SUPABASE_PROJECT_ID=%%B
    )
)

if "!SUPABASE_PROJECT_ID!"=="" (
    echo ERROR: Could not extract Supabase project ID from .env.local
    exit /b 1
)
echo [OK] Supabase project ID: !SUPABASE_PROJECT_ID!
echo.

REM Show what will happen
echo This will:
echo   1. Commit all changes to GitHub
echo   2. Push to GitHub
echo   3. Deploy Edge Functions to Supabase
echo   4. Verify deployment
echo.
set /p confirm="Continue? (y/n) "
if /i not "!confirm!"=="y" (
    echo Deployment cancelled
    exit /b 0
)
echo.

REM Commit to GitHub
echo ======================================
echo Committing to GitHub...
echo ======================================
echo.

git add -A
if errorlevel 1 (
    echo ERROR: Failed to stage files
    exit /b 1
)
echo [OK] Files staged

REM Check if there are changes
git diff --cached --quiet
if errorlevel 0 (
    echo [WARNING] No changes to commit
    goto :skip_commit
)

REM Create commit message
for /f "tokens=2-4 delims=/ " %%A in ('date /t') do (set mydate=%%C-%%A-%%B)
for /f "tokens=1-2 delims=/:" %%A in ('time /t') do (set mytime=%%A:%%B)
set COMMIT_MESSAGE=[EmailSystem] Update email management system - !mydate! !mytime!

git commit -m "!COMMIT_MESSAGE!"
if errorlevel 1 (
    echo ERROR: Failed to commit
    exit /b 1
)
echo [OK] Committed: !COMMIT_MESSAGE!

REM Push to GitHub
echo Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo Trying alternative branch (master)...
    git push origin master
    if errorlevel 1 (
        echo ERROR: Failed to push to GitHub
        exit /b 1
    )
)
echo [OK] Pushed to GitHub
echo.

:skip_commit

REM Deploy to Supabase
echo ======================================
echo Deploying to Supabase...
echo ======================================
echo.

echo Deploying send-email function...
call supabase functions deploy send-email --project-id !SUPABASE_PROJECT_ID!
if errorlevel 1 (
    echo ERROR: Failed to deploy send-email function
    exit /b 1
)
echo [OK] send-email function deployed

echo Deploying retry-failed-email function...
call supabase functions deploy retry-failed-email --project-id !SUPABASE_PROJECT_ID!
if errorlevel 1 (
    echo ERROR: Failed to deploy retry-failed-email function
    exit /b 1
)
echo [OK] retry-failed-email function deployed
echo.

REM Optional: Push database migrations
set /p push_migrations="Push database migrations to Supabase? (y/n) "
if /i "!push_migrations!"=="y" (
    echo Pushing migrations...
    call supabase db push --project-id !SUPABASE_PROJECT_ID!
    echo [OK] Migrations pushed
    echo.
)

REM Verify deployment
echo ======================================
echo Verifying Deployment...
echo ======================================
echo.

echo [OK] GitHub commit:
git log -1 --oneline
echo.

echo [OK] Supabase functions:
call supabase functions list --project-id !SUPABASE_PROJECT_ID!
echo.

echo ======================================
echo Deployment Complete!
echo ======================================
echo.
echo Your email management system has been deployed to:
echo   * GitHub: https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling/
echo   * Supabase: https://app.supabase.com/projects/!SUPABASE_PROJECT_ID!
echo.
pause
