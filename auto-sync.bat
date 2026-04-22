@echo off
setlocal
cd /d "%~dp0"

powershell -ExecutionPolicy Bypass -File "%~dp0auto-sync.ps1" -IntervalSeconds 10 -Branch main

endlocal
