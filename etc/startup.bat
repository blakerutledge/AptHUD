@echo off
@setlocal
@setlocal enableextensions
@cd /d "%~dp0"

cd ..

if not exist ".\.env" (

	echo ERROR: No .env file exists. Creating from defaults.

	echo F|xcopy /S /Q /Y /F ".\etc\.env-example" ".\.env"

)

rem KILL TOUCH and EXPLORER AND PREVIOUS AMPMS
taskkill /f /im explorer.exe /fi "memusage gt 2"
taskkill /f /im node.exe /fi "memusage gt 2"
taskkill /f /im TouchDesigner099.exe /fi "memusage gt 2"

rem rem START APPLICATION
START visual\apthud2020.toe