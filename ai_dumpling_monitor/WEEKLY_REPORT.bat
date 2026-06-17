@echo off
:: 水饺店AI情报系统 - 每周自动报告生成
:: 设置Windows计划任务：schtasks /create /tn "DumplingAI_WeeklyReport" /tr "python C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\ai_dumpling_monitor\weekly_report.py" /sc weekly /d MON /st 09:00
cd /d "%~dp0"
echo [%date% %time%] ===== 水饺店AI情报周报生成 =====

python weekly_report.py

if %errorlevel% equ 0 (
    echo.
    echo ===== 周报生成成功 =====
    echo 报告路径: %~dp0reports\
    dir /b /o-d "%~dp0reports\"
) else (
    echo.
    echo [错误] 周报生成失败，错误码: %errorlevel%
)

echo.
echo 按任意键退出...
pause >nul
