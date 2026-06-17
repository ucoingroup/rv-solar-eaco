# -*- coding: utf-8 -*-
"""
水饺店AI情报监控系统
每周自动更新三城市场动态 + 全球AI工具API额度变化
"""
import os
import json
import time
import logging
from datetime import datetime
from pathlib import Path

# ============ 核心配置 ============
WORKSPACE = Path(r"C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\ai_dumpling_monitor")
REPORT_DIR = WORKSPACE / "reports"
LOG_DIR = WORKSPACE / "logs"

# API Key配置（请填入真实Key）
API_KEYS = {
    "zhipu": os.getenv("ZHIPU_API_KEY", ""),          # 智谱AI
    "siliconflow": os.getenv("SILICONFLOW_API_KEY", ""),  # 硅基流动
    "deepseek": os.getenv("DEEPSEEK_API_KEY", ""),    # DeepSeek
    "gemini": os.getenv("GEMINI_API_KEY", ""),        # Google Gemini
}

CITIES = ["重庆", "上海", "广东"]

# ============ 日志配置 ============
def setup_logging():
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.FileHandler(LOG_DIR / f"monitor_{datetime.now().strftime('%Y%m%d')}.log", encoding="utf-8"),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger("DumplingAI")
