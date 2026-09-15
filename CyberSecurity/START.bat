@echo off
setlocal
set "DECK=%~dp0index.html"
set "EDGE_X86=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
set "EDGE_X64=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

if exist "%EDGE_X86%" (
  start "" "%EDGE_X86%" --start-fullscreen --allow-file-access-from-files "%DECK%"
  exit /b 0
)

if exist "%EDGE_X64%" (
  start "" "%EDGE_X64%" --start-fullscreen --allow-file-access-from-files "%DECK%"
  exit /b 0
)

start "" "%DECK%"
