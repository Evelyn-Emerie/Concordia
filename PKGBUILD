# Maintainer: Evelyn Rei, evelyn.rei@staryhub.net

pkgname=concordia
pkgver=1.0.0
pkgrel=1
pkgdesc="A client to use alongside Concordia-Server, an alternative to discord with privacy in mind"
arch=('x86_64')
url="https://staryhub.net"
license=('MIT')
depends=()
source=()
sha256sums=()

package() {
    # Create the /opt/your-package directory
    install -d "$pkgdir/opt/concordia"
    
    # Copy all contents directly from the directory containing the PKGBUILD
    cp -r "$srcdir/"* "$pkgdir/opt/concordia/"
    cp -r "$srcdir/../../../assets" "$pkgdir/opt/concordia/resources/assets"
    
    install -Dm644 "$srcdir/Concordia.desktop" "$pkgdir/usr/share/applications/Concordia.desktop"
}

post_install(){
    ln -s /opt/concordia/Concordia /usr/bin/Concordia
}
