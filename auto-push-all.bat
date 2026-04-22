@echo off
setlocal
cd /d "%~dp0"

powershell -ExecutionPolicy Bypass -File "%~dp0auto-push-all.ps1" -IntervalSeconds 15 -Branch main -RunSupabase

endlocal
