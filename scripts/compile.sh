npx expo export --output-dir ./electron/dist --platform web
cd electron
npx electron-packager . Concordia --platform=win32,linux,darwin --arch=x64 --overwrite