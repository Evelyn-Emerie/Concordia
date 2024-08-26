npx expo export --output-dir ./electron/dist --platform web
npx electron-packager . ChatThingie --platform=win32,linux,darwin --arch=x64 --overwrite