@echo off
chcp 65001 >nul
echo ========================================================
echo       TỰ ĐỘNG TẠO REPOSITORY VÀ ĐẨY CODE LÊN GITHUB
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/3] Kiem tra dang nhap GitHub...
"C:\Program Files\GitHub CLI\gh.exe" auth status >nul 2>&1
if %errorlevel% neq 0 (
    echo Ban chua dang nhap GitHub tren may nay.
    echo He thong se mo trinh duyet de ban xac nhan dang nhap...
    echo.
    "C:\Program Files\GitHub CLI\gh.exe" auth login -h github.com -p https -w
)

echo.
echo [2/3] Dang tao repository tren GitHub va day code len...
"C:\Program Files\GitHub CLI\gh.exe" repo create translate-kr-vn --public --source=. --remote=origin --push

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  THANH CONG! CODE DA DUOC DAY LEN GITHUB:
    echo  https://github.com/thanhdatck94-gif/translate-kr-vn
    echo ========================================================
) else (
    echo.
    echo Thu day len repository origin hien tai...
    git push -u origin main
)

echo.
pause
