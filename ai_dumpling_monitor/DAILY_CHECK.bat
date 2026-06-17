@echo off
:: 水饺店AI情报系统 - 每日快速检查
:: 使用方法：双击运行，或添加到Windows计划任务
cd /d "%~dp0"
echo [%date% %time%] ===== 水饺店AI情报系统每日检查 =====
python -c "
import sys
sys.path.insert(0, '.')
try:
    from apis import FREE_API_QUOTAS, get_quota_summary
    print(get_quota_summary())
except ImportError as e:
    print(f'模块导入失败: {e}')
    print('请确保已安装Python依赖: pip install httpx')
"
echo.
echo 检查完成，按任意键退出...
pause >nul
