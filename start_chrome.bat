@echo off

REM Tjek om profilmappen (Default) findes – opret den, hvis ikke
if not exist "C:\Webdriver\temp\profile\Default" (
    mkdir "C:\Webdriver\temp\profile\Default"
    echo Mapper oprettet: C:\Webdriver\temp\profile\Default
) else (
    echo Folder exists: C:\Webdriver\temp\profile\Default
)

REM Start Chrome med brugerdata (user-data-dir) sat til temp\profile og profile-directory=Default
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
    --user-data-dir="C:\Webdriver\temp\profile" ^
    --profile-directory=Default

exit