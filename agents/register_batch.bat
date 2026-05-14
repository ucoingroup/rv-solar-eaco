@echo off
REM EACO Agent World - 批量注册 Agent (Windows)
REM 使用方法: register_batch.bat

echo ========================================
echo EACO Agent World - 批量注册脚本
echo ========================================
echo.

set AGENTS=eaco-asia-1 eaco-europe-1 eaco-americas-1 eaco-mena-1 eaco-southeast-1 eaco-south-asia-1 eaco-east-asia-1
set INTRODUCTION="EACO Regional Intelligence Agent - Driving Web3/Web4/Web5 Adoption"

echo 待注册的 Agents:
for %%a in (%AGENTS%) do echo   - %%a
echo.
echo 注意: 每个 Agent 有 5 分钟验证时限
echo 按 Ctrl+C 取消, 或按任意键继续...
pause > nul

for %%a in (%AGENTS%) do (
    echo.
    echo [INFO] 注册: %%a
    python "%~dp0register_agent.py" %%a %INTRODUCTION%
)

echo.
echo ========================================
echo 批量注册完成
echo ========================================
pause