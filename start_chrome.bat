@echo off
setlocal

REM Definér profilmappen som en variabel for nem vedligeholdelse
set "profilePath=C:\Webdriver\temp\profile\Default"

REM Tjek om profilmappen (Default) findes – opret den, hvis ikke
if not exist "%profilePath%" (
    mkdir "%profilePath%"
    echo Mapper oprettet: %profilePath%
) else (
    echo Folder exists: %profilePath%
)

REM Uanset om mappen var ny eller allerede eksisterer, startes Chrome her
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:\Webdriver\temp\profile" --profile-directory=Default

exit /b