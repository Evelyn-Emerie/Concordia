@echo off

echo Checking packages...
call npm i

echo Compiling app to static
call npx expo export --output-dir ./electron/dist --platform web >NUL 2>&1


cd electron
echo Checking packages
call npm i

echo Compiling app to .exe package
call npx electron-packager . Concordia --platform=win32,linux,darwin --arch=x64 --overwrite --out ".\output" >NUL 2>&1
cd ..

echo Opening output directory
explorer ".\electron\output"

timeout /t 3