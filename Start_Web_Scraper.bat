@echo off
echo ==============================================
echo       Starting Interactive Web Scraper
echo ==============================================
echo.

cd /d "%~dp0"

echo [1/3] Checking dependencies...
python -m pip install -r requirements.txt --quiet

echo [2/3] Opening browser...
start http://127.0.0.1:5000

echo [3/3] Starting server...
echo Press CTRL+C to stop the server when you are done.
echo.
python app.py
pause
