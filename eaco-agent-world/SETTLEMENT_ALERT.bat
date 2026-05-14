@echo off
chcp 65001 >nul
echo ================================================
echo EACO Agent World - Settlement Day Check
echo ================================================
echo.

cd /d "%~dp0..\.."

echo [INFO] Checking if today is settlement day...

python -c "from datetime import datetime as dt; t = dt.now(); dow = t.weekday(); day_name = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][dow]; print('Today:', day_name, t.strftime('%%Y-%%m-%%d')); is_mon = dow == 0; print('Is Monday:', is_mon); import sys; sys.exit(0 if is_mon else 1)" 

if errorlevel 1 (
    echo.
    echo [INFO] Today is NOT a settlement day.
    echo [INFO] Next settlement: Next Monday 02:00 Beijing Time
    echo.
) else (
    echo.
    echo [ALERT] TODAY IS SETTLEMENT DAY!
    echo [ALERT] Settlement time: 02:00 Beijing Time (tonight)
    echo [ALERT] Check your wallet for incoming funds!
    echo.
)

pause