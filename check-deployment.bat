@echo off
REM Email Management System - Pre-deployment Checker
REM Verifies that all prerequisites are met before deploying

setlocal enabledelayedexpansion

echo.
echo ======================================
echo  Deployment Pre-Check
echo ======================================
echo.

set /a checks_passed=0
set /a checks_failed=0

REM ======================================
REM CORE REQUIREMENTS
REM ======================================
echo === CORE REQUIREMENTS ===
echo.

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo [FAILED] Git is not installed
    set /a checks_failed+=1
) else (
    echo [OK] Git installed
    set /a checks_passed+=1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [FAILED] Node.js is not installed
    set /a checks_failed+=1
) else (
    echo [OK] Node.js installed
    set /a checks_passed+=1
)

REM Check Supabase CLI
supabase --version >nul 2>&1
if errorlevel 1 (
    echo [FAILED] Supabase CLI is not installed
    echo   Install with: npm install -g supabase
    set /a checks_failed+=1
) else (
    echo [OK] Supabase CLI installed
    set /a checks_passed+=1
)

echo.
echo === CONFIGURATION FILES ===
echo.

REM Check .env.local
if exist ".env.local" (
    echo [OK] .env.local found
    set /a checks_passed+=1
) else (
    echo [FAILED] .env.local not found
    echo   Create from: .env.example
    set /a checks_failed+=1
)

REM Check .gitignore
if exist ".gitignore" (
    echo [OK] .gitignore found
    set /a checks_passed+=1
) else (
    echo [FAILED] .gitignore not found
    set /a checks_failed+=1
)

echo.
echo === DATABASE FILES ===
echo.

REM Check database schema
if exist "supabase\migrations\20260424_email_management_system.sql" (
    echo [OK] Database schema found
    set /a checks_passed+=1
) else (
    echo [FAILED] Database schema not found
    set /a checks_failed+=1
)

REM Check RLS policies
if exist "supabase\migrations\20260424_rls_policies.sql" (
    echo [OK] RLS policies found
    set /a checks_passed+=1
) else (
    echo [FAILED] RLS policies not found
    set /a checks_failed+=1
)

echo.
echo === EDGE FUNCTIONS ===
echo.

REM Check send-email function
if exist "supabase\functions\send-email\index.ts" (
    echo [OK] send-email function found
    set /a checks_passed+=1
) else (
    echo [FAILED] send-email function not found
    set /a checks_failed+=1
)

REM Check retry-failed-email function
if exist "supabase\functions\retry-failed-email\index.ts" (
    echo [OK] retry-failed-email function found
    set /a checks_passed+=1
) else (
    echo [FAILED] retry-failed-email function not found
    set /a checks_failed+=1
)

REM Check shared CORS file
if exist "supabase\functions\_shared\cors.ts" (
    echo [OK] Shared CORS utilities found
    set /a checks_passed+=1
) else (
    echo [FAILED] Shared CORS utilities not found
    set /a checks_failed+=1
)

echo.
echo === FRONTEND FILES ===
echo.

REM Check HTML
if exist "email-dashboard.html" (
    echo [OK] email-dashboard.html found
    set /a checks_passed+=1
) else (
    echo [FAILED] email-dashboard.html not found
    set /a checks_failed+=1
)

REM Check CSS
if exist "email-dashboard.css" (
    echo [OK] email-dashboard.css found
    set /a checks_passed+=1
) else (
    echo [FAILED] email-dashboard.css not found
    set /a checks_failed+=1
)

REM Check JS files
if exist "email-dashboard.js" (
    echo [OK] email-dashboard.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] email-dashboard.js not found
    set /a checks_failed+=1
)

if exist "config.js" (
    echo [OK] config.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] config.js not found
    set /a checks_failed+=1
)

if exist "supabase-client.js" (
    echo [OK] supabase-client.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] supabase-client.js not found
    set /a checks_failed+=1
)

if exist "api-service.js" (
    echo [OK] api-service.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] api-service.js not found
    set /a checks_failed+=1
)

if exist "email-composer.js" (
    echo [OK] email-composer.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] email-composer.js not found
    set /a checks_failed+=1
)

echo.
echo === DOCUMENTATION ===
echo.

REM Check documentation files
if exist "EMAIL_SETUP_GUIDE.md" (
    echo [OK] EMAIL_SETUP_GUIDE.md found
    set /a checks_passed+=1
) else (
    echo [WARNING] EMAIL_SETUP_GUIDE.md not found
)

if exist "EMAIL_SYSTEM_README.md" (
    echo [OK] EMAIL_SYSTEM_README.md found
    set /a checks_passed+=1
) else (
    echo [WARNING] EMAIL_SYSTEM_README.md not found
)

if exist "DEPLOYMENT.md" (
    echo [OK] DEPLOYMENT.md found
    set /a checks_passed+=1
) else (
    echo [WARNING] DEPLOYMENT.md not found
)

echo.
echo === GIT SETUP ===
echo.

REM Check git repository
if exist ".git" (
    echo [OK] Git repository initialized
    set /a checks_passed+=1
) else (
    echo [WARNING] Git repository not initialized
    echo   Run: git init
)

REM Check remote
git remote -v >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Git remote not set
    echo   Run: git remote add origin https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling.git
) else (
    echo [OK] Git remote configured
    set /a checks_passed+=1
)

echo.
echo === ENVIRONMENT VARIABLES ===
echo.

REM Check required env vars in .env.local
set "url_found="
set "anon_key_found="
set "service_key_found="
set "sendgrid_key_found="

for /f "tokens=*" %%i in (.env.local) do (
    echo %%i | findstr /c:"VITE_SUPABASE_URL=" >nul && set "url_found=1"
    echo %%i | findstr /c:"VITE_SUPABASE_ANON_KEY=" >nul && set "anon_key_found=1"
    echo %%i | findstr /c:"SUPABASE_SERVICE_ROLE_KEY=" >nul && set "service_key_found=1"
    echo %%i | findstr /c:"SENDGRID_API_KEY=" >nul && set "sendgrid_key_found=1"
)

if defined url_found (
    echo [OK] VITE_SUPABASE_URL configured
    set /a checks_passed+=1
) else (
    echo [FAILED] VITE_SUPABASE_URL not set in .env.local
    set /a checks_failed+=1
)

if defined anon_key_found (
    echo [OK] VITE_SUPABASE_ANON_KEY configured
    set /a checks_passed+=1
) else (
    echo [FAILED] VITE_SUPABASE_ANON_KEY not set in .env.local
    set /a checks_failed+=1
)

if defined service_key_found (
    echo [OK] SUPABASE_SERVICE_ROLE_KEY configured
    set /a checks_passed+=1
) else (
    echo [FAILED] SUPABASE_SERVICE_ROLE_KEY not set in .env.local
    set /a checks_failed+=1
)

if defined sendgrid_key_found (
    echo [OK] SENDGRID_API_KEY configured
    set /a checks_passed+=1
) else (
    echo [FAILED] SENDGRID_API_KEY not set in .env.local
    set /a checks_failed+=1
)

echo.
echo === GITHUB ACTIONS ===
echo.

if exist ".github\workflows\deploy.yml" (
    echo [OK] GitHub Actions deploy workflow found
    set /a checks_passed+=1
) else (
    echo [WARNING] GitHub Actions deploy workflow not found
)

if exist ".github\workflows\verify.yml" (
    echo [OK] GitHub Actions verify workflow found
    set /a checks_passed+=1
) else (
    echo [WARNING] GitHub Actions verify workflow not found
)

echo.
echo ======================================
echo  SUMMARY
echo ======================================
echo.
echo Checks passed: !checks_passed!
echo Checks failed: !checks_failed!
echo.

if !checks_failed! equ 0 (
    echo [SUCCESS] All checks passed! You're ready to deploy.
    echo.
    echo Next step:
    echo   .\deploy.bat
    echo.
) else (
    echo [ERROR] !checks_failed! check(s) failed. Please fix issues above.
    echo.
    echo For help, see:
    echo   - DEPLOYMENT.md
    echo   - EMAIL_SETUP_GUIDE.md
    echo.
)

pause
if errorlevel 1 (
    echo [FAILED] Node.js is not installed
    set /a checks_failed+=1
) else (
    echo [OK] Node.js installed
    set /a checks_passed+=1
)

REM Check Supabase CLI
supabase --version >nul 2>&1
if errorlevel 1 (
    echo [FAILED] Supabase CLI is not installed
    echo   Install with: npm install -g supabase
    set /a checks_failed+=1
) else (
    echo [OK] Supabase CLI installed
    set /a checks_passed+=1
)

echo.
echo === CONFIGURATION FILES ===
echo.

REM Check .env.local
if exist ".env.local" (
    echo [OK] .env.local found
    set /a checks_passed+=1
) else (
    echo [FAILED] .env.local not found
    echo   Create from: .env.example
    set /a checks_failed+=1
)

REM Check .gitignore
if exist ".gitignore" (
    echo [OK] .gitignore found
    set /a checks_passed+=1
) else (
    echo [FAILED] .gitignore not found
    set /a checks_failed+=1
)

echo.
echo === DATABASE FILES ===
echo.

REM Check database schema
if exist "supabase\migrations\20260424_email_management_system.sql" (
    echo [OK] Database schema found
    set /a checks_passed+=1
) else (
    echo [FAILED] Database schema not found
    set /a checks_failed+=1
)

REM Check RLS policies
if exist "supabase\migrations\20260424_rls_policies.sql" (
    echo [OK] RLS policies found
    set /a checks_passed+=1
) else (
    echo [FAILED] RLS policies not found
    set /a checks_failed+=1
)

echo.
echo === EDGE FUNCTIONS ===
echo.

REM Check send-email function
if exist "supabase\functions\send-email\index.ts" (
    echo [OK] send-email function found
    set /a checks_passed+=1
) else (
    echo [FAILED] send-email function not found
    set /a checks_failed+=1
)

REM Check retry-failed-email function
if exist "supabase\functions\retry-failed-email\index.ts" (
    echo [OK] retry-failed-email function found
    set /a checks_passed+=1
) else (
    echo [FAILED] retry-failed-email function not found
    set /a checks_failed+=1
)

REM Check shared CORS file
if exist "supabase\functions\_shared\cors.ts" (
    echo [OK] Shared CORS utilities found
    set /a checks_passed+=1
) else (
    echo [FAILED] Shared CORS utilities not found
    set /a checks_failed+=1
)

echo.
echo === FRONTEND FILES ===
echo.

REM Check HTML
if exist "email-dashboard.html" (
    echo [OK] email-dashboard.html found
    set /a checks_passed+=1
) else (
    echo [FAILED] email-dashboard.html not found
    set /a checks_failed+=1
)

REM Check CSS
if exist "email-dashboard.css" (
    echo [OK] email-dashboard.css found
    set /a checks_passed+=1
) else (
    echo [FAILED] email-dashboard.css not found
    set /a checks_failed+=1
)

REM Check JS files
if exist "email-dashboard.js" (
    echo [OK] email-dashboard.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] email-dashboard.js not found
    set /a checks_failed+=1
)

if exist "config.js" (
    echo [OK] config.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] config.js not found
    set /a checks_failed+=1
)

if exist "supabase-client.js" (
    echo [OK] supabase-client.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] supabase-client.js not found
    set /a checks_failed+=1
)

if exist "api-service.js" (
    echo [OK] api-service.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] api-service.js not found
    set /a checks_failed+=1
)

if exist "email-composer.js" (
    echo [OK] email-composer.js found
    set /a checks_passed+=1
) else (
    echo [FAILED] email-composer.js not found
    set /a checks_failed+=1
)

echo.
echo === DOCUMENTATION ===
echo.

REM Check documentation files
if exist "EMAIL_SETUP_GUIDE.md" (
    echo [OK] EMAIL_SETUP_GUIDE.md found
    set /a checks_passed+=1
) else (
    echo [WARNING] EMAIL_SETUP_GUIDE.md not found
)

if exist "EMAIL_SYSTEM_README.md" (
    echo [OK] EMAIL_SYSTEM_README.md found
    set /a checks_passed+=1
) else (
    echo [WARNING] EMAIL_SYSTEM_README.md not found
)

if exist "DEPLOYMENT.md" (
    echo [OK] DEPLOYMENT.md found
    set /a checks_passed+=1
) else (
    echo [WARNING] DEPLOYMENT.md not found
)

echo.
echo === GIT SETUP ===
echo.

REM Check git repository
if exist ".git" (
    echo [OK] Git repository initialized
    set /a checks_passed+=1
) else (
    echo [WARNING] Git repository not initialized
    echo   Run: git init
)

REM Check remote
git remote -v >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Git remote not set
    echo   Run: git remote add origin https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling.git
) else (
    echo [OK] Git remote configured
    set /a checks_passed+=1
)

echo.
echo === ENVIRONMENT VARIABLES ===
echo.

REM Check required env vars in .env.local
for /f "usebackq tokens=2 delims==" %%i in (`findstr "VITE_SUPABASE_URL" .env.local 2^>nul`) do set "url=%%i"
for /f "usebackq tokens=2 delims==" %%i in (`findstr "VITE_SUPABASE_ANON_KEY" .env.local 2^>nul`) do set "anon_key=%%i"
for /f "usebackq tokens=2 delims==" %%i in (`findstr "SUPABASE_SERVICE_ROLE_KEY" .env.local 2^>nul`) do set "service_key=%%i"
for /f "usebackq tokens=2 delims==" %%i in (`findstr "SENDGRID_API_KEY" .env.local 2^>nul`) do set "sendgrid_key=%%i"

if not "!url!"=="" (
    echo [OK] VITE_SUPABASE_URL configured
    set /a checks_passed+=1
) else (
    echo [FAILED] VITE_SUPABASE_URL not set in .env.local
    set /a checks_failed+=1
)

if not "!anon_key!"=="" (
    echo [OK] VITE_SUPABASE_ANON_KEY configured
    set /a checks_passed+=1
) else (
    echo [FAILED] VITE_SUPABASE_ANON_KEY not set in .env.local
    set /a checks_failed+=1
)

if not "!service_key!"=="" (
    echo [OK] SUPABASE_SERVICE_ROLE_KEY configured
    set /a checks_passed+=1
) else (
    echo [FAILED] SUPABASE_SERVICE_ROLE_KEY not set in .env.local
    set /a checks_failed+=1
)

if not "!sendgrid_key!"=="" (
    echo [OK] SENDGRID_API_KEY configured
    set /a checks_passed+=1
) else (
    echo [FAILED] SENDGRID_API_KEY not set in .env.local
    set /a checks_failed+=1
)

echo.
echo === GITHUB ACTIONS ===
echo.

if exist ".github\workflows\deploy.yml" (
    echo [OK] GitHub Actions deploy workflow found
    set /a checks_passed+=1
) else (
    echo [WARNING] GitHub Actions deploy workflow not found
)

if exist ".github\workflows\verify.yml" (
    echo [OK] GitHub Actions verify workflow found
    set /a checks_passed+=1
) else (
    echo [WARNING] GitHub Actions verify workflow not found
)

echo.
echo ======================================
echo  SUMMARY
echo ======================================
echo.
echo Checks passed: !checks_passed!
echo Checks failed: !checks_failed!
echo.

if !checks_failed! equ 0 (
    echo [SUCCESS] All checks passed! You're ready to deploy.
    echo.
    echo Next step:
    echo   .\deploy.bat
    echo.
) else (
    echo [ERROR] !checks_failed! check(s) failed. Please fix issues above.
    echo.
    echo For help, see:
    echo   - DEPLOYMENT.md
    echo   - EMAIL_SETUP_GUIDE.md
    echo.
)

pause
