@echo off
setlocal
cd /d "%~dp0"

git add -A
git commit -m "Manual update %date% %time%"
git push origin main

endlocal
