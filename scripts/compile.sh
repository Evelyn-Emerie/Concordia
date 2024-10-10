npm i
npx expo export --output-dir ./electron/dist --platform web

cd electron
npm i
npx electron-packager . Concordia --platform=linux --arch=x64 --overwrite --out "./output/"
mv ./output/Concordia-linux-x64 ./output/src
cp ../PKGBUILD ./output/PKGBUILD
cp ../Concordia.desktop ./output/src/Concordia.desktop
cd output
makepkg si -f
rm -r pkg
rm -r src
rm PKGBUILD
cd ..