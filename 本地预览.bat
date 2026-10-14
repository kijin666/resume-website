@echo off
chcp 65001 >nul
title 本地预览 - 个人网页简历
echo.
echo   正在用默认浏览器打开 index.html ...
echo   （如果浏览器没反应，请手动双击 index.html）
echo.
start "" "%~dp0index.html"
echo   预览完成后直接关闭本窗口即可。
echo.
timeout /t 3 >nul
