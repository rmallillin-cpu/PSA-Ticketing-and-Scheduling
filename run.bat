@echo off
setlocal

set PORT=8080
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
  echo Starting PSA Ticketing and Schedule Portal at http://localhost:%PORT%/login.html
  start "" http://localhost:%PORT%/login.html
  python -m http.server %PORT%
) else (
  echo Python is not installed. Opening login page directly.
  start "" "%~dp0login.html"
)

endlocal