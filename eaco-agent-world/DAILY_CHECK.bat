@echo off
chcp 65001 >nul
echo ================================================
echo EACO Agent World - Daily Status Check
echo ================================================
echo.

cd /d "%~dp0..\.."

echo [INFO] Running monitor script...
python eaco-agent-world\monitor.py

echo.
echo [INFO] Daily check completed.
echo [INFO] Report saved to agents\monitor_report.json
echo.

pause