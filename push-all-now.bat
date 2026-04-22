@echo off
setlocal
cd /d "%~dp0"

git add -A
git commit -m "Manual all-sync %date% %time%"
git push origin main

where supabase >nul 2>nul
if %errorlevel%==0 (
  supabase db push
) else (
  echo Supabase CLI not found. Install Supabase CLI to push DB migrations.
)

endlocal
